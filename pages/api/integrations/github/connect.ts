import { successResponse, errorResponse, generateTraceId, logApiCall } from '../../_lib/utils'

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

  logApiCall('POST', '/api/integrations/github/connect', traceId)

  try {
    const body = await req.json()
    const { config: configData } = body
    const token = configData?.token

    if (!token) {
      return new Response(JSON.stringify(errorResponse(
        'INVALID_REQUEST',
        'Token is required',
        undefined,
        'Provide a valid GitHub personal access token',
        traceId
      )), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const testResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'XPS-Intelligence',
      },
    })

    if (!testResponse.ok) {
      return new Response(JSON.stringify(errorResponse(
        'AUTH_FAILED',
        'Failed to authenticate with GitHub',
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
      provider: 'github',
      user: userData.login,
      name: userData.name,
      message: `Connected as ${userData.login}`,
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
