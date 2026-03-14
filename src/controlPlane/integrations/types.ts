export type IntegrationProvider = 'github' | 'supabase' | 'vercel' | 'railway' | 'groq'

export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'testing'

export interface IntegrationMetadata {
  provider: IntegrationProvider
  status: IntegrationStatus
  last_error?: string
  display_name?: string
  updated_at: string
}

export interface IntegrationAction {
  id: string
  label: string
  description: string
  endpoint: string
  requiresConnection: boolean
  method?: 'GET' | 'POST' | 'DELETE'
}

export interface Integration {
  id: string
  provider: IntegrationProvider
  name: string
  description: string
  icon: string
  status: IntegrationStatus
  actions: IntegrationAction[]
  metadata?: IntegrationMetadata
}

export interface ConnectPayload {
  provider: IntegrationProvider
  config?: Record<string, string>
}

export interface TestResult {
  ok: boolean
  message: string
  latency_ms?: number
}

export interface ApiResponse<T = unknown> {
  ok: boolean
  data?: T
  error?: {
    code: string
    message: string
    hint?: string
  }
  traceId: string
}






























