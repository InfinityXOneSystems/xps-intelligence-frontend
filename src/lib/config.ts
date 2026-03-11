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

/**
 * Ollama local LLM configuration.
 * VITE_OLLAMA_URL — base URL of the local Ollama instance (no secrets exposed).
 * VITE_OLLAMA_MODEL — model name to use (e.g. llama3, mistral).
 */
export const OLLAMA_BASE =
  import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434'

export const OLLAMA_MODEL =
  import.meta.env.VITE_OLLAMA_MODEL || 'llama3'

if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
  console.warn(
    '[XPS] VITE_API_URL is not set — using http://localhost:3000/api. ' +
      'Ensure the backend is running on port 3000.'
  )
}
