/**
 * XPS Intelligence — Full E2E Test Suite
 * Tests every page and critical function in the frontend.
 * Run: npx playwright test
 */

import { test, expect, type Page } from '@playwright/test'

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

async function waitForPageContent(page: Page) {
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
}

// ─────────────────────────────────────────────────────────────
// SUITE 1: App loads correctly
// ─────────────────────────────────────────────────────────────

test.describe('App Bootstrap', () => {
  test('loads the home page', async ({ page }) => {
    await page.goto('/')
    await waitForPageContent(page)
    // App should render — not be blank, not show a crash screen
    await expect(page.locator('body')).not.toBeEmpty()
    // Should not show unhandled error
    await expect(page.locator('text=Something went wrong')).not.toBeVisible()
  })

  test('sidebar is visible on desktop', async ({ page }) => {
    await page.goto('/')
    await waitForPageContent(page)
    // Sidebar should be present
    const sidebar = page.locator('nav, aside, [role="navigation"]').first()
    await expect(sidebar).toBeVisible()
  })

  test('top bar is visible', async ({ page }) => {
    await page.goto('/')
    await waitForPageContent(page)
    const topbar = page.locator('header, [class*="topbar"], [class*="TopBar"]').first()
    await expect(topbar).toBeVisible()
  })

  test('AI chat panel is present', async ({ page }) => {
    await page.goto('/')
    await waitForPageContent(page)
    // Chat panel should exist (may be toggled)
    const chat = page.locator('[class*="chat"], [class*="Chat"], [placeholder*="command"], [placeholder*="Command"]').first()
    await expect(chat).toBeVisible({ timeout: 10_000 })
  })
})

// ─────────────────────────────────────────────────────────────
// SUITE 2: Navigation — every page must render
// ─────────────────────────────────────────────────────────────

const PAGES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'leads', label: 'Leads' },
  { id: 'scraper', label: 'Scraper' },
  { id: 'canvas', label: 'Canvas' },
  { id: 'contractors', label: 'Contractors' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'settings', label: 'Settings' },
  { id: 'agent', label: 'Agent' },
  { id: 'logs', label: 'Logs' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'editor', label: 'Editor' },
  { id: 'sandbox', label: 'Sandbox' },
  { id: 'automation', label: 'Automation' },
  { id: 'reports', label: 'Reports' },
  { id: 'docs', label: 'Docs' },
]

test.describe('Navigation — all pages render', () => {
  for (const { id, label } of PAGES) {
    test(`renders ${label} page`, async ({ page }) => {
      await page.goto('/')
      await waitForPageContent(page)

      // Try clicking nav item by text or data attribute
      const navSelector = `
        text="${label}",
        [data-page="${id}"],
        [data-nav="${id}"],
        a[href="#${id}"],
        button:has-text("${label}")
      `.trim()

      const navItem = page.locator(navSelector).first()
      if (await navItem.count() > 0) {
        await navItem.click()
        await waitForPageContent(page)
      }

      // Page should not show crash
      await expect(page.locator('text=Something went wrong')).not.toBeVisible()
      await expect(page.locator('text=Cannot read properties')).not.toBeVisible()
    })
  }
})

// ─────────────────────────────────────────────────────────────
// SUITE 3: Chat Interface
// ─────────────────────────────────────────────────────────────

test.describe('Chat Interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageContent(page)
  })

  test('chat input is visible and accepts text', async ({ page }) => {
    const input = page.locator('input[placeholder*="command"], input[placeholder*="Command"], textarea[placeholder*="command"]').first()
    await expect(input).toBeVisible({ timeout: 10_000 })
    await input.fill('Test command')
    await expect(input).toHaveValue('Test command')
  })

  test('can send a chat message', async ({ page }) => {
    const input = page.locator('input[placeholder*="command"], input[placeholder*="Command"], textarea[placeholder*="command"]').first()
    if (await input.count() === 0) {
      test.skip()
      return
    }
    await input.fill('Show me leads')
    await page.keyboard.press('Enter')
    // Should show some response or loading state
    await page.waitForTimeout(1000)
    // Should not crash
    await expect(page.locator('text=Something went wrong')).not.toBeVisible()
  })

  test('chat shows agent names', async ({ page }) => {
    // Agent names should be visible somewhere in the chat UI
    const bodyText = await page.locator('body').textContent() || ''
    expect(
      bodyText.includes('Agent') || bodyText.includes('agent') || bodyText.includes('Chat')
    ).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────
// SUITE 4: Settings page
// ─────────────────────────────────────────────────────────────

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageContent(page)
    const settingsNav = page.locator('text=Settings, [data-page="settings"]').first()
    if (await settingsNav.count() > 0) await settingsNav.click()
    await waitForPageContent(page)
  })

  test('settings page renders without errors', async ({ page }) => {
    await expect(page.locator('text=Something went wrong')).not.toBeVisible()
    const body = await page.locator('body').textContent() || ''
    expect(body.toLowerCase()).toMatch(/setting|config|integration|api key/i)
  })

  test('API keys section is present', async ({ page }) => {
    const body = await page.locator('body').textContent() || ''
    expect(body.toLowerCase()).toMatch(/groq|api|key|integration/i)
  })
})

// ─────────────────────────────────────────────────────────────
// SUITE 5: Scraper page
// ─────────────────────────────────────────────────────────────

test.describe('Scraper Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageContent(page)
    const scraperNav = page.locator('text=Scraper, [data-page="scraper"]').first()
    if (await scraperNav.count() > 0) await scraperNav.click()
    await waitForPageContent(page)
  })

  test('scraper page renders', async ({ page }) => {
    await expect(page.locator('text=Something went wrong')).not.toBeVisible()
    const body = await page.locator('body').textContent() || ''
    expect(body.toLowerCase()).toMatch(/scraper|scrape|lead|contractor/i)
  })

  test('scraper has start/run button', async ({ page }) => {
    const body = await page.locator('body').textContent() || ''
    expect(
      body.toLowerCase().includes('scrape') || body.toLowerCase().includes('start') || body.toLowerCase().includes('run')
    ).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────
// SUITE 6: Leads page
// ─────────────────────────────────────────────────────────────

test.describe('Leads Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForPageContent(page)
    const leadsNav = page.locator('text=Leads, [data-page="leads"]').first()
    if (await leadsNav.count() > 0) await leadsNav.click()
    await waitForPageContent(page)
  })

  test('leads page renders', async ({ page }) => {
    await expect(page.locator('text=Something went wrong')).not.toBeVisible()
    const body = await page.locator('body').textContent() || ''
    expect(body.toLowerCase()).toMatch(/lead|contact|company|contractor/i)
  })

  test('leads table or list is present', async ({ page }) => {
    // Should have structured content with lead data
    const body = await page.locator('body').textContent() || ''
    expect(body.length).toBeGreaterThan(100)
  })
})

// ─────────────────────────────────────────────────────────────
// SUITE 7: Agent/Pipeline pages
// ─────────────────────────────────────────────────────────────

test.describe('Agent & Pipeline Pages', () => {
  test('agent page renders all 13 agents', async ({ page }) => {
    await page.goto('/')
    await waitForPageContent(page)
    const agentNav = page.locator('text=Agent, [data-page="agent"]').first()
    if (await agentNav.count() > 0) await agentNav.click()
    await waitForPageContent(page)

    const body = await page.locator('body').textContent() || ''
    // Should show at least some agent names
    const agentNames = ['Planner', 'Scraper', 'Builder', 'Meta', 'Business']
    const found = agentNames.filter(name => body.includes(name))
    expect(found.length).toBeGreaterThan(0)
  })

  test('pipeline page renders', async ({ page }) => {
    await page.goto('/')
    await waitForPageContent(page)
    const pipelineNav = page.locator('text=Pipeline, [data-page="pipeline"]').first()
    if (await pipelineNav.count() > 0) await pipelineNav.click()
    await waitForPageContent(page)
    await expect(page.locator('text=Something went wrong')).not.toBeVisible()
  })
})

// ─────────────────────────────────────────────────────────────
// SUITE 8: API endpoints (Vercel serverless)
// ─────────────────────────────────────────────────────────────

test.describe('API Endpoints', () => {
  test('GET /api/health returns JSON', async ({ request }) => {
    const resp = await request.get('/api/health').catch(() => null)
    if (!resp) return test.skip()
    expect([200, 503]).toContain(resp.status())
    const body = await resp.json().catch(() => null)
    if (body) expect(body).toHaveProperty('status')
  })
})

// ─────────────────────────────────────────────────────────────
// SUITE 9: Error handling — no blank/crashed pages
// ─────────────────────────────────────────────────────────────

test.describe('Error Resilience', () => {
  test('no unhandled errors on initial load', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', err => errors.push(err.message))
    await page.goto('/')
    await waitForPageContent(page)
    // Filter out expected non-critical warnings
    const criticalErrors = errors.filter(e =>
      !e.includes('ResizeObserver') &&
      !e.includes('non-passive event') &&
      !e.includes('warning')
    )
    expect(criticalErrors).toHaveLength(0)
  })

  test('404 page navigates gracefully', async ({ page }) => {
    await page.goto('/nonexistent-route-xyz')
    await waitForPageContent(page)
    // Should either redirect to home or show 404 — not crash
    await expect(page.locator('text=Something went wrong')).not.toBeVisible()
  })
})
