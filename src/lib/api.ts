import { API_CONFIG } from "@/lib/config"

const API_BASE_URL = API_CONFIG.API_URL

interface ApiError {
  message: string
  status: number
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

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
        ...(token && { Authorization: "Bearer " + token }),
        ...options.headers,
      },
      signal: AbortSignal.timeout(10000),
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const error: ApiError = {
          message: "API Error: " + response.statusText,
          status: response.status,
        }
        throw error
      }

      if (response.status === 204) {
        return undefined as T
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const api = new ApiClient(API_BASE_URL)

