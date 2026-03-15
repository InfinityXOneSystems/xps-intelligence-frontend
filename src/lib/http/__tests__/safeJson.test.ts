/**
 * Unit tests for src/lib/http/safeJson.ts
 *
 * Tests cover:
 *  - Happy path: JSON response with correct content-type
 *  - Non-JSON response (HTML) → structured error with bodySnippet
 *  - JSON parse failure → structured error
 *  - Non-2xx status with JSON body → structured error surfacing error envelope
 *  - Network timeout → structured error with timeout message
 *  - postJson and getJson convenience wrappers
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { safeJson, postJson, getJson } from '../safeJson'

// ─── Fetch mock helpers ────────────────────────────────────────────────────

function mockResponse(
  body: string,
  options: { status?: number; contentType?: string } = {}
): Response {
  const { status = 200, contentType = 'application/json' } = options
  return new Response(body, {
    status,
    headers: { 'Content-Type': contentType },
  })
}

function mockFetch(response: Response | (() => Response)) {
  global.fetch = vi.fn().mockImplementation(() =>
    Promise.resolve(typeof response === 'function' ? response() : response)
  )
}

function mockFetchReject(error: Error) {
  global.fetch = vi.fn().mockRejectedValue(error)
}

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('safeJson', () => {
  let originalFetch: typeof fetch

  beforeEach(() => {
    originalFetch = global.fetch
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('returns ok=true with parsed data for valid JSON 200 response', async () => {
    mockFetch(mockResponse(JSON.stringify({ ok: true, data: { reply: 'hello' } })))

    const result = await safeJson('/api/test')

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.status).toBe(200)
      expect((result.data as Record<string, unknown>).ok).toBe(true)
    }
  })

  it('returns ok=false with bodySnippet when content-type is text/html', async () => {
    mockFetch(
      mockResponse('<html><body>The page could not be found.</body></html>', {
        status: 404,
        contentType: 'text/html',
      })
    )

    const result = await safeJson('/api/missing')

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.status).toBe(404)
      expect(result.message).toContain('text/html')
      expect(result.bodySnippet).toContain('page could not be found')
      expect(result.url).toBe('/api/missing')
    }
  })

  it('returns ok=false when body is not valid JSON despite json content-type', async () => {
    mockFetch(
      mockResponse('This is not JSON at all', {
        status: 200,
        contentType: 'application/json',
      })
    )

    const result = await safeJson('/api/bad-json')

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.message).toContain('not valid JSON')
      expect(result.bodySnippet).toContain('This is not JSON')
    }
  })

  it('returns ok=false with code and message for non-2xx JSON error envelope', async () => {
    mockFetch(
      mockResponse(
        JSON.stringify({
          ok: false,
          error: { code: 'NOT_CONFIGURED', message: 'API key missing' },
        }),
        { status: 503 }
      )
    )

    const result = await safeJson('/api/chat')

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.status).toBe(503)
      expect(result.code).toBe('NOT_CONFIGURED')
      expect(result.message).toBe('API key missing')
    }
  })

  it('returns ok=false with timeout message when request times out', async () => {
    // Simulate abort
    global.fetch = vi.fn().mockImplementation(() => {
      const err = new DOMException('The operation was aborted.', 'AbortError')
      return Promise.reject(err)
    })

    const result = await safeJson('/api/slow', {}, 100)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.message).toContain('timed out')
    }
  })

  it('returns ok=false with message on network error', async () => {
    mockFetchReject(new Error('Failed to fetch'))

    const result = await safeJson('/api/unreachable')

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.message).toBe('Failed to fetch')
    }
  })
})

describe('postJson', () => {
  let originalFetch: typeof fetch

  beforeEach(() => {
    originalFetch = global.fetch
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('sends POST with Content-Type application/json', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      mockResponse(JSON.stringify({ ok: true, data: { sent: true } }))
    )

    await postJson('/api/chat', { message: 'hello' })

    const call = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[0]).toBe('/api/chat')
    expect(call[1].method).toBe('POST')
    expect(call[1].headers?.['Content-Type']).toBe('application/json')
    expect(JSON.parse(call[1].body)).toEqual({ message: 'hello' })
  })
})

describe('getJson', () => {
  let originalFetch: typeof fetch

  beforeEach(() => {
    originalFetch = global.fetch
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('sends GET request', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      mockResponse(JSON.stringify({ ok: true, data: {} }))
    )

    await getJson('/api/health')

    const call = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[0]).toBe('/api/health')
    expect(call[1].method).toBe('GET')
  })
})
