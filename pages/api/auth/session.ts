/**
 * GET /api/auth/session
 *
 * Returns the current session state based on the httpOnly session cookie.
 * Called by the browser-side `getSession()` helper in src/lib/session.ts.
 *
 * Response shape:
 *   { ok: true, data: { session: Session } }
 *   or
 *   { ok: true, data: { session: { authenticated: false } } }
 *
 * Env vars:
 *   SESSION_SECRET — same secret used when creating the session cookie
 */
export const config = { runtime: 'edge' }

import { successResponse, generateTraceId, logApiCall } from '../_lib/utils'

function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {}
  return Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...vs] = c.trim().split('=')
      return [k.trim(), decodeURIComponent(vs.join('='))]
    })
  )
}

const UNAUTHENTICATED = { authenticated: false as const }

export default async function handler(req: Request): Promise<Response> {
  const traceId = generateTraceId()
  logApiCall('GET', '/api/auth/session', traceId)

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ ok: false, error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const cookies = parseCookies(req.headers.get('cookie'))
  const raw = cookies.xps_session

  if (!raw) {
    return new Response(
      JSON.stringify(successResponse({ session: UNAUTHENTICATED }, traceId)),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const session = JSON.parse(atob(raw))

    // Strip internal signing field before sending to browser
    const { _s: _omit, ...publicSession } = session as { _s?: unknown; [key: string]: unknown }

    // Check expiry
    if (publicSession.expiresAt && new Date(publicSession.expiresAt as string) < new Date()) {
      return new Response(
        JSON.stringify(successResponse({ session: UNAUTHENTICATED }, traceId)),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': 'xps_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
          },
        }
      )
    }

    return new Response(
      JSON.stringify(successResponse({ session: publicSession }, traceId)),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch {
    return new Response(
      JSON.stringify(successResponse({ session: UNAUTHENTICATED }, traceId)),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'xps_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
        },
      }
    )
  }
}
