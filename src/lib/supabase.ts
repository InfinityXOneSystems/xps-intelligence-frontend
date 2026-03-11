/**
 * supabase.ts — Supabase client singleton.
 *
 * This project uses Supabase (https://nxfbfbipjsfzoefpgrof.supabase.co)
 * as its primary database and auth layer, replacing the previous
 * AWS RDS + pg setup.
 *
 * Required environment variables (set in Vercel project settings):
 *   VITE_SUPABASE_URL      — your Supabase project URL
 *   VITE_SUPABASE_ANON_KEY — your Supabase project anon/public key
 *
 * The Supabase Vercel integration automatically sets
 * NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * Because this is a Vite project (not Next.js), you must also add
 * the VITE_* equivalents in your Vercel Environment Variables settings.
 */

import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/config'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '[XPS] Supabase is not fully configured. ' +
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your ' +
      'Vercel project settings or .env.local file.'
  )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
