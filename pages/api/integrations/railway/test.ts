import { successResponse, errorResponse, generateTraceId, logApiCall, withTimeout } from '../../_lib/utils'

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

  logApiCall('GET', '/api/integrations/railway/test', traceId)

  try {
    const backendUrl = process.env.BACKEND_URL || process.env.VITE_API_URL
    if (!backendUrl) {
      return new Response(JSON.stringify(errorResponse(
        'NOT_CONFIGURED',
        'Backend URL not configured',
        undefined,
        'Set BACKEND_URL or VITE_API_URL environment variable',
        traceId
      )), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const healthUrl = `${backendUrl}/api/health`.replace(/\/\//g, '/')

    const testResponse = await withTimeout(
      fetch(healthUrl),
      10000
    )

    if (!testResponse.ok) {
      return new Response(JSON.stringify(errorResponse(
        'API_ERROR',
        'Backend health check failed',
        { status: testResponse.status, url: healthUrl },
        'Check Railway deployment status',
        traceId
      )), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await testResponse.json().catch(() => ({ status: 'ok' }))

    return new Response(JSON.stringify(successResponse({
      status: 'connected',
      backend_url: backendUrl,
      health: data,
    }, traceId)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify(errorResponse(
      'CONNECTION_ERROR',
      error instanceof Error ? error.message : 'Unknown error',
      undefined,
      'Check Railway backend deployment and URL',
      traceId
    )), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
