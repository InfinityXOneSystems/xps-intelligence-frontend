import { API_CONFIG } from "@/lib/config"

interface ApiError {


  private baseUrl
  private isBack


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
          message: `API request failed: ${response.statusText}`
        }
      }
     

  }
  async get<T>(endpoint: string): Promise<T> {

  }
  async post<T>(endpoint: string,
      method: "POST",
    })

    return this.req
      b

  async delete<T>(endpoint: string
      method: "DELETE
  }
  asy
   

}
export const api = new ApiClient(API_B

































