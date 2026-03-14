import { API_CONFIG } from "@/lib/config"

interface ApiError {
  message: string
  status?: number
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null
  private healthCheckPromise: Promise<boolean> | null = null
  private isBackendAvailable: boolean | null = null

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl
    this.token = token || null
  }

  setToken(token: string) {
    this.token = token
  }

  getToken(): string | null {
    return this.token
  }

  async checkHealth(): Promise<boolean> {
    if (this.healthCheckPromise) {
      return this.healthCheckPromise
    }

    this.healthCheckPromise = (async () => {
      try {
        const response = await fetch(this.baseUrl + '/health', {
          signal: AbortSignal.timeout(5000),
        })
        this.isBackendAvailable = response.ok
        return response.ok
      } catch (error) {
        this.isBackendAvailable = false
        return false
      } finally {
        setTimeout(() => {
          this.healthCheckPromise = null
        }, 30000)
      }
    })()

    return this.healthCheckPromise
  }

  getBackendStatus(): boolean | null {
    return this.isBackendAvailable
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = this.baseUrl + endpoint

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (options.headers) {
      Object.assign(headers, options.headers)
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error: ApiError = {
        message: `HTTP error! status: ${response.status}`,
        status: response.status,
      }
      throw error
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

export const api = new ApiClient(API_CONFIG.API_URL)
