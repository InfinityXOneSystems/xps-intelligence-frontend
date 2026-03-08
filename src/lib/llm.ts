export type LLMProvider = 'groq' | 'huggingface' | 'gemini' | 'fallback'

export interface LLMConfig {
  provider?: LLMProvider
  groqApiKey?: string
  huggingfaceApiKey?: string
  geminiApiKey?: string
  model?: string
  maxTokens?: number
  temperature?: number
}

interface ProviderState {
  rateLimited: boolean
  rateLimitResetAt: number | null
}

const STORAGE_KEY = 'xps-llm-last-provider'
const RATE_LIMIT_COOLDOWN_MS = 60_000

const providerState: Record<LLMProvider, ProviderState> = {
  groq: { rateLimited: false, rateLimitResetAt: null },
  huggingface: { rateLimited: false, rateLimitResetAt: null },
  gemini: { rateLimited: false, rateLimitResetAt: null },
  fallback: { rateLimited: false, rateLimitResetAt: null },
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

function pickProvider(config: LLMConfig): LLMProvider {
  if (config.provider && config.provider !== 'fallback' && isProviderAvailable(config.provider)) {
    return config.provider
  }

  const preferred = getLastProvider()
  if (preferred && preferred !== 'fallback' && isProviderAvailable(preferred)) {
    if (preferred === 'groq' && (config.groqApiKey || activeConfig.groqApiKey)) return preferred
    if (preferred === 'huggingface' && (config.huggingfaceApiKey || activeConfig.huggingfaceApiKey)) return preferred
    if (preferred === 'gemini' && (config.geminiApiKey || activeConfig.geminiApiKey)) return preferred
  }

  const merged = { ...activeConfig, ...config }
  if (merged.groqApiKey && isProviderAvailable('groq')) return 'groq'
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

  async complete(prompt: string, config: LLMConfig = {}, userCommand?: string): Promise<string> {
    const merged = { ...activeConfig, ...config }
    const providers: LLMProvider[] = ['groq', 'gemini', 'huggingface']
    const primary = pickProvider(merged)

    const orderedProviders =
      primary === 'fallback'
        ? providers
        : [primary, ...providers.filter((p) => p !== primary)]

    for (const provider of orderedProviders) {
      if (!isProviderAvailable(provider)) continue
      const hasKey =
        (provider === 'groq' && merged.groqApiKey) ||
        (provider === 'gemini' && merged.geminiApiKey) ||
        (provider === 'huggingface' && merged.huggingfaceApiKey)
      if (!hasKey) continue

      try {
        let result: string
        if (provider === 'groq') result = await completeWithGroq(prompt, merged)
        else if (provider === 'gemini') result = await completeWithGemini(prompt, merged)
        else result = await completeWithHuggingFace(prompt, merged)

        setLastProvider(provider)
        return result
      } catch (err) {
        const msg = err instanceof Error ? err.message : ''
        if (msg !== 'rate_limited') throw err
        // rate limited — try next provider
      }
    }

    // All providers unavailable or no keys configured — use rule-based fallback
    return fallbackResponse(userCommand ?? prompt)
  },
}
