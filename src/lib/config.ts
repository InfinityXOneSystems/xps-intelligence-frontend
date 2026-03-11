/**
 * config.ts — Single source of truth for runtime configuration.
 *
 * All environment-specific values are read here; the rest of the app
 * imports from this module instead of accessing import.meta.env directly.
 *
 * API_URL and WS_URL are injected at build time by vite.config.ts `define`.
 * Set them in Vercel → Settings → Environment Variables (no VITE_ prefix).
 * For local dev, add them to .env.local (see .env.local.example).
 */

export const API_BASE =
  import.meta.env.API_URL || 'http://localhost:3000/api'

export const WS_BASE =
  import.meta.env.WS_URL || 'ws://localhost:3000'

// ── Supabase ────────────────────────────────────────────────
// Set automatically by the Supabase Vercel integration.
// For local dev, add NEXT_PUBLIC_SUPABASE_URL and
// NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.
export const SUPABASE_URL =
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || ''

export const SUPABASE_ANON_KEY =
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (import.meta.env.DEV && !import.meta.env.API_URL) {
  console.warn(
    '[XPS] API_URL is not set — using http://localhost:3000/api. ' +
      'Add API_URL to .env.local or set it in Vercel → Environment Variables.'
  )
}

if (import.meta.env.DEV && !SUPABASE_URL) {
  console.warn(
    '[XPS] Supabase URL is not set — Supabase features will be unavailable. ' +
      'Add NEXT_PUBLIC_SUPABASE_URL to .env.local.'
  )
}
