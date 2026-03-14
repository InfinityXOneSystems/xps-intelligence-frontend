import { API_CONFIG } from "@/lib/config"

interface ApiError {
  message: string

 


    this.baseUrl = baseUr

    this.token = token
  }

      this.token = localStorage.
    return this.token


  }
  async checkHealth():
      return this.healthCheckPromise


          signal: AbortSignal
        this.isBackend
      } catch (error) {
     
        setTimeout(()
   

    return this.

    return this.isBackendAvailable


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


      body: data ? JSON.stringify
  }
  async put<T>(e
      method: "PUT",
    })

    retu
}











































