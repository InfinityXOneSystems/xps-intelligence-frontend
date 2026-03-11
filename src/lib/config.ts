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

if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
  console.warn(
    '[XPS] VITE_API_URL is not set — using http://localhost:3000/api. ' +
      'Ensure the backend is running on port 3000.'
  )
}
