import type { ApiResponse, ConnectPayload, IntegrationProvider } from './types'

export class IntegrationClient {
  private baseUrl: string

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl
  }

  async connect(payload: ConnectPayload): Promise<ApiResponse> {
    const res = await fetch(`${this.baseUrl}/api/integrations/${payload.provider}/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    })
    return res.json()
  }

  async test(provider: IntegrationProvider): Promise<ApiResponse> {
    const res = await fetch(`${this.baseUrl}/api/integrations/${provider}/test`, {
      method: 'GET',
      credentials: 'include',
    })
    return res.json()
  }

  async disconnect(provider: IntegrationProvider): Promise<ApiResponse> {
    const res = await fetch(`${this.baseUrl}/api/integrations/${provider}/disconnect`, {
      method: 'DELETE',
      credentials: 'include',
    })
    return res.json()
  }

  async action<T = unknown>(
    endpoint: string,
    method: 'GET' | 'POST' | 'DELETE' = 'GET',
    body?: unknown
  ): Promise<ApiResponse<T>> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    })
    return res.json()
  }
}

export const integrationClient = new IntegrationClient()
