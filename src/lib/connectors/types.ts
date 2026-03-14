/**
 * Universal Connector Interface
 * All integrations must implement this interface
 */

export interface ErrorDetail {
  code: string
  message: string
  hint?: string
  details?: any
}

export interface ConnectResult {
  ok: boolean
  message?: string
  error?: ErrorDetail
}

export interface TestResult {
  ok: boolean
  latency?: number
  message?: string
  error?: ErrorDetail
}

export interface StatusResult {
  connected: boolean
  lastTest?: Date
  lastError?: ErrorDetail
}

export interface ActionDefinition {
  name: string
  description: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: string
  parameters?: Array<{
    name: string
    type: string
    required: boolean
    description: string
  }>
}

export interface IConnector {
  name: string
  version: string
  
  connect(credentials: Record<string, string>): Promise<ConnectResult>
  test(): Promise<TestResult>
  status(): Promise<StatusResult>
  disconnect(): Promise<void>
  actions(): ActionDefinition[]
}

export type ConnectorName = 'github' | 'supabase' | 'vercel' | 'railway' | 'groq' | 'local_agent'
