#!/usr/bin/env node
/**
 * scripts/smoke-test.js
 *
 * Lightweight smoke test for XPS Intelligence deployments.
 * Runs without any test framework — pure Node.js fetch.
 *
 * Usage:
 *   BASE_URL=https://xps-intelligence.vercel.app node scripts/smoke-test.js
 *
 * Or for a preview deployment:
 *   BASE_URL=https://xps-intelligence-frontend-<hash>.vercel.app node scripts/smoke-test.js
 *
 * Exit codes:
 *   0 — all checks passed
 *   1 — one or more checks failed
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:4173'
const TIMEOUT_MS = 15000

let passed = 0
let failed = 0

async function check(name, fn) {
  try {
    const result = await Promise.race([
      fn(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
      ),
    ])
    console.log(`✅ ${name}: ${result}`)
    passed++
  } catch (err) {
    console.error(`❌ ${name}: ${err.message}`)
    failed++
  }
}

function expectStatus(res, expectedStatus) {
  if (res.status !== expectedStatus) {
    throw new Error(`Expected HTTP ${expectedStatus}, got ${res.status}`)
  }
}

function expectContentType(res, expected) {
  const ct = res.headers.get('content-type') || ''
  if (!ct.includes(expected)) {
    throw new Error(`Expected content-type to include "${expected}", got "${ct}"`)
  }
}

async function run() {
  console.log(`\n🔍 XPS Intelligence Smoke Test`)
  console.log(`   Base URL: ${BASE_URL}\n`)

  // 1. manifest.json must be accessible and have correct content-type
  await check('GET /manifest.json → 200 + application/json', async () => {
    const res = await fetch(`${BASE_URL}/manifest.json`)
    expectStatus(res, 200)
    expectContentType(res, 'json')
    const data = await res.json()
    if (!data.name) throw new Error('manifest.json missing "name" field')
    return `200 — "${data.name}"`
  })

  // 2. Diagnostics status must return JSON
  await check('GET /api/diagnostics/status → 200 JSON', async () => {
    const res = await fetch(`${BASE_URL}/api/diagnostics/status`)
    expectStatus(res, 200)
    expectContentType(res, 'json')
    const data = await res.json()
    if (!data.ok) throw new Error(`ok=false: ${JSON.stringify(data.error)}`)
    return `200 — status: ${data.data?.status}`
  })

  // 3. Chat endpoint must return JSON (may fail gracefully if AI_GROQ_API_KEY not set)
  await check('POST /api/llm/chat → 200 JSON (or 500 with JSON error)', async () => {
    const res = await fetch(`${BASE_URL}/api/llm/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'ping', stream: false }),
    })
    expectContentType(res, 'json')
    if (res.status !== 200 && res.status !== 500) {
      throw new Error(`Unexpected status ${res.status}`)
    }
    const data = await res.json()
    const status = data.ok ? 'operational' : `not ready (${data.error?.code})`
    return `${res.status} — ${status}`
  })

  // 4. Auth session endpoint must return JSON
  await check('GET /api/auth/session → 200 JSON', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/session`)
    expectStatus(res, 200)
    expectContentType(res, 'json')
    const data = await res.json()
    if (!data.ok) throw new Error(`ok=false: ${JSON.stringify(data)}`)
    const auth = data.data?.session?.authenticated ? 'authenticated' : 'unauthenticated'
    return `200 — ${auth}`
  })

  // 5. Verify no /_spark/* calls are needed
  await check('GET /_spark/loaded → must NOT be 200 (Spark not in this env)', async () => {
    try {
      const res = await fetch(`${BASE_URL}/_spark/loaded`)
      if (res.status === 200) {
        throw new Error('/_spark/loaded returned 200 — Spark runtime injected into this deployment')
      }
      return `${res.status} (expected non-200)`
    } catch (err) {
      // ECONNREFUSED or 404 is expected
      if (err.message.includes('injected')) throw err
      return `Not available (expected)`
    }
  })

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`)

  if (failed > 0) {
    process.exit(1)
  }
}

run().catch(err => {
  console.error('Smoke test runner error:', err)
  process.exit(1)
})
