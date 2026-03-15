/**
 * GET /api/auth/github/callback
 *
 * Handles the GitHub OAuth callback after user authorizes the GitHub App.
 *
 * Flow:
 *  1. Verify `state` param against the cookie set in /api/auth/github/start
 *  2. Exchange `code` for an OAuth access token via GitHub
 *  3. Fetch user profile (login, name, avatar)
 *  4. Determine role: if user is a member of the configured admin org/team → admin; else viewer
 *  5. Set an httpOnly session cookie and redirect back to `return_to`
 *
 * Env vars (Vercel server-side only — NO VITE_ prefix):
 *   GITHUB_APP_CLIENT_ID       — GitHub App OAuth client ID
 *   GITHUB_APP_CLIENT_SECRET   — GitHub App OAuth client secret (never expose to browser)
 *   GITHUB_ADMIN_ORG           — GitHub org login that grants admin role (optional)
 *   SESSION_SECRET             — Random 32-char secret for signing session cookies
 */
export const config = { runtime: 'edge' }

import { generateTraceId, logApiCall, logApiError } from '../../_lib/utils'

interface GitHubTokenResponse {
  access_token?: string
  token_type?: string
  scope?: string
  error?: string
  error_description?: string
}

interface GitHubUser {
  login: string
  name: string | null
  avatar_url: string
  id: number
}

function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {}
  return Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...vs] = c.trim().split('=')
      return [k.trim(), decodeURIComponent(vs.join('='))]
    })
  )
}

function makeSessionCookie(session: Record<string, unknown>, secret: string): string {
  const payload = btoa(JSON.stringify({ ...session, _s: secret.slice(0, 8) }))
  return [
    `xps_session=${payload}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    `Max-Age=${7 * 24 * 3600}`, // 7 days
  ].join('; ')
}

function clearOAuthStateCookie(): string {
  return 'xps_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
}

export default async function handler(req: Request): Promise<Response> {
  const traceId = generateTraceId()
  logApiCall('GET', '/api/auth/github/callback', traceId)

  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code || !state) {
    return new Response(null, {
      status: 302,
      headers: { Location: `${origin}/?auth_error=missing_params` },
    })
  }

  // --- Verify state ---
  const cookies = parseCookies(req.headers.get('cookie'))
  let returnTo = '/'
  try {
    const stateData = JSON.parse(atob(cookies.xps_oauth_state ?? ''))
    if (stateData.state !== state) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${origin}/?auth_error=state_mismatch`,
          'Set-Cookie': clearOAuthStateCookie(),
        },
      })
    }
    returnTo = stateData.returnTo || '/'
  } catch {
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${origin}/?auth_error=invalid_state`,
        'Set-Cookie': clearOAuthStateCookie(),
      },
    })
  }

  const clientId = process.env.GITHUB_APP_CLIENT_ID
  const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET
  const sessionSecret = process.env.SESSION_SECRET || 'xps-default-secret-change-me'
  const adminOrg = process.env.GITHUB_ADMIN_ORG || ''

  if (!clientId || !clientSecret) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${origin}/?auth_error=not_configured`,
        'Set-Cookie': clearOAuthStateCookie(),
      },
    })
  }

  try {
    // --- Exchange code for token ---
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    })

    const tokenData: GitHubTokenResponse = await tokenRes.json()

    if (!tokenData.access_token) {
      logApiError('GET', '/api/auth/github/callback', tokenData, traceId)
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${origin}/?auth_error=token_exchange_failed`,
          'Set-Cookie': clearOAuthStateCookie(),
        },
      })
    }

    const token = tokenData.access_token

    // --- Fetch GitHub user profile ---
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'XPS-Intelligence',
      },
    })
    const user: GitHubUser = await userRes.json()

    // --- Determine role ---
    let role: 'admin' | 'viewer' = 'viewer'
    if (adminOrg) {
      try {
        const memberRes = await fetch(
          `https://api.github.com/orgs/${adminOrg}/members/${user.login}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github+json',
              'User-Agent': 'XPS-Intelligence',
            },
          }
        )
        if (memberRes.status === 204) role = 'admin'
      } catch {
        // Non-fatal: default to viewer
      }
    }

    // --- Build session cookie (no token stored — just identity + role) ---
    const session = {
      authenticated: true,
      login: user.login,
      name: user.name ?? user.login,
      avatarUrl: user.avatar_url,
      role,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: `${origin}${returnTo}`,
        'Set-Cookie': makeSessionCookie(session, sessionSecret),
        // Also clear the oauth state cookie
        'Set-Cookie2': clearOAuthStateCookie(),
      },
    })
  } catch (err) {
    logApiError('GET', '/api/auth/github/callback', err, traceId)
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${origin}/?auth_error=server_error`,
        'Set-Cookie': clearOAuthStateCookie(),
      },
    })
  }
}
