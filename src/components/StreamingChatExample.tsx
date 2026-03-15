import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStreamingChat } from '@/hooks/useStreamingChat'
import { Loader2 } from 'lucide-react'

export function StreamingChatExample() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const { sendMessage, isStreaming, cancelStream } = useStreamingChat()

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return

    setResponse('')
    const message = input
    setInput('')

    try {
      await sendMessage(message, {
        onChunk: (content) => {
          setResponse((prev) => prev + content)
        },
        onComplete: (fullContent) => {
          console.log('Streaming complete:', fullContent)
        },
        onError: (error) => {
          console.error('Streaming error:', error)
          setResponse(`Error: ${error.message}`)
        },
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Streaming Chat Example</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Type your message..."
            disabled={isStreaming}
          />
          {isStreaming ? (
            <Button onClick={cancelStream} variant="destructive">
              Cancel
            </Button>
          ) : (
            <Button onClick={handleSend} disabled={!input.trim()}>
              Send
            </Button>
          )}
        </div>

        {(response || isStreaming) && (
          <div className="p-4 bg-muted rounded-lg min-h-[100px]">
            {isStreaming && !response && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Waiting for response...</span>
              </div>
            )}
            {response && (
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{response}</p>
                {isStreaming && (
                  <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
