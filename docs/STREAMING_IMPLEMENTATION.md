# Streaming AI Responses Implementation

## Overview

The XPS Intelligence system now supports real-time streaming responses from AI models, providing a more interactive and responsive chat experience. Messages appear token-by-token as they're generated, similar to ChatGPT.

## Architecture

### Backend (Edge Runtime)

**Endpoint**: `/api/llm/chat`

The chat endpoint now supports both streaming and non-streaming modes:

```typescript
// Request payload
{
  message: string,      // The user's message
  model?: string,       // Default: 'llama-3.3-70b-versatile'
  stream?: boolean      // Default: false
}
```

#### Streaming Response Format

When `stream: true`, the endpoint returns a Server-Sent Events (SSE) stream:

```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

data: {"content": "Hello", "done": false}

data: {"content": " there!", "done": false}

data: {"content": "", "done": true, "traceId": "..."}
```

#### Non-Streaming Response Format

When `stream: false` (default), the endpoint returns a standard JSON response:

```json
{
  "ok": true,
  "data": {
    "reply": "Full message content here",
    "model": "llama-3.3-70b-versatile"
  },
  "traceId": "..."
}
```

### Frontend

#### Hook: `useStreamingChat`

A reusable React hook for streaming chat functionality:

```typescript
import { useStreamingChat } from '@/hooks/useStreamingChat'

function MyComponent() {
  const { sendMessage, cancelStream, isStreaming } = useStreamingChat()

  const handleSend = async () => {
    await sendMessage('Hello, AI!', {
      onChunk: (content) => {
        // Handle each chunk as it arrives
        console.log('Received:', content)
      },
      onComplete: (fullContent) => {
        // Handle complete response
        console.log('Complete:', fullContent)
      },
      onError: (error) => {
        // Handle errors
        console.error('Error:', error)
      },
      model: 'llama-3.3-70b-versatile'
    })
  }

  return (
    <button onClick={handleSend} disabled={isStreaming}>
      Send Message
    </button>
  )
}
```

#### Service: `chatService`

Enhanced chat service with streaming support:

```typescript
import { sendStreamingMessage } from '@/services/chatService'

await sendStreamingMessage(
  {
    message: 'Analyze this data...',
    agentRole: 'PlannerAgent',
    sessionId: 'session-123',
    stream: true
  },
  {
    onChunk: (content) => updateUI(content),
    onComplete: (fullContent) => finalizeUI(fullContent),
    onError: (error) => showError(error)
  }
)
```

## Implementation in AIChatPanel

The main chat interface (`AIChatPanel.tsx`) has been updated to use streaming by default:

### Key Changes

1. **Message Creation**: Assistant message is created immediately with empty content
2. **Streaming Updates**: Message content is updated in real-time as chunks arrive
3. **Activity Feed**: Shows streaming status ("Streaming response from Groq AI…")
4. **Fallback Support**: Falls back to non-streaming spark.llm if streaming fails

### Code Example

```typescript
const handleSend = async () => {
  // Create empty assistant message immediately
  const assistantMessage: Message = {
    id: assistantMessageId,
    role: 'assistant',
    content: '',
    timestamp: new Date(),
  }
  setMessages((prev) => [...prev, assistantMessage])

  // Stream the response
  const reader = apiResponse.body?.getReader()
  let response = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    // Parse SSE chunks
    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6))
        
        if (data.content) {
          response += data.content
          // Update message in real-time
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: response }
                : msg
            )
          )
        }
      }
    }
  }
}
```

## Benefits

1. **Better UX**: Users see responses immediately, not after full completion
2. **Perceived Performance**: Feels faster even if total time is similar
3. **Progressive Disclosure**: Long responses are readable before completion
4. **Real-time Feedback**: Users know the system is working
5. **Cancellation Support**: Can abort long-running requests

## Error Handling

The implementation includes robust error handling:

- **Stream Errors**: Caught and passed via `onError` callback
- **Network Errors**: Gracefully fall back to non-streaming mode
- **Timeout Handling**: 30-second timeout prevents hanging
- **Parsing Errors**: Individual chunk errors don't break the stream

## Performance Considerations

1. **Efficient Updates**: React state updates are batched where possible
2. **Memory Management**: Stream reader is properly closed
3. **Abort Controller**: Allows cancellation to free resources
4. **Edge Runtime**: Serverless function uses edge runtime for low latency

## Testing

### Manual Testing

1. Open the chat panel (Lead Sniper icon in UI)
2. Send a message
3. Observe tokens appearing in real-time
4. Check Activity tab for streaming status

### Automated Testing

```bash
# Test streaming endpoint
curl -X POST http://localhost:5173/api/llm/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Tell me a story","stream":true}'

# Test non-streaming endpoint
curl -X POST http://localhost:5173/api/llm/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Tell me a story","stream":false}'
```

## Configuration

### Environment Variables

```bash
# Required for AI functionality
AI_GROQ_API_KEY=your_groq_api_key_here
```

### Model Selection

Default model: `llama-3.3-70b-versatile`

Supported models (Groq):
- llama-3.3-70b-versatile
- llama-3.1-70b-versatile
- llama-3.1-8b-instant
- mixtral-8x7b-32768
- gemma2-9b-it

## Backward Compatibility

The implementation maintains backward compatibility:

- Non-streaming mode still works (`stream: false`)
- Existing chat interfaces continue to function
- Fallback to `spark.llm` when streaming fails
- No breaking changes to API contracts

## Future Enhancements

1. **Multi-turn Context**: Maintain conversation history across streams
2. **Tool Calling**: Stream tool execution results in real-time
3. **Progress Indicators**: Show percentage complete for known tasks
4. **Adaptive Streaming**: Auto-disable for slow connections
5. **Cache Support**: Cache frequent responses to reduce latency

## Troubleshooting

### Streaming Not Working

1. Check `AI_GROQ_API_KEY` is set in environment
2. Verify network allows SSE connections
3. Check browser console for errors
4. Ensure Groq API quota is available

### Performance Issues

1. Reduce chunk size in streaming logic
2. Implement debouncing for UI updates
3. Use production build (not dev mode)
4. Check network latency to Groq API

### Error: "No response stream available"

- Groq API may be down
- Network blocking SSE
- Falls back to non-streaming automatically

## Related Files

- `/pages/api/llm/chat.ts` - Streaming API endpoint
- `/src/hooks/useStreamingChat.ts` - Streaming chat hook
- `/src/services/chatService.ts` - Chat service with streaming
- `/src/components/AIChatPanel.tsx` - Main chat UI with streaming
