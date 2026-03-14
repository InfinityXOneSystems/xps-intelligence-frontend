import { z } from 'zod'
import Groq from 'groq-sdk'
import { successResponse, errorResponse, generateTraceId, logApiCall, logApiError } from '../_lib/utils'

const chatSchema = z.object({
  message: z.string().min(1),
  model: z.string().optional().default('llama-3.3-70b-versatile'),
})

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

  logApiCall('POST', '/api/llm/chat', traceId)

  try {
    const body = await req.json()
    const { message, model } = chatSchema.parse(body)

    const apiKey = process.env.AI_GROQ_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify(errorResponse(
        'MISSING_API_KEY',
        'Groq API key not configured',
        undefined,
        'Set AI_GROQ_API_KEY environment variable',
        traceId
      )), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const groq = new Groq({ apiKey })
    
    const completion = await Promise.race([
      groq.chat.completions.create({
        messages: [{ role: 'user', content: message }],
        model,
        temperature: 0.7,
        max_tokens: 1024,
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 30000)
      ),
    ])

    const reply = completion.choices[0]?.message?.content || 'No response'

    return new Response(JSON.stringify(successResponse({ reply, model }, traceId)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    logApiError('POST', '/api/llm/chat', error, traceId)
    
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(errorResponse(
        'VALIDATION_ERROR',
        'Invalid request payload',
        error.errors,
        'Check message format',
        traceId
      )), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify(errorResponse(
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unknown error',
      undefined,
      'Check server logs for details',
      traceId
    )), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
