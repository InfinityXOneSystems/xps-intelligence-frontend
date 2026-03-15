/**
 * GET /api/integrations/github/status
 *
 * Returns the current GitHub App integration status.
 * Uses the server-side GITHUB_TOKEN env var if present; otherwise
 * falls back to checking whether the GitHub App is configured.
 *
 * Env vars (server-side only):
 *   GITHUB_TOKEN            — PAT or installation token (optional)
 *   GITHUB_APP_CLIENT_ID    — GitHub App client ID (indicates app is configured)
 */
import { successResponse, errorResponse, generateTraceId, logApiCall, withTimeout } from '../../_lib/utils'

export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  const traceId = generateTraceId()

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify(errorResponse('METHOD_NOT_ALLOWED', 'Only GET allowed', undefined, undefined, traceId)),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    )
  }

  logApiCall('GET', '/api/integrations/github/status', traceId)

  const token = process.env.GITHUB_TOKEN
  const appConfigured = Boolean(
    process.env.GITHUB_APP_CLIENT_ID && process.env.GITHUB_APP_CLIENT_SECRET
  )

  if (!token && !appConfigured) {
    return new Response(
      JSON.stringify(successResponse({
        status: 'not_configured',
        provider: 'github',
        appConfigured: false,
        message: 'GitHub integration not configured. Set GITHUB_TOKEN or configure the GitHub App.',
        hint: 'Visit Settings → GitHub to connect, or set GITHUB_TOKEN in Vercel environment variables.',
      }, traceId)),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // If we have a token, verify it against the GitHub API
  if (token) {
    try {
      const testRes = await withTimeout(
        fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'XPS-Intelligence',
          },
        }),
        8000
      )

      if (!testRes.ok) {
        return new Response(
          JSON.stringify(successResponse({
            status: 'token_invalid',
            provider: 'github',
            appConfigured,
            message: `GitHub token is present but invalid (HTTP ${testRes.status})`,
            hint: testRes.status === 401 ? 'Rotate GITHUB_TOKEN in Vercel environment variables.' : 'Check token scopes.',
          }, traceId)),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      }

      const user = await testRes.json() as { login: string; name?: string }
      return new Response(
        JSON.stringify(successResponse({
          status: 'connected',
          provider: 'github',
          appConfigured,
          user: user.login,
          name: user.name,
          message: `Connected as ${user.login}`,
        }, traceId)),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    } catch (err) {
      return new Response(
        JSON.stringify(successResponse({
          status: 'unreachable',
          provider: 'github',
          appConfigured,
          message: err instanceof Error ? err.message : 'GitHub API unreachable',
        }, traceId)),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  // App is configured but no token — report app-only status
  return new Response(
    JSON.stringify(successResponse({
      status: 'app_configured',
      provider: 'github',
      appConfigured: true,
      message: 'GitHub App is configured. Use OAuth login to obtain an installation token.',
    }, traceId)),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
