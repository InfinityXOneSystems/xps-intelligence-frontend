/**
 * session.ts
 *
 * Browser-side session utility for XPS Intelligence.
 *
 * The session itself is stored in an httpOnly cookie set by the Vercel
 * serverless layer (/api/auth/github/callback). This module only provides
 * helpers to:
 *   - Query the current session (calls /api/auth/session)
 *   - Determine whether the user is authenticated as admin
 *   - Initiate GitHub OAuth flow
 *   - Logout
 *
 * SECURITY: No tokens are stored in localStorage or JS-accessible state.
 * The server-side cookie is the single source of truth.
 */

import { getJson, postJson } from '@/lib/http/safeJson'

export interface Session {
  authenticated: boolean
  login?: string
  name?: string
  avatarUrl?: string
  role?: 'admin' | 'viewer'
  /** ISO timestamp */
  expiresAt?: string
}

/** Shape of the raw body returned by /api/auth/session (server uses successResponse wrapper) */
interface SessionApiBody {
  ok: boolean
  data?: { session?: Session }
}

let _cached: Session | null = null
let _fetchPromise: Promise<Session> | null = null

/**
 * Fetch the current session from the server.
 * Results are cached in memory for the lifetime of the page.
 * Pass `force = true` to re-fetch (e.g. after login/logout).
 */
export async function getSession(force = false): Promise<Session> {
  if (_cached && !force) return _cached

  if (_fetchPromise && !force) return _fetchPromise

  _fetchPromise = (async () => {
    const result = await getJson<SessionApiBody>('/api/auth/session', undefined, 5000)
    // safeJson returns { ok, data: <parsed body> }
    // The parsed body is { ok, data: { session: ... } } (successResponse envelope)
    const session = result.ok ? result.data?.data?.session : undefined
    _cached = session ?? { authenticated: false }
    _fetchPromise = null
    return _cached
  })()

  return _fetchPromise
}

/**
 * Returns true if the current user is authenticated as admin.
 */
export async function isAdmin(): Promise<boolean> {
  const s = await getSession()
  return s.authenticated && s.role === 'admin'
}

/**
 * Redirect the browser to the GitHub OAuth start URL.
 */
export function startGitHubLogin(returnTo?: string): void {
  const url = new URL('/api/auth/github/start', window.location.origin)
  if (returnTo) url.searchParams.set('return_to', returnTo)
  window.location.href = url.toString()
}

/**
 * Log out the current session.
 */
export async function logout(): Promise<void> {
  await postJson('/api/auth/logout', {})
  _cached = null
  _fetchPromise = null
}

/**
 * Clear in-memory session cache (called after login/logout callbacks).
 */
export function clearSessionCache(): void {
  _cached = null
  _fetchPromise = null
}
