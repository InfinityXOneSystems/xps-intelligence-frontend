/**
 * POST /api/diagnostics/run
 *
 * Runs a set of diagnostic checks server-side and returns results.
 *
 * Checks performed:
 *  1. Vercel edge connectivity (self)
 *  2. Groq API key presence
 *  3. Railway backend reachability
 *  4. GitHub integration status
 *  5. Supabase env var presence
 *
 * Always returns HTTP 200 — caller inspects individual check statuses.
 */
import { successResponse, generateTraceId, logApiCall, withTimeout } from '../_lib/utils'

export const config = { runtime: 'edge' }

interface CheckResult {
  name: string
  status: 'pass' | 'fail' | 'warn' | 'skip'
  message: string
  latencyMs?: number
  hint?: string
}

async function checkBackend(backendUrl: string): Promise<CheckResult> {
  const start = Date.now()
  try {
    const res = await withTimeout(
      fetch(`${backendUrl}/api/health`, { headers: { 'User-Agent': 'XPS-Intelligence-Diagnostics' } }),
      8000
    )
    const latencyMs = Date.now() - start
    if (res.ok) {
      return { name: 'railway_backend', status: 'pass', message: `Backend responded in ${latencyMs}ms`, latencyMs }
    }
    return {
      name: 'railway_backend',
      status: 'warn',
      message: `Backend returned HTTP ${res.status}`,
      latencyMs,
      hint: 'Check Railway deployment logs',
    }
  } catch (err) {
    return {
      name: 'railway_backend',
      status: 'fail',
      message: err instanceof Error ? err.message : 'Unreachable',
      hint: `Ensure Railway backend is deployed and BACKEND_URL is set correctly (currently: ${backendUrl})`,
    }
  }
}

async function checkGitHub(): Promise<CheckResult> {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return {
      name: 'github_token',
      status: process.env.GITHUB_APP_CLIENT_ID ? 'warn' : 'skip',
      message: process.env.GITHUB_APP_CLIENT_ID
        ? 'GitHub App configured; no static token set'
        : 'GITHUB_TOKEN not set',
      hint: 'Set GITHUB_TOKEN in Vercel env vars or use GitHub App OAuth',
    }
  }
  try {
    const start = Date.now()
    const res = await withTimeout(
      fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'XPS-Intelligence' },
      }),
      8000
    )
    const latencyMs = Date.now() - start
    if (res.ok) {
      const user = await res.json() as { login: string }
      return { name: 'github_token', status: 'pass', message: `Authenticated as ${user.login}`, latencyMs }
    }
    return { name: 'github_token', status: 'fail', message: `GitHub API returned ${res.status}`, hint: 'Rotate GITHUB_TOKEN' }
  } catch {
    return { name: 'github_token', status: 'fail', message: 'GitHub API unreachable' }
  }
}

export default async function handler(req: Request): Promise<Response> {
  const traceId = generateTraceId()
  logApiCall('POST', '/api/diagnostics/run', traceId)

  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response(
      JSON.stringify({ ok: false, error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const backendUrl =
    process.env.BACKEND_URL ||
    'https://xpsintelligencesystem-production.up.railway.app'

  const checks: CheckResult[] = []

  // 1. Groq
  checks.push(
    process.env.AI_GROQ_API_KEY
      ? { name: 'groq_api_key', status: 'pass', message: 'AI_GROQ_API_KEY is set' }
      : { name: 'groq_api_key', status: 'fail', message: 'AI_GROQ_API_KEY is not set', hint: 'Set AI_GROQ_API_KEY in Vercel environment variables' }
  )

  // 2. Supabase
  checks.push(
    process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
      ? { name: 'supabase', status: 'pass', message: 'Supabase env vars are set' }
      : { name: 'supabase', status: 'warn', message: 'SUPABASE_URL or SUPABASE_ANON_KEY missing', hint: 'Set Supabase env vars for database features' }
  )

  // 3. Railway backend (async)
  const [backendResult, githubResult] = await Promise.all([
    checkBackend(backendUrl),
    checkGitHub(),
  ])
  checks.push(backendResult)
  checks.push(githubResult)

  // 4. Session secret
  checks.push(
    process.env.SESSION_SECRET
      ? { name: 'session_secret', status: 'pass', message: 'SESSION_SECRET is set' }
      : { name: 'session_secret', status: 'warn', message: 'SESSION_SECRET not set — using insecure default', hint: 'Set SESSION_SECRET to a random 32-char string in Vercel env vars' }
  )

  const failed = checks.filter(c => c.status === 'fail').length
  const warnings = checks.filter(c => c.status === 'warn').length
  const overall = failed > 0 ? 'degraded' : warnings > 0 ? 'warnings' : 'healthy'

  return new Response(
    JSON.stringify(successResponse({
      overall,
      checks,
      timestamp: new Date().toISOString(),
      backendUrl,
    }, traceId)),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
