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

// The thirteen first-class agents defined in AGENTS.md
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
  | 'MetaAgent'

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed'

export type PlanStatus = 'pending' | 'running' | 'completed' | 'failed' | 'partial'

export interface AgentDefinition {
  role: AgentRole
  description: string
  primaryTools: string[]
  taskTypes: TaskType[]
}

export const AGENT_DEFINITIONS: AgentDefinition[] = [
  {
    role: 'PlannerAgent',
    description: 'Decomposes goals into tasks, routes to agents',
    primaryTools: ['run_planner_agent', 'run_supervisor_agent'],
    taskTypes: ['report', 'analyze_leads'],
  },
  {
    role: 'ResearchAgent',
    description: 'Searches web, retrieves documents, synthesizes information',
    primaryTools: ['scrape_search_engine', 'http_crawler'],
    taskTypes: ['search', 'report'],
  },
  {
    role: 'BuilderAgent',
    description: 'Generates code, scaffolds components, edits files',
    primaryTools: ['generate_code', 'generate_page', 'generate_component'],
    taskTypes: ['build_ui'],
  },
  {
    role: 'ScraperAgent',
    description: 'Collects leads, contacts, company data at scale',
    primaryTools: ['scrape_leads', 'extract_emails', 'playwright_browser'],
    taskTypes: ['scrape'],
  },
  {
    role: 'MediaAgent',
    description: 'Generates and edits images, video, audio',
    primaryTools: ['generate_image', 'edit_image'],
    taskTypes: ['build_ui'],
  },
  {
    role: 'ValidatorAgent',
    description: 'Runs lint, tests, type checks, and security scans',
    primaryTools: ['debug_code', 'shell_exec'],
    taskTypes: ['report'],
  },
  {
    role: 'DevOpsAgent',
    description: 'Deploys, monitors, triggers workflows',
    primaryTools: ['deploy_vercel', 'build_docker', 'trigger_workflow'],
    taskTypes: ['deploy', 'github_action'],
  },
  {
    role: 'MonitoringAgent',
    description: 'Watches system health, alerts on anomalies',
    primaryTools: ['run_worker_agent'],
    taskTypes: ['report'],
  },
  {
    role: 'KnowledgeAgent',
    description: 'Stores and retrieves memory across sessions',
    primaryTools: ['store_memory', 'vector_search'],
    taskTypes: ['report', 'search'],
  },
  {
    role: 'BusinessAgent',
    description: 'Runs lead discovery, outreach, analytics pipelines',
    primaryTools: ['scrape_market_leads', 'generate_outreach', 'export_crm'],
    taskTypes: ['scrape', 'generate_email', 'analyze_leads'],
  },
  {
    role: 'PredictionAgent',
    description: 'Scores leads, forecasts pipeline, models behavior',
    primaryTools: ['scrape_market_leads'],
    taskTypes: ['analyze_leads', 'report'],
  },
  {
    role: 'SimulationAgent',
    description: 'Runs scenario simulations and what-if analysis',
    primaryTools: ['run_worker_agent'],
    taskTypes: ['report', 'analyze_leads'],
  },
  {
    role: 'MetaAgent',
    description: 'Continuously redesigns system architecture and self-improves',
    primaryTools: ['run_planner_agent', 'run_supervisor_agent'],
    taskTypes: ['plan', 'report'],
  },
]

// Map task types to the agents best suited to handle them
export const TASK_AGENT_MAP: Record<TaskType, AgentRole> = {
  scrape: 'ScraperAgent',
  generate_email: 'BusinessAgent',
  analyze_leads: 'PredictionAgent',
  deploy: 'DevOpsAgent',
  build_ui: 'BuilderAgent',
  search: 'ResearchAgent',
  report: 'PlannerAgent',
  github_action: 'DevOpsAgent',
  plan: 'PlannerAgent',
  research: 'ResearchAgent',
  validate: 'ValidatorAgent',
  monitor: 'MonitoringAgent',
  media: 'MediaAgent',
  knowledge: 'KnowledgeAgent',
  predict: 'PredictionAgent',
  simulate: 'SimulationAgent',
}

/** Orchestrator configuration */
export interface OrchestratorConfig {
  concurrencyLimit: number
  maxRetries: number
  retryDelayMs: number
}

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
  /** Agent role as set by the task author or UI */
  agent?: AgentRole
  /** Agent role assigned by the orchestrator during execution */
  assignedAgent?: AgentRole
  startedAt?: string
  completedAt?: string
  result?: string
  error?: string
  toolCalls?: ToolCall[]
  retryCount?: number
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

export interface OrchestratorConfig {
  concurrencyLimit: number
  maxRetries: number
  retryDelayMs: number
}
