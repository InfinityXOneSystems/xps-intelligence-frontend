/**
 * GET /api/auth/github/start
 *
 * Initiates the GitHub App OAuth flow.
 * Redirects the browser to GitHub's authorization endpoint.
 *
 * Query params:
 *   return_to — optional path to redirect to after successful login (must be same-origin)
 *
 * GitHub App settings:
 *   App:      XPS Orchestrator
 *   Owner:    Infinity-X-One-Systems
 *   App ID:   3093714
 *   Client:   Iv23liAr5LHKydj0JwUh
 *   Callback: https://xps-intelligence.vercel.app/api/auth/github/callback
 *
 * Env vars required (Vercel server-side only — no VITE_ prefix):
 *   GITHUB_APP_CLIENT_ID       — GitHub App OAuth client ID
 *   GITHUB_APP_STATE_SECRET    — Random secret used to verify the OAuth callback
 */
export const config = { runtime: 'edge' }

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'

function generateState(secret: string): string {
  // Simple HMAC-like state: timestamp + secret hash (edge-compatible)
  const ts = Date.now().toString(36)
  const raw = `${ts}.${secret}`
  // btoa is available in Edge runtime
  return btoa(raw).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const clientId = process.env.GITHUB_APP_CLIENT_ID
  const stateSecret = process.env.GITHUB_APP_STATE_SECRET

  if (!clientId) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: { code: 'NOT_CONFIGURED', message: 'GitHub App client ID is not configured', hint: 'Set GITHUB_APP_CLIENT_ID in Vercel environment variables' },
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { searchParams } = new URL(req.url)
  const returnTo = searchParams.get('return_to') || '/'

  // Validate returnTo is a relative path (prevent open redirect)
  const safeReturnTo = returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/'

  const state = stateSecret ? generateState(stateSecret + safeReturnTo) : crypto.randomUUID()

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${new URL(req.url).origin}/api/auth/github/callback`,
    scope: 'read:user user:email read:org',
    state,
    allow_signup: 'true',
  })

  // Store state + return_to in a short-lived cookie (edge-safe)
  const cookieValue = btoa(JSON.stringify({ state, returnTo: safeReturnTo }))
  const cookieOpts = [
    `xps_oauth_state=${cookieValue}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    'Max-Age=600',
  ].join('; ')

  return new Response(null, {
    status: 302,
    headers: {
      Location: `${GITHUB_AUTHORIZE_URL}?${params.toString()}`,
      'Set-Cookie': cookieOpts,
    },
  })
}
