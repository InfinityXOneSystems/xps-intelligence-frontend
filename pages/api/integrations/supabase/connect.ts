import { successResponse, errorResponse, generateTraceId, logApiCall, withTimeout } from '../../_lib/utils'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request) {
  const traceId = generateTraceId()
  
  if (req.method !== 'POST') {
    return new Response(JSON.stringify(errorResponse('METHOD_NOT_ALLOWED', 'Only POST allowed', undefined, undefined, traceId)), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  logApiCall('POST', '/api/integrations/supabase/connect', traceId)

  try {
    const body = await req.json()
    const { config: configData } = body
    const token = configData?.token

    if (!token) {
      return new Response(JSON.stringify(errorResponse(
        'INVALID_REQUEST',
        'Service role key is required',
        undefined,
        'Provide a valid Supabase service role key',
        traceId
      )), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = process.env.SUPABASE_URL
    if (!supabaseUrl) {
      return new Response(JSON.stringify(errorResponse(
        'NOT_CONFIGURED',
        'Supabase URL not configured',
        undefined,
        'Set SUPABASE_URL environment variable',
        traceId
      )), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const testResponse = await withTimeout(
      fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': token,
          'Authorization': `Bearer ${token}`,
        },
      }),
      10000
    )

    if (!testResponse.ok && testResponse.status !== 404) {
      return new Response(JSON.stringify(errorResponse(
        'AUTH_FAILED',
        'Failed to authenticate with Supabase',
        { status: testResponse.status },
        testResponse.status === 401 ? 'Invalid service role key' : 'Check key permissions',
        traceId
      )), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify(successResponse({
      status: 'connected',
      provider: 'supabase',
      url: supabaseUrl,
      message: 'Supabase connection established',
    }, traceId)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify(errorResponse(
      'CONNECTION_ERROR',
      error instanceof Error ? error.message : 'Unknown error',
      undefined,
      'Check network connectivity and service role key',
      traceId
    )), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
