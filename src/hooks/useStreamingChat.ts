import { useState, useCallback, useRef } from 'react'

export interface StreamingChatOptions {
  onChunk?: (content: string) => void
  onComplete?: (fullContent: string) => void
  onError?: (error: Error) => void
  model?: string
}

export function useStreamingChat() {
  const [isStreaming, setIsStreaming] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (
    message: string,
    options: StreamingChatOptions = {}
  ): Promise<string> => {
    const {
      onChunk,
      onComplete,
      onError,
      model = 'llama-3.3-70b-versatile'
    } = options

    setIsStreaming(true)
    abortControllerRef.current = new AbortController()

    let fullContent = ''

    try {
      const response = await fetch('/api/llm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          model,
          stream: true
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || 'Failed to get response from AI')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response stream available')
      }

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.error) {
                throw new Error(data.error)
              }

              if (data.content) {
                fullContent += data.content
                onChunk?.(data.content)
              }

              if (data.done) {
                break
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e)
            }
          }
        }
      }

      onComplete?.(fullContent)
      return fullContent
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error occurred')
      onError?.(err)
      throw err
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }, [])

  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsStreaming(false)
    }
  }, [])

  return {
    sendMessage,
    cancelStream,
    isStreaming,
  }
}
