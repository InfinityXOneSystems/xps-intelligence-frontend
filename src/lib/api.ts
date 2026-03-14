import { API_CONFIG } from "@/lib/config"

const API_BASE_URL = API_CONFIG.API_URL

interface ApiError {
  message: string
  status: number
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null
  private isBackendAvailable: boolean | null = null
  private healthCheckPromise: Promise<boolean> | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem("auth_token", token)
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("auth_token")
    }
    return this.token
  }

  clearToken() {
    this.token = null
    localStorage.removeItem("auth_token")
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
    const token = this.getToken()

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const error: ApiError = {
          message: `API request failed: ${response.statusText}`,
          status: response.status,
        }
        throw error
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
    })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    })
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }
}

export const api = new ApiClient(API_BASE_URL)
