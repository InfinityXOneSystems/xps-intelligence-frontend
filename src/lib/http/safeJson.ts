/**
 * safeJson.ts
 *
 * Shared safe-fetch / safe-JSON helper for the XPS Intelligence frontend.
 *
 * Problems this solves:
 *  - "Unexpected token 'T' … not valid JSON" when an endpoint returns an HTML
 *    error page (e.g. a Vercel 404 / 401) and the caller blindly calls
 *    res.json().
 *  - Silent swallowing of non-2xx responses that still have a JSON body.
 *  - Missing timeout leading to hangs on unreachable endpoints.
 *
 * Usage:
 *   import { safeJson, safeFetch } from '@/lib/http/safeJson'
 *
 *   // Auto-parse + check content-type:
 *   const result = await safeJson('/api/llm/chat', { method: 'POST', body: ... })
 *   if (!result.ok) console.error(result.error)
 *   else console.log(result.data)
 *
 *   // Low-level: just get the Response with timeout:
 *   const res = await safeFetch('/api/health', {}, 5000)
 */

export interface SafeJsonSuccess<T = unknown> {
  ok: true
  status: number
  data: T
}

export interface SafeJsonError {
  ok: false
  status: number
  /** Structured API error code when the server returns one */
  code?: string
  message: string
  /** First 200 chars of the response body for debugging */
  bodySnippet?: string
  url: string
}

export type SafeJsonResult<T = unknown> = SafeJsonSuccess<T> | SafeJsonError

const DEFAULT_TIMEOUT_MS = 20_000

/**
 * Fetch with an AbortController-based timeout.
 * Throws on network errors and timeouts (same as native fetch).
 */
export async function safeFetch(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Fetch + safely parse the response body as JSON.
 *
 * Rules:
 *  1. If the response Content-Type is not application/json (or text/json) the
 *     body is NOT parsed; a structured error is returned with a body snippet.
 *  2. If JSON.parse fails for any reason, a structured error is returned with
 *     a body snippet.
 *  3. Non-2xx status codes are always errors even when the body is valid JSON
 *     (the JSON error envelope is surfaced in result.code / result.message).
 */
export async function safeJson<T = unknown>(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<SafeJsonResult<T>> {
  let status = 0

  try {
    const res = await safeFetch(url, options, timeoutMs)
    status = res.status

    const contentType = res.headers.get('content-type') ?? ''
    const isJson =
      contentType.includes('application/json') ||
      contentType.includes('text/json')

    const text = await res.text()

    if (!isJson) {
      return {
        ok: false,
        status,
        message: `Expected JSON but received content-type "${contentType}"`,
        bodySnippet: text.slice(0, 200),
        url,
      }
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      return {
        ok: false,
        status,
        message: 'Response body is not valid JSON',
        bodySnippet: text.slice(0, 200),
        url,
      }
    }

    if (!res.ok) {
      const err = parsed as Record<string, unknown>
      const errorObj = (err?.error ?? {}) as Record<string, unknown>
      return {
        ok: false,
        status,
        code: (errorObj?.code ?? err?.code ?? 'HTTP_ERROR') as string,
        message: (errorObj?.message ?? err?.message ?? res.statusText) as string,
        url,
      }
    }

    return { ok: true, status, data: parsed as T }
  } catch (err) {
    const isAbort = err instanceof DOMException && err.name === 'AbortError'
    return {
      ok: false,
      status,
      message: isAbort
        ? `Request timed out after ${timeoutMs}ms`
        : err instanceof Error
          ? err.message
          : 'Network error',
      url,
    }
  }
}

/**
 * Convenience: POST JSON and receive JSON.
 */
export async function postJson<T = unknown>(
  url: string,
  body: unknown,
  extraHeaders?: Record<string, string>,
  timeoutMs?: number
): Promise<SafeJsonResult<T>> {
  return safeJson<T>(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...extraHeaders,
      },
      body: JSON.stringify(body),
    },
    timeoutMs
  )
}

/**
 * Convenience: GET JSON.
 */
export async function getJson<T = unknown>(
  url: string,
  extraHeaders?: Record<string, string>,
  timeoutMs?: number
): Promise<SafeJsonResult<T>> {
  return safeJson<T>(
    url,
    {
      method: 'GET',
      headers: extraHeaders,
    },
    timeoutMs
  )
}
