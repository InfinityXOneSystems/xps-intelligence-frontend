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

  logApiCall('GET', '/api/integrations/groq/test', traceId)

  try {
    const apiKey = process.env.AI_GROQ_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify(errorResponse(
        'NOT_CONFIGURED',
        'Groq API key not configured',
        undefined,
        'Set AI_GROQ_API_KEY environment variable in Vercel',
        traceId
      )), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const testResponse = await withTimeout(
      fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
      }),
      10000
    )

    if (!testResponse.ok) {
      return new Response(JSON.stringify(errorResponse(
        'API_ERROR',
        'Groq API returned error',
        { status: testResponse.status },
        'Check API key validity',
        traceId
      )), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await testResponse.json()

    return new Response(JSON.stringify(successResponse({
      status: 'connected',
      models_available: data.data?.length || 0,
    }, traceId)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify(errorResponse(
      'CONNECTION_ERROR',
      error instanceof Error ? error.message : 'Unknown error',
      undefined,
      'Check network connectivity and API key',
      traceId
    )), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
