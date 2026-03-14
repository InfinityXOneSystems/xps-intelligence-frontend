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

  logApiCall('GET', '/api/integrations/supabase/test', traceId)

  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify(errorResponse(
        'NOT_CONFIGURED',
        'Supabase credentials not configured',
        undefined,
        'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables',
        traceId
      )), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const testResponse = await withTimeout(
      fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }),
      10000
    )

    if (!testResponse.ok && testResponse.status !== 404) {
      return new Response(JSON.stringify(errorResponse(
        'API_ERROR',
        'Supabase API returned error',
        { status: testResponse.status },
        'Check Supabase credentials',
        traceId
      )), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify(successResponse({
      status: 'connected',
      url: supabaseUrl,
    }, traceId)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify(errorResponse(
      'CONNECTION_ERROR',
      error instanceof Error ? error.message : 'Unknown error',
      undefined,
      'Check network connectivity and Supabase URL',
      traceId
    )), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
