import { errorResponse, generateTraceId, logApiCall } from '../_lib/utils'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request) {
  const traceId = generateTraceId()
  
  if (req.method !== 'GET') {
    return new Response(JSON.stringify(errorResponse('METHOD_NOT_ALLOWED', 'Only GET allowed', undefined, undefined, traceId)), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  logApiCall('GET', '/api/diagnostics/status', traceId)

  const status = {
    ok: true,
    data: {
      status: 'operational',
      timestamp: new Date().toISOString(),
      services: {
        api: 'up',
        database: process.env.SUPABASE_URL ? 'configured' : 'not_configured',
        llm: process.env.AI_GROQ_API_KEY ? 'configured' : 'not_configured',
      },
    },
    traceId,
  }

  return new Response(JSON.stringify(status), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
