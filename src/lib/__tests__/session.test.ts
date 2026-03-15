/**
 * Unit tests for src/lib/session.ts
 *
 * Tests cover:
 *  - getSession: returns session when API succeeds
 *  - getSession: returns unauthenticated when API fails
 *  - getSession: caches result and avoids extra fetches
 *  - isAdmin: returns true when role === 'admin'
 *  - clearSessionCache: clears in-memory cache
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ─── Module setup ──────────────────────────────────────────────────────────
// We need to reset the module cache between tests to clear the in-memory cache.

describe('session utilities', () => {
  let originalFetch: typeof fetch

  beforeEach(() => {
    originalFetch = global.fetch
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.resetModules()
  })

  it('getSession returns authenticated session on success', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          data: {
            session: {
              authenticated: true,
              login: 'testuser',
              role: 'admin',
              expiresAt: new Date(Date.now() + 86400000).toISOString(),
            },
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    )

    const { getSession, clearSessionCache } = await import('../session')
    clearSessionCache()

    const session = await getSession(true)

    expect(session.authenticated).toBe(true)
    expect(session.login).toBe('testuser')
    expect(session.role).toBe('admin')
  })

  it('getSession returns { authenticated: false } when API fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const { getSession, clearSessionCache } = await import('../session')
    clearSessionCache()

    const session = await getSession(true)

    expect(session.authenticated).toBe(false)
  })

  it('getSession caches result and avoids duplicate fetches', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          data: { session: { authenticated: true, login: 'cached', role: 'viewer' } },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    )

    const { getSession, clearSessionCache } = await import('../session')
    clearSessionCache()

    await getSession(true)
    await getSession() // should use cache
    await getSession() // should use cache

    expect((global.fetch as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(1)
  })

  it('isAdmin returns true when role is admin', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          data: {
            session: { authenticated: true, login: 'admin', role: 'admin' },
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    )

    const { isAdmin, clearSessionCache } = await import('../session')
    clearSessionCache()

    const result = await isAdmin()

    expect(result).toBe(true)
  })

  it('isAdmin returns false when role is viewer', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          data: {
            session: { authenticated: true, login: 'viewer', role: 'viewer' },
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    )

    const { isAdmin, clearSessionCache } = await import('../session')
    clearSessionCache()

    const result = await isAdmin()

    expect(result).toBe(false)
  })

  it('clearSessionCache forces a fresh fetch on next getSession call', async () => {
    let callCount = 0
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++
      return Promise.resolve(
        new Response(
          JSON.stringify({ ok: true, data: { session: { authenticated: false } } }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      )
    })

    const { getSession, clearSessionCache } = await import('../session')
    clearSessionCache()

    await getSession(true) // fetch 1
    clearSessionCache()
    await getSession() // fetch 2 (cache was cleared)

    expect(callCount).toBe(2)
  })
})
