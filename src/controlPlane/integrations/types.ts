export type IntegrationProvider = 'github' | 'supabase' | 'vercel' | 'railway' | 'groq'

export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'testing'

  provider: IntegrationProvider
  status: IntegrationSta
  last_error?: string
  display_name?: string
  updated_at: string

  id: string
  name: string
  icon: string
  metadata?: Integra
}
e

  requiresConnection: boolean
  method?: '

  provider: In
  config?: Record<str

  ok: boolean
  message: string
  latency_ms?: number


  error?: {
    message:
    hint?: stri
  traceId: string






























