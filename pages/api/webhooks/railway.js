/**
 * pages/api/webhooks/railway.js
 *
 * Vercel Serverless Function — Railway Webhook Receiver
 *
 * Railway sends a POST request to this endpoint for critical project events.
 * Configure this URL in your Railway project:
 *   Settings → Webhooks → New Webhook
 *   URL: https://<your-vercel-domain>/api/webhooks/railway
 *   Events: DEPLOY_FAILED, DEPLOY_SUCCEEDED, SERVICE_CRASH, VOLUME_FULL, etc.
 *
 * This handler:
 *   1. Validates the incoming Railway event
 *   2. Logs the event to the Supabase `webhook_events` table
 *   3. On critical failure events, triggers the Vercel deploy hook
 *      (VERCEL_DEPLOY_HOOK env var) for autonomous redeploy
 *
 * Required environment variables (set in Vercel project settings):
 *   NEXT_PUBLIC_SUPABASE_URL      — Supabase project URL (set by Supabase integration)
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase anon key (set by Supabase integration)
 *   VERCEL_DEPLOY_HOOK            — Vercel deploy hook URL for autonomous redeploy
 *     (server-side only — never expose via VITE_ or NEXT_PUBLIC_ prefix)
 */

import { createClient } from '@supabase/supabase-js'

/** Railway event types that should trigger an autonomous Vercel redeploy. */
const REDEPLOY_TRIGGERS = new Set([
  'DEPLOY_FAILED',
  'SERVICE_CRASH',
  'BUILD_FAILED',
])

/** Railway event types considered critical (always logged with high priority). */
const CRITICAL_EVENTS = new Set([
  'DEPLOY_FAILED',
  'SERVICE_CRASH',
  'BUILD_FAILED',
  'VOLUME_FULL',
  'DATABASE_UNHEALTHY',
  'ENVIRONMENT_DELETED',
])

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Missing or invalid request body' })
  }

  const payload = req.body
  const eventType = (payload.type || payload.event_type || 'UNKNOWN').toUpperCase()
  const projectId = payload.project?.id || payload.projectId || 'unknown'
  const environmentName = payload.environment?.name || payload.environmentName || 'unknown'

  // ── Log to Supabase ──────────────────────────────────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const db = createClient(supabaseUrl, supabaseKey)
      await db.from('webhook_events').insert({
        source: 'railway',
        event_type: eventType,
        payload,
        received_at: new Date().toISOString(),
      })
    } catch (err) {
      // Non-fatal — log and continue
      console.error('[railway-webhook] Supabase insert error:', err?.message || err)
    }
  } else {
    console.warn('[railway-webhook] Supabase env vars not set — event not persisted')
  }

  // ── Trigger Vercel redeploy on critical failure events ────────────────────────
  const deployHook = process.env.VERCEL_DEPLOY_HOOK
  if (deployHook && REDEPLOY_TRIGGERS.has(eventType)) {
    try {
      const deployRes = await fetch(deployHook, { method: 'POST' })
      if (!deployRes.ok) {
        console.error(
          `[railway-webhook] Vercel deploy hook returned ${deployRes.status} for event ${eventType}`
        )
      } else {
        console.log(
          `[railway-webhook] Vercel redeploy triggered for ${eventType} in project ${projectId} env ${environmentName}`
        )
      }
    } catch (err) {
      console.error('[railway-webhook] Failed to trigger Vercel deploy hook:', err?.message || err)
    }
  }

  const isCritical = CRITICAL_EVENTS.has(eventType)
  if (isCritical) {
    console.warn(
      `[railway-webhook] CRITICAL event received: ${eventType} | project=${projectId} env=${environmentName}`
    )
  }

  return res.status(200).json({
    ok: true,
    event: eventType,
    critical: isCritical,
    redeployTriggered: !!(deployHook && REDEPLOY_TRIGGERS.has(eventType)),
  })
}
