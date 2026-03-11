type MessageHandler = (data: unknown) => void

class WebSocketClient {
  private ws: WebSocket | null = null
  private handlers: Map<string, MessageHandler[]> = new Map()
  private reconnectTimeout: number = 3000
  private url: string
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 10

  constructor(url: string) {
    this.url = url
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          const { type, data } = message

          const handlers = this.handlers.get(type) || []
          handlers.forEach((handler) => handler(data))
        } catch (error) {
          console.error('WebSocket message error:', error)
        }
      }

      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        this.attemptReconnect()
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('WebSocket connection error:', error)
      this.attemptReconnect()
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Reconnecting... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      setTimeout(() => this.connect(), this.reconnectTimeout)
    } else {
      console.error('Max reconnect attempts reached')
    }
  }

  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, [])
    }
    this.handlers.get(type)!.push(handler)
  }

  off(type: string, handler: MessageHandler) {
    const handlers = this.handlers.get(type) || []
    const index = handlers.indexOf(handler)
    if (index > -1) {
      handlers.splice(index, 1)
    }
  }

  send(type: string, data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  disconnect() {
    this.ws?.close()
    this.ws = null
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

const WS_URL = import.meta.env.WS_URL || 'ws://localhost:3000'
export const wsClient = new WebSocketClient(WS_URL)
