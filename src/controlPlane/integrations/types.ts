export type IntegrationProvider = 'github' | 'supabase' | 'vercel' | 'railway' | 'groq'

export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'testing'

export interface IntegrationMetadata {
  integration_id: string
  provider: IntegrationProvider
  owner_user_id: string
  status: IntegrationStatus
  last_tested_at?: string
  last_error?: string
  scopes?: string[]
  display_name?: string
  created_at: string
  updated_at: string
}

export interface Integration {
  id: string
  provider: IntegrationProvider
  name: string
  description: string
  icon: string
  status: IntegrationStatus
  metadata?: IntegrationMetadata
  actions: IntegrationAction[]
}

export interface IntegrationAction {
  id: string
  label: string
  description: string
  requiresConnection: boolean
  endpoint: string
  method?: 'GET' | 'POST' | 'DELETE'
}

export interface ConnectPayload {
  provider: IntegrationProvider
  token?: string
  config?: Record<string, unknown>
}

export interface TestResult {
  ok: boolean
  provider: IntegrationProvider
  message: string
  details?: Record<string, unknown>
  latency_ms?: number
}

export interface ApiResponse<T = unknown> {
  ok: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
    hint?: string
  }
  traceId: string
}
