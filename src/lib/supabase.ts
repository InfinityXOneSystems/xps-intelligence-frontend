/**
 * supabase.ts — Supabase client singleton.
 *
 * This project uses Supabase (https://nxfbfbipjsfzoefpgrof.supabase.co)
 * as its primary database and auth layer.
 *
 * The Supabase Vercel integration automatically sets these variables
 * in your Vercel project (standard Supabase names):
 *   NEXT_PUBLIC_SUPABASE_URL      — your Supabase project URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY — your Supabase project anon/public key
 *
 * vite.config.ts sets `envPrefix: ['VITE_', 'NEXT_PUBLIC_']` so these
 * are automatically baked into the Vite bundle at build time — no manual
 * VITE_* aliases are needed in your Vercel environment variables.
 *
 * For local development, copy .env.local.example to .env.local and set:
 *   NEXT_PUBLIC_SUPABASE_URL=https://nxfbfbipjsfzoefpgrof.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/config'

/**
 * Returns a configured Supabase client.
 * - In production (import.meta.env.PROD): throws if env vars are missing so
 *   misconfiguration is surfaced immediately rather than causing silent failures.
 * - In development: logs a warning and returns a placeholder client so the app
 *   still starts and shows meaningful Supabase error messages.
 */
function makeSupabaseClient(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    const msg =
      '[XPS] Supabase is not configured: NEXT_PUBLIC_SUPABASE_URL and ' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY are missing. ' +
      'In production these are set by the Supabase Vercel integration. ' +
      'For local dev, copy .env.local.example to .env.local and fill in the values.'

    if (import.meta.env.PROD) {
      // In production a misconfigured Supabase is a hard error — surface it
      // during init so it cannot cause silent data loss.
      throw new Error(msg)
    }

    console.warn(msg)
    // Dev-only: return a client with placeholder values so the app starts
    // and Supabase calls surface network errors rather than crashing on init.
    return createClient(
      'https://placeholder.supabase.co',
      'placeholder-anon-key'
    )
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

export const supabase = makeSupabaseClient()
