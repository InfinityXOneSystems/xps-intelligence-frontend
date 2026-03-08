export type TaskType =
  | 'scrape'
  | 'generate_email'
  | 'analyze_leads'
  | 'deploy'
  | 'build_ui'
  | 'search'
  | 'report'
  | 'github_action'

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed'

export type PlanStatus = 'pending' | 'running' | 'completed' | 'failed' | 'partial'

export interface ToolCall {
  id: string
  toolId: string
  toolName: string
  input: Record<string, unknown>
  output?: Record<string, unknown> | string
  startedAt: string
  completedAt?: string
  status: TaskStatus
  logMessages: string[]
}

export interface AgentTask {
  id: string
  type: TaskType
  description: string
  status: TaskStatus
  startedAt?: string
  completedAt?: string
  result?: string
  error?: string
  toolCalls?: ToolCall[]
}

export interface AgentPlan {
  id: string
  userCommand: string
  tasks: AgentTask[]
  createdAt: string
  status: PlanStatus
}

export interface AgentEvent {
  type: 'plan_created' | 'task_started' | 'task_completed' | 'task_failed' | 'plan_completed' | 'tool_call'
  planId: string
  taskId?: string
  toolCallId?: string
  timestamp: string
  payload?: unknown
}
