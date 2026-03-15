import type { AgentRole } from '@/lib/agentTypes'
import { API_CONFIG } from '@/lib/config'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  agentRole?: AgentRole
  timestamp: string
  status?: 'sending' | 'sent' | 'error'
}

export interface AgentStatus {
  role: AgentRole
  status: 'idle' | 'running' | 'error' | 'offline'
  lastActivity?: string
  currentTask?: string
  tasksCompleted: number
  successRate: number
}

export interface SendMessageRequest {
  message: string
  agentRole?: AgentRole
  sessionId?: string
  stream?: boolean
}

export interface SendMessageResponse {
  id: string
  reply: ChatMessage
  agentRole: AgentRole
  sessionId: string
}

export interface StreamingCallbacks {
  onChunk?: (content: string) => void
  onComplete?: (fullContent: string) => void
  onError?: (error: Error) => void
}

const MOCK_HISTORY: ChatMessage[] = [
  {
    id: '1',
    role: 'system',
    content: 'XPS Intelligence Agent System initialized. All 13 agents online.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    role: 'user',
    content: 'Show me the latest scraping results',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: '3',
    role: 'assistant',
    content: 'I found 847 new contractor leads from the last scraping run completed 2 hours ago. Top results include 120 general contractors in Texas, 89 roofing companies in Florida, and 67 electrical contractors in California.',
    agentRole: 'ScraperAgent',
    timestamp: new Date(Date.now() - 1799000).toISOString(),
  },
]

export async function sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
  try {
    const res = await fetch(`${API_CONFIG.API_URL}/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    if (!res.ok) throw new Error('API unavailable')
    return res.json()
  } catch {
    const sessionId = request.sessionId || crypto.randomUUID()
    return {
      id: crypto.randomUUID(),
      sessionId,
      agentRole: request.agentRole || 'PlannerAgent',
      reply: {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `[Mock] Received: "${request.message}". Connect to the backend API to get real agent responses.`,
        agentRole: request.agentRole || 'PlannerAgent',
        timestamp: new Date().toISOString(),
        status: 'sent',
      },
    }
  }
}

export async function sendStreamingMessage(
  request: SendMessageRequest,
  callbacks: StreamingCallbacks
): Promise<void> {
  try {
    const response = await fetch('/api/llm/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: request.message,
        model: 'llama-3.3-70b-versatile',
        stream: true,
      }),
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

    let fullContent = ''

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
              callbacks.onChunk?.(data.content)
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

    callbacks.onComplete?.(fullContent)
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error occurred')
    callbacks.onError?.(err)
    throw err
  }
}

export async function getChatHistory(sessionId?: string): Promise<ChatMessage[]> {
  try {
    const url = sessionId ? `${API_CONFIG.API_URL}/chat/history?sessionId=${sessionId}` : `${API_CONFIG.API_URL}/chat/history`
    const res = await fetch(url)
    if (!res.ok) throw new Error('API unavailable')
    return res.json()
  } catch {
    return MOCK_HISTORY
  }
}

export async function clearHistory(sessionId?: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_CONFIG.API_URL}/chat/history`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
    if (!res.ok) throw new Error('API unavailable')
    return res.json()
  } catch {
    return { success: true }
  }
}

export async function getAgentStatus(): Promise<AgentStatus[]> {
  try {
    const res = await fetch(`${API_CONFIG.API_URL}/agents/status`)
    if (!res.ok) throw new Error('API unavailable')
    return res.json()
  } catch {
    const agents: AgentRole[] = [
      'PlannerAgent', 'ResearchAgent', 'BuilderAgent', 'ScraperAgent', 'MediaAgent',
      'ValidatorAgent', 'DevOpsAgent', 'MonitoringAgent', 'KnowledgeAgent',
      'BusinessAgent', 'PredictionAgent', 'SimulationAgent', 'MetaAgent',
    ]
    return agents.map((role, i) => ({
      role,
      status: i < 6 ? 'idle' : i === 6 ? 'running' : 'idle',
      lastActivity: new Date(Date.now() - i * 600000).toISOString(),
      tasksCompleted: Math.floor(Math.random() * 200),
      successRate: 0.85 + Math.random() * 0.14,
    }))
  }
}

export async function executeAgentCommand(
  agentRole: AgentRole,
  command: string,
  params?: Record<string, unknown>
): Promise<{ taskId: string; status: string; message: string }> {
  try {
    const res = await fetch(`${API_CONFIG.API_URL}/agents/${agentRole}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command, params }),
    })
    if (!res.ok) throw new Error('API unavailable')
    return res.json()
  } catch {
    return {
      taskId: crypto.randomUUID(),
      status: 'queued',
      message: `Command queued for ${agentRole} (mock)`,
    }
  }
}

export async function getAgentChat(agentRole: AgentRole): Promise<ChatMessage[]> {
  try {
    const res = await fetch(`${API_CONFIG.API_URL}/agents/${agentRole}/chat`)
    if (!res.ok) throw new Error('API unavailable')
    return res.json()
  } catch {
    return MOCK_HISTORY.filter(m => !m.agentRole || m.agentRole === agentRole)
  }
}
