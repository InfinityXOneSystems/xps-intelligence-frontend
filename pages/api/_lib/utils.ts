import { z } from 'zod'
import type { ApiResponse } from '@/controlPlane/integrations/types'

export function generateTraceId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

export function successResponse<T>(data: T, traceId?: string): ApiResponse<T> {
  return {
    ok: true,
    data,
    traceId: traceId || generateTraceId(),
  }
}

export function errorResponse(
  code: string,
  message: string,
  details?: unknown,
  hint?: string,
  traceId?: string
): ApiResponse {
  return {
    ok: false,
    error: {
      code,
      message,
      details,
      hint,
    },
    traceId: traceId || generateTraceId(),
  }
}

export function validateMethod(req: Request, allowedMethods: string[]): boolean {
  return allowedMethods.includes(req.method)
}

export function validatePayload<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.infer<T> {
  return schema.parse(data)
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Request timeout'
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
  )
  return Promise.race([promise, timeout])
}

export function logApiCall(
  method: string,
  endpoint: string,
  traceId: string,
  userId?: string,
  integration?: string
): void {
  console.log(
    JSON.stringify({
      type: 'api_call',
      method,
      endpoint,
      traceId,
      userId,
      integration,
      timestamp: new Date().toISOString(),
    })
  )
}

export function logApiError(
  method: string,
  endpoint: string,
  error: unknown,
  traceId: string,
  userId?: string,
  integration?: string
): void {
  console.error(
    JSON.stringify({
      type: 'api_error',
      method,
      endpoint,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      traceId,
      userId,
      integration,
      timestamp: new Date().toISOString(),
    })
  )
}
