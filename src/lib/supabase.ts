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

import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/config'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '[XPS] Supabase is not fully configured. ' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
      'are set (the Supabase Vercel integration sets these automatically).'
  )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
