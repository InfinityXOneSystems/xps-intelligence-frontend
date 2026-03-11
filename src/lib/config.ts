/**
 * config.ts — Single source of truth for runtime configuration.
 *
 * All environment-specific values are read here; the rest of the app
 * imports from this module instead of accessing import.meta.env directly.
 */

export const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const WS_BASE =
  import.meta.env.VITE_WS_URL || 'ws://localhost:3000'

// ── Supabase ────────────────────────────────────────────────
// The Supabase Vercel integration automatically sets
// NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in
// the Vercel project. vite.config.ts includes 'NEXT_PUBLIC_' in
// envPrefix so these are baked into the bundle at build time.
//
// For local development, set them in .env.local using either the
// NEXT_PUBLIC_* names (recommended, matches Vercel/Supabase CLI) or
// the VITE_* aliases (legacy).
export const SUPABASE_URL =
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL ||
  ''

export const SUPABASE_ANON_KEY =
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''

if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
  console.warn(
    '[XPS] VITE_API_URL is not set — using http://localhost:3000/api. ' +
      'Ensure the backend is running on port 3000.'
  )
}

if (import.meta.env.DEV && !SUPABASE_URL) {
  console.warn(
    '[XPS] Supabase URL is not set — Supabase features will be unavailable. ' +
      'Add NEXT_PUBLIC_SUPABASE_URL (or VITE_SUPABASE_URL) to .env.local.'
  )
}
