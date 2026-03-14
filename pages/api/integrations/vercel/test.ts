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

  logApiCall('GET', '/api/integrations/vercel/test', traceId)

  try {
    const vercelToken = process.env.VERCEL_TOKEN
    if (!vercelToken) {
      return new Response(JSON.stringify(errorResponse(
        'NOT_CONFIGURED',
        'Vercel token not configured',
        undefined,
        'Set VERCEL_TOKEN environment variable',
        traceId
      )), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const testResponse = await withTimeout(
      fetch('https://api.vercel.com/v9/projects', {
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
        },
      }),
      10000
    )

    if (!testResponse.ok) {
      return new Response(JSON.stringify(errorResponse(
        'API_ERROR',
        'Vercel API returned error',
        { status: testResponse.status },
        'Check Vercel token validity',
        traceId
      )), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await testResponse.json()

    return new Response(JSON.stringify(successResponse({
      status: 'connected',
      projects_count: data.projects?.length || 0,
    }, traceId)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify(errorResponse(
      'CONNECTION_ERROR',
      error instanceof Error ? error.message : 'Unknown error',
      undefined,
      'Check network connectivity',
      traceId
    )), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
