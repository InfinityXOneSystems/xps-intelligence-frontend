/**
 * POST /api/docker-sync
 * Webhook receiver for Docker Desktop / local machine sync.
 * Receives push notifications from the Docker Desktop webhook receiver
 * (docker/webhook-receiver) and relays to the backend Railway service.
 *
 * Signature validation: X-Hub-Signature-256 header (same format as GitHub webhooks).
 */
import crypto from 'crypto'

function verifySignature(payload, signature, secret) {
  if (!secret) {
    // No secret configured — log a warning but allow in dev (not production-safe)
    console.warn('[docker-sync] DOCKER_WEBHOOK_SECRET not set — signature verification skipped. Set this secret in production.')
    return true
  }
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature || ''))
  } catch {
    return false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Read raw body for signature verification
  const rawBody = JSON.stringify(req.body)
  const signature = req.headers['x-hub-signature-256'] || ''
  const secret = process.env.DOCKER_WEBHOOK_SECRET || process.env.GITHUB_WEBHOOK_SECRET

  if (!verifySignature(rawBody, signature, secret)) {
    return res.status(401).json({ error: 'Invalid webhook signature' })
  }

  const event = req.headers['x-docker-event'] || req.headers['x-github-event'] || 'push'
  const payload = req.body

  const backendUrl = process.env.BACKEND_URL || 'https://xpsintelligencesystem-production.up.railway.app'

  try {
    const r = await fetch(`${backendUrl}/api/sync/docker`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Docker-Event': event,
        'X-Source': 'vercel-api',
      },
      body: JSON.stringify({
        event,
        payload,
        receivedAt: new Date().toISOString(),
        source: 'docker-desktop',
      }),
    })

    const responseText = await r.text()
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch {
      responseData = { message: responseText }
    }

    console.log(`[docker-sync] Event=${event} backend_status=${r.status}`)
    return res.status(202).json({
      status: 'accepted',
      event,
      backendStatus: r.status,
      backendResponse: responseData,
    })
  } catch (err) {
    console.error('[docker-sync] Error:', err)
    // Accept the webhook even if backend is down — prevents Docker from retrying endlessly
    return res.status(202).json({
      status: 'accepted',
      event,
      warning: 'Backend relay failed — event queued for retry',
      error: err.message,
    })
  }
}
