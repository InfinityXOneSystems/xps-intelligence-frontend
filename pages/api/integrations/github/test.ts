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

  logApiCall('GET', '/api/integrations/github/test', traceId)

  try {
    const githubToken = process.env.GITHUB_TOKEN
    if (!githubToken) {
      return new Response(JSON.stringify(errorResponse(
        'NOT_CONFIGURED',
        'GitHub token not configured',
        undefined,
        'Set GITHUB_TOKEN environment variable or connect via UI',
        traceId
      )), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const testResponse = await withTimeout(
      fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'XPS-Intelligence',
        },
      }),
      10000
    )

    if (!testResponse.ok) {
      return new Response(JSON.stringify(errorResponse(
        'API_ERROR',
        'GitHub API returned error',
        { status: testResponse.status },
        testResponse.status === 401 ? 'Token is invalid or expired' : 'Check GitHub token permissions',
        traceId
      )), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const userData = await testResponse.json()

    return new Response(JSON.stringify(successResponse({
      status: 'connected',
      user: userData.login,
      name: userData.name,
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
