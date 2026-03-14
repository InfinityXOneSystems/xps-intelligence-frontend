import { successResponse, errorResponse, generateTraceId, logApiCall } from '../../_lib/utils'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request) {
  const traceId = generateTraceId()
  
  if (req.method !== 'DELETE') {
    return new Response(JSON.stringify(errorResponse('METHOD_NOT_ALLOWED', 'Only DELETE allowed', undefined, undefined, traceId)), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  logApiCall('DELETE', '/api/integrations/groq/disconnect', traceId)

  return new Response(JSON.stringify(successResponse({
    status: 'disconnected',
    provider: 'groq',
    message: 'Groq integration disconnected',
  }, traceId)), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
