import type {
  IConnector,
  ConnectResult,
  TestResult,
  StatusResult,
  ActionDefinition,
  ErrorDetail,
} from './types'

interface GroqCredentials {
  apiKey: string
}

export class GroqConnector implements IConnector {
  name = 'groq'
  version = '1.0.0'
  
  private apiKey: string | null = null
  private lastTestResult: TestResult | null = null
  private lastTestTime: Date | null = null

  async connect(credentials: Record<string, string>): Promise<ConnectResult> {
    const apiKey = credentials.apiKey
    
    if (!apiKey || !apiKey.startsWith('gsk_')) {
      return {
        ok: false,
        error: {
          code: 'INVALID_API_KEY',
          message: 'Invalid Groq API key format',
          hint: 'API key should start with gsk_',
        },
      }
    }

    this.apiKey = apiKey
    
    const testResult = await this.test()
    if (!testResult.ok) {
      this.apiKey = null
      return {
        ok: false,
        message: 'Connection failed',
        error: testResult.error,
      }
    }

    return {
      ok: true,
      message: 'Connected to Groq successfully',
    }
  }

  async test(): Promise<TestResult> {
    if (!this.apiKey) {
      return {
        ok: false,
        error: {
          code: 'NOT_CONNECTED',
          message: 'Not connected to Groq',
          hint: 'Call connect() first',
        },
      }
    }

    const startTime = Date.now()

    try {
      const response = await fetch('/api/integrations/groq/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: this.apiKey }),
        signal: AbortSignal.timeout(10000),
      })

      const latency = Date.now() - startTime

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }))
        this.lastTestResult = {
          ok: false,
          latency,
          error: {
            code: 'TEST_FAILED',
            message: error.error || 'Groq test failed',
            details: error,
          },
        }
        this.lastTestTime = new Date()
        return this.lastTestResult
      }

      this.lastTestResult = {
        ok: true,
        latency,
        message: 'Groq API is operational',
      }
      this.lastTestTime = new Date()
      return this.lastTestResult
    } catch (err) {
      const latency = Date.now() - startTime
      const error = err as Error
      
      this.lastTestResult = {
        ok: false,
        latency,
        error: {
          code: error.name === 'TimeoutError' ? 'TIMEOUT' : 'NETWORK_ERROR',
          message: error.message || 'Failed to reach Groq API',
          hint: error.name === 'TimeoutError' ? 'Request timed out after 10s' : 'Check network connection',
        },
      }
      this.lastTestTime = new Date()
      return this.lastTestResult
    }
  }

  async status(): Promise<StatusResult> {
    return {
      connected: this.apiKey !== null,
      lastTest: this.lastTestTime || undefined,
      lastError: this.lastTestResult && !this.lastTestResult.ok 
        ? this.lastTestResult.error 
        : undefined,
    }
  }

  async disconnect(): Promise<void> {
    this.apiKey = null
    this.lastTestResult = null
    this.lastTestTime = null
  }

  actions(): ActionDefinition[] {
    return [
      {
        name: 'test',
        description: 'Test connection to Groq API',
        method: 'POST',
        endpoint: '/api/integrations/groq/test',
        parameters: [
          {
            name: 'apiKey',
            type: 'string',
            required: true,
            description: 'Groq API key (starts with gsk_)',
          },
        ],
      },
      {
        name: 'chat',
        description: 'Send a chat message to Groq LLM',
        method: 'POST',
        endpoint: '/api/integrations/groq/chat',
        parameters: [
          {
            name: 'message',
            type: 'string',
            required: true,
            description: 'Message to send to the LLM',
          },
          {
            name: 'model',
            type: 'string',
            required: false,
            description: 'Model to use (default: llama-3.3-70b-versatile)',
          },
        ],
      },
    ]
  }
}
