/**
 * POST /api/auth/logout
 *
 * Clears the session cookie, effectively logging the user out.
 *
 * No env vars required.
 */
export const config = { runtime: 'edge' }

import { successResponse, generateTraceId, logApiCall } from '../_lib/utils'

export default async function handler(req: Request): Promise<Response> {
  const traceId = generateTraceId()
  logApiCall('POST', '/api/auth/logout', traceId)

  // Accept GET too so a plain link <a href="/api/auth/logout"> also works.
  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response(
      JSON.stringify({ ok: false, error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const clearCookie = 'xps_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'

  return new Response(JSON.stringify(successResponse({ loggedOut: true }, traceId)), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': clearCookie,
    },
  })
}
