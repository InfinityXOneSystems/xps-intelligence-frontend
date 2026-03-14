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

  logApiCall('POST', '/api/integrations/vercel/connect', traceId)

  try {
    const body = await req.json()
    const { config: configData } = body
    const token = configData?.token

    if (!token) {
      return new Response(JSON.stringify(errorResponse(
        'INVALID_REQUEST',
        'Vercel token is required',
        undefined,
        'Provide a valid Vercel API token',
        traceId
      )), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const testResponse = await withTimeout(
      fetch('https://api.vercel.com/v2/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }),
      10000
    )

    if (!testResponse.ok) {
      return new Response(JSON.stringify(errorResponse(
        'AUTH_FAILED',
        'Failed to authenticate with Vercel',
        { status: testResponse.status },
        testResponse.status === 401 ? 'Invalid or expired token' : 'Check token permissions',
        traceId
      )), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const userData = await testResponse.json()

    return new Response(JSON.stringify(successResponse({
      status: 'connected',
      provider: 'vercel',
      user: userData.user?.username || userData.user?.email,
      message: `Connected to Vercel as ${userData.user?.username || userData.user?.email}`,
    }, traceId)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify(errorResponse(
      'CONNECTION_ERROR',
      error instanceof Error ? error.message : 'Unknown error',
      undefined,
      'Check network connectivity and token validity',
      traceId
    )), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
