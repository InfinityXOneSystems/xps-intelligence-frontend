export type TaskType =
  | 'scrape'
  | 'generate_email'
  | 'analyze_leads'
  | 'deploy'
  | 'build_ui'
  | 'search'
  | 'report'
  | 'github_action'
  | 'plan'
  | 'research'
  | 'validate'
  | 'monitor'
  | 'media'
  | 'knowledge'
  | 'predict'
  | 'simulate'

export type AgentRole =
  | 'PlannerAgent'
  | 'ResearchAgent'
  | 'BuilderAgent'
  | 'ScraperAgent'
  | 'MediaAgent'
  | 'ValidatorAgent'
  | 'DevOpsAgent'
  | 'MonitoringAgent'
  | 'KnowledgeAgent'
  | 'BusinessAgent'
  | 'PredictionAgent'
  | 'SimulationAgent'

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
  agent?: AgentRole
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

/** Memory persistence interfaces */
export interface MemoryEntry {
  id: string
  type: 'task' | 'knowledge' | 'vector'
  key: string
  value: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface AgentMemoryStore {
  entries: MemoryEntry[]
  lastUpdated: string
}
