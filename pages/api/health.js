/**
 * GET /api/health
 * System health check endpoint — used by monitoring, CI, and Docker health checks.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const backendUrl =
    process.env.BACKEND_URL || 'https://xpsintelligencesystem-production.up.railway.app'

  let backendStatus = 'unknown'
  let backendLatencyMs = null

  try {
    const start = Date.now()
    const r = await fetch(`${backendUrl}/health`, { signal: AbortSignal.timeout(5000) })
    backendLatencyMs = Date.now() - start
    backendStatus = r.ok ? 'ok' : `error_${r.status}`
  } catch {
    backendStatus = 'unreachable'
  }

  const healthy = backendStatus === 'ok' || backendStatus === 'unknown'

  return res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    services: {
      frontend: 'ok',
      backend: backendStatus,
      backendLatencyMs,
      groq: process.env.AI_GROQ_API_KEY ? 'configured' : 'not_configured',
    },
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? 'local',
  })
}
