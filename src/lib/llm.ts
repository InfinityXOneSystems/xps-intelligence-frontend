export type LLMProvider = 'groq' | 'ollama' | 'huggingface' | 'gemini' | 'fallback'

/**
 * Smart routing strategy:
 * - 'auto'   — Use Groq (cloud) for orchestration; fall back to Ollama (local) for scraping
 * - 'cloud'  — Prefer Groq, then Gemini, then HuggingFace
 * - 'local'  — Use Ollama exclusively (offline/private)
 * - 'groq'   — Force Groq
 * - 'ollama' — Force Ollama
 */
export type RouterStrategy = 'auto' | 'cloud' | 'local' | LLMProvider

export interface LLMConfig {
  provider?: LLMProvider
  routerStrategy?: RouterStrategy
  groqApiKey?: string
  huggingfaceApiKey?: string
  geminiApiKey?: string
  /** Ollama base URL — defaults to http://localhost:11434 */
  ollamaBaseUrl?: string
  /** Ollama model name — defaults to llama3 */
  ollamaModel?: string
  model?: string
  maxTokens?: number
  temperature?: number
}

interface ProviderState {
  rateLimited: boolean
  rateLimitResetAt: number | null
  available: boolean | null   // null = untested
}

const STORAGE_KEY = 'xps-llm-last-provider'
const RATE_LIMIT_COOLDOWN_MS = 60_000
/** Tasks that benefit from Ollama local for privacy / no-rate-limit */
const LOCAL_PREFERRED_TASKS = ['scrape', 'extract', 'parse', 'classify', 'enrich']

const providerState: Record<LLMProvider, ProviderState> = {
  groq:         { rateLimited: false, rateLimitResetAt: null, available: null },
  ollama:       { rateLimited: false, rateLimitResetAt: null, available: null },
  huggingface:  { rateLimited: false, rateLimitResetAt: null, available: null },
  gemini:       { rateLimited: false, rateLimitResetAt: null, available: null },
  fallback:     { rateLimited: false, rateLimitResetAt: null, available: true },
}

let activeConfig: LLMConfig = {}

function getLastProvider(): LLMProvider | null {
  try {
    return (localStorage.getItem(STORAGE_KEY) as LLMProvider) || null
  } catch {
    return null
  }
}

function setLastProvider(provider: LLMProvider) {
  try {
    localStorage.setItem(STORAGE_KEY, provider)
  } catch {
    // ignore storage errors
  }
}

function isProviderAvailable(provider: LLMProvider): boolean {
  const state = providerState[provider]
  if (state.available === false) return false
  if (!state.rateLimited) return true
  if (state.rateLimitResetAt && Date.now() > state.rateLimitResetAt) {
    state.rateLimited = false
    state.rateLimitResetAt = null
    return true
  }
  return false
}

function markRateLimited(provider: LLMProvider) {
  providerState[provider].rateLimited = true
  providerState[provider].rateLimitResetAt = Date.now() + RATE_LIMIT_COOLDOWN_MS
}

function markUnavailable(provider: LLMProvider) {
  providerState[provider].available = false
}

/**
 * Smart router: decides which provider to use based on:
 * 1. Explicit strategy override in config
 * 2. Task hint (scraping tasks prefer Ollama for privacy/no rate limits)
 * 3. Availability of API keys
 * 4. Rate limit state
 */
function pickProvider(config: LLMConfig, taskHint?: string): LLMProvider {
  const merged = { ...activeConfig, ...config }
  const strategy = merged.routerStrategy ?? 'auto'

  // Explicit provider override
  if (strategy !== 'auto' && strategy !== 'cloud' && strategy !== 'local') {
    if (isProviderAvailable(strategy as LLMProvider)) return strategy as LLMProvider
  }

  // Local-only mode
  if (strategy === 'local') {
    const ollamaUrl = merged.ollamaBaseUrl || activeConfig.ollamaBaseUrl
    if (ollamaUrl && isProviderAvailable('ollama')) return 'ollama'
    return 'fallback'
  }

  // Cloud-only mode
  if (strategy === 'cloud') {
    if (merged.groqApiKey && isProviderAvailable('groq')) return 'groq'
    if (merged.geminiApiKey && isProviderAvailable('gemini')) return 'gemini'
    if (merged.huggingfaceApiKey && isProviderAvailable('huggingface')) return 'huggingface'
    return 'fallback'
  }

  // Auto mode: use Ollama for local scraping/extraction tasks if available
  const isLocalTask = taskHint && LOCAL_PREFERRED_TASKS.some(t => taskHint.toLowerCase().includes(t))
  if (isLocalTask) {
    const ollamaUrl = merged.ollamaBaseUrl || activeConfig.ollamaBaseUrl
    if (ollamaUrl && isProviderAvailable('ollama')) return 'ollama'
  }

  // Fallback to user's last successful provider
  const preferred = getLastProvider()
  if (preferred && preferred !== 'fallback' && isProviderAvailable(preferred)) {
    if (preferred === 'groq' && merged.groqApiKey) return preferred
    if (preferred === 'ollama' && (merged.ollamaBaseUrl || activeConfig.ollamaBaseUrl)) return preferred
    if (preferred === 'huggingface' && merged.huggingfaceApiKey) return preferred
    if (preferred === 'gemini' && merged.geminiApiKey) return preferred
  }

  // Default priority: Groq → Ollama → Gemini → HuggingFace
  if (merged.groqApiKey && isProviderAvailable('groq')) return 'groq'
  const ollamaUrl = merged.ollamaBaseUrl || activeConfig.ollamaBaseUrl
  if (ollamaUrl && isProviderAvailable('ollama')) return 'ollama'
  if (merged.geminiApiKey && isProviderAvailable('gemini')) return 'gemini'
  if (merged.huggingfaceApiKey && isProviderAvailable('huggingface')) return 'huggingface'

  return 'fallback'
}

async function completeWithGroq(prompt: string, config: LLMConfig): Promise<string> {
  const apiKey = config.groqApiKey || activeConfig.groqApiKey
  const model = config.model || 'llama3-8b-8192'
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: config.maxTokens || 512,
      temperature: config.temperature ?? 0.7,
    }),
  })
  if (response.status === 429) {
    markRateLimited('groq')
    throw new Error('rate_limited')
  }
  if (!response.ok) throw new Error(`Groq error: ${response.statusText}`)
  const data = await response.json()
  return data.choices?.[0]?.message?.content ?? ''
}

/**
 * Ollama local LLM provider.
 * Connects to a self-hosted Ollama instance (default: http://localhost:11434).
 * Used for privacy-sensitive scraping/extraction tasks with no rate limits.
 */
async function completeWithOllama(prompt: string, config: LLMConfig): Promise<string> {
  const merged = { ...activeConfig, ...config }
  const baseUrl = merged.ollamaBaseUrl || 'http://localhost:11434'
  const model = merged.ollamaModel || merged.model || 'llama3'
  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          num_predict: merged.maxTokens || 512,
          temperature: merged.temperature ?? 0.7,
        },
      }),
      signal: AbortSignal.timeout(30_000),
    })
    if (!response.ok) {
      markUnavailable('ollama')
      throw new Error(`Ollama error: ${response.statusText}`)
    }
    const data = await response.json()
    providerState.ollama.available = true
    return data.response ?? ''
  } catch (err) {
    // If connection refused, mark as unavailable so future calls skip it
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('Failed to fetch') || msg.includes('ECONNREFUSED') || msg.includes('timeout')) {
      markUnavailable('ollama')
    }
    throw err
  }
}

/**
 * Probe Ollama availability in the background (non-blocking).
 * Marks the provider as available/unavailable for the smart router.
 */
export async function probeOllama(baseUrl?: string): Promise<boolean> {
  const url = baseUrl || activeConfig.ollamaBaseUrl || 'http://localhost:11434'
  try {
    const res = await fetch(`${url}/api/tags`, { signal: AbortSignal.timeout(3000) })
    const ok = res.ok
    providerState.ollama.available = ok
    return ok
  } catch {
    providerState.ollama.available = false
    return false
  }
}

async function completeWithGemini(prompt: string, config: LLMConfig): Promise<string> {
  const apiKey = config.geminiApiKey || activeConfig.geminiApiKey
  const model = config.model || 'gemini-1.5-flash'
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: config.maxTokens || 512,
          temperature: config.temperature ?? 0.7,
        },
      }),
    }
  )
  if (response.status === 429) {
    markRateLimited('gemini')
    throw new Error('rate_limited')
  }
  if (!response.ok) throw new Error(`Gemini error: ${response.statusText}`)
  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

async function completeWithHuggingFace(prompt: string, config: LLMConfig): Promise<string> {
  const apiKey = config.huggingfaceApiKey || activeConfig.huggingfaceApiKey
  const model = config.model || 'mistralai/Mistral-7B-Instruct-v0.2'
  const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { max_new_tokens: config.maxTokens || 512, temperature: config.temperature ?? 0.7 },
    }),
  })
  if (response.status === 429) {
    markRateLimited('huggingface')
    throw new Error('rate_limited')
  }
  if (!response.ok) throw new Error(`HuggingFace error: ${response.statusText}`)
  const data = await response.json()
  if (Array.isArray(data)) return data[0]?.generated_text ?? ''
  return data?.generated_text ?? ''
}

function fallbackResponse(userCommand: string): string {
  const lower = userCommand.toLowerCase()
  if (lower.includes('scrape') || lower.includes('crawl')) {
    return JSON.stringify([
      { type: 'scrape', description: 'Search target websites for business data' },
      { type: 'analyze_leads', description: 'Analyze and score scraped results' },
      { type: 'report', description: 'Generate summary report' },
    ])
  }
  if (lower.includes('email') || lower.includes('outreach')) {
    return JSON.stringify([
      { type: 'analyze_leads', description: 'Select top leads for outreach' },
      { type: 'generate_email', description: 'Generate personalized email templates' },
      { type: 'report', description: 'Log email campaign details' },
    ])
  }
  if (lower.includes('deploy') || lower.includes('deployment')) {
    return JSON.stringify([
      { type: 'build_ui', description: 'Build production assets' },
      { type: 'deploy', description: 'Deploy to production environment' },
      { type: 'report', description: 'Verify deployment health' },
    ])
  }
  if (lower.includes('dashboard') || lower.includes('analytics') || lower.includes('build')) {
    return JSON.stringify([
      { type: 'build_ui', description: 'Scaffold dashboard component structure' },
      { type: 'analyze_leads', description: 'Pull metrics and KPI data' },
      { type: 'report', description: 'Compile analytics report' },
    ])
  }
  if (lower.includes('github') || lower.includes('action') || lower.includes('ci')) {
    return JSON.stringify([
      { type: 'github_action', description: 'Trigger CI/CD workflow' },
      { type: 'deploy', description: 'Deploy artifacts from pipeline' },
      { type: 'report', description: 'Report workflow results' },
    ])
  }
  return JSON.stringify([
    { type: 'search', description: 'Search for relevant data' },
    { type: 'analyze_leads', description: 'Process and analyze results' },
    { type: 'report', description: 'Summarize findings' },
  ])
}

export const llmRouter = {
  setConfig(config: LLMConfig) {
    activeConfig = { ...activeConfig, ...config }
  },

  getConfig(): LLMConfig {
    return { ...activeConfig }
  },

  getLastProvider,

  /** Probe Ollama availability in the background */
  probeOllama,

  /** Return current provider availability state (for UI display) */
  getProviderState(): Record<LLMProvider, { available: boolean | null; rateLimited: boolean }> {
    return Object.fromEntries(
      Object.entries(providerState).map(([k, v]) => [k, { available: v.available, rateLimited: v.rateLimited }])
    ) as Record<LLMProvider, { available: boolean | null; rateLimited: boolean }>
  },

  async complete(prompt: string, config: LLMConfig = {}, userCommand?: string): Promise<string> {
    const merged = { ...activeConfig, ...config }
    const taskHint = userCommand ?? prompt
    const primary = pickProvider(merged, taskHint)

    const cloudProviders: LLMProvider[] = ['groq', 'gemini', 'huggingface']
    const allProviders: LLMProvider[] =
      primary === 'ollama'
        ? ['ollama', ...cloudProviders]
        : primary === 'fallback'
        ? cloudProviders
        : [primary, ...(['groq', 'ollama', 'gemini', 'huggingface'] as LLMProvider[]).filter((p) => p !== primary)]

    for (const provider of allProviders) {
      if (!isProviderAvailable(provider)) continue

      const hasAccess =
        (provider === 'groq' && (merged.groqApiKey || activeConfig.groqApiKey)) ||
        (provider === 'ollama' && (merged.ollamaBaseUrl || activeConfig.ollamaBaseUrl)) ||
        (provider === 'gemini' && (merged.geminiApiKey || activeConfig.geminiApiKey)) ||
        (provider === 'huggingface' && (merged.huggingfaceApiKey || activeConfig.huggingfaceApiKey))

      if (!hasAccess) continue

      try {
        let result: string
        if (provider === 'groq') result = await completeWithGroq(prompt, merged)
        else if (provider === 'ollama') result = await completeWithOllama(prompt, merged)
        else if (provider === 'gemini') result = await completeWithGemini(prompt, merged)
        else result = await completeWithHuggingFace(prompt, merged)

        setLastProvider(provider)
        return result
      } catch (err) {
        const msg = err instanceof Error ? err.message : ''
        if (msg === 'rate_limited') continue   // try next provider
        // Ollama unreachable — continue to cloud providers
        if (provider === 'ollama') continue
        throw err
      }
    }

    // All providers unavailable or no keys configured — use rule-based fallback
    return fallbackResponse(userCommand ?? prompt)
  },
}
