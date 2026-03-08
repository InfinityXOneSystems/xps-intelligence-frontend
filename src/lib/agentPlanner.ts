import { llmRouter } from './llm'
import type { AgentPlan, AgentTask, TaskType, ToolCall } from './agentTypes'

function uuid(): string {
  return crypto.randomUUID()
}

function now(): string {
  return new Date().toISOString()
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const TASK_TOOL_MAP: Record<TaskType, string[]> = {
  scrape: ['playwright_browser', 'http_crawler', 'scraper'],
  generate_email: ['email_generator'],
  analyze_leads: ['lead_scorer', 'database'],
  deploy: ['deployment', 'shell_exec'],
  build_ui: ['filesystem', 'shell_exec'],
  search: ['http_crawler', 'playwright_browser'],
  report: ['database', 'filesystem'],
  github_action: ['github_api'],
}

const TASK_LOG_TEMPLATES: Record<TaskType, string[][]> = {
  scrape: [
    ['Initializing browser instance...', 'Navigating to target URL...', 'Extracting business listings...', 'Parsing contact data...', 'Storing results to database...'],
    ['Starting HTTP crawler...', 'Fetching directory pages...', 'Deduplicating entries...', 'Enriching with metadata...', 'Saved 47 records'],
  ],
  generate_email: [
    ['Loading lead profile...', 'Generating personalized subject line...', 'Composing email body...', 'Applying tone adjustments...', 'Email template ready'],
  ],
  analyze_leads: [
    ['Loading lead records...', 'Computing opportunity scores...', 'Applying revenue weighting...', 'Ranking by priority...', 'Analysis complete: 12 A+ leads identified'],
  ],
  deploy: [
    ['Building production bundle...', 'Running pre-deploy checks...', 'Uploading artifacts...', 'Configuring CDN routes...', 'Deployment successful ✓'],
  ],
  build_ui: [
    ['Scaffolding component structure...', 'Generating TypeScript interfaces...', 'Writing styled components...', 'Running type checker...', 'Build complete'],
  ],
  search: [
    ['Querying search index...', 'Filtering results by relevance...', 'Fetching page content...', 'Extracting structured data...', 'Found 23 results'],
  ],
  report: [
    ['Aggregating data sources...', 'Computing summary statistics...', 'Formatting report output...', 'Writing to filesystem...', 'Report generated'],
  ],
  github_action: [
    ['Authenticating with GitHub API...', 'Triggering workflow dispatch...', 'Monitoring run status...', 'Workflow completed successfully'],
  ],
}

const TASK_DURATIONS: Record<TaskType, [number, number]> = {
  scrape: [3000, 6000],
  generate_email: [1500, 3000],
  analyze_leads: [2000, 4000],
  deploy: [4000, 7000],
  build_ui: [3000, 5000],
  search: [1500, 3000],
  report: [1000, 2000],
  github_action: [2500, 5000],
}

interface LLMTaskItem {
  type: TaskType
  description: string
}

function buildTasksFromLLMResponse(raw: string): AgentTask[] {
  try {
    const jsonMatch = raw.match(/\[[\s\S]*\]/)
    const parsed: LLMTaskItem[] = JSON.parse(jsonMatch ? jsonMatch[0] : raw)
    return parsed
      .filter((item) => item.type && item.description)
      .map((item) => ({
        id: uuid(),
        type: item.type,
        description: item.description,
        status: 'pending' as const,
      }))
  } catch {
    return [
      { id: uuid(), type: 'search', description: 'Search for relevant data', status: 'pending' as const },
      { id: uuid(), type: 'analyze_leads', description: 'Process and analyze results', status: 'pending' as const },
      { id: uuid(), type: 'report', description: 'Summarize findings', status: 'pending' as const },
    ]
  }
}

function buildPlanningPrompt(userCommand: string): string {
  return `You are an AI agent planner for XPS Intelligence, a B2B lead generation platform.

User command: "${userCommand}"

Break this command into 2-4 sequential tasks. Respond with a JSON array only, no explanation.
Each task: {"type": "<task_type>", "description": "<short description>"}

Valid task types: scrape, generate_email, analyze_leads, deploy, build_ui, search, report, github_action

Example response:
[
  {"type": "scrape", "description": "Scrape epoxy companies in Orlando from Google Maps"},
  {"type": "analyze_leads", "description": "Score and rank scraped leads by opportunity"},
  {"type": "report", "description": "Generate outreach summary report"}
]`
}

async function simulateToolCall(taskType: TaskType): Promise<ToolCall> {
  const toolIds = TASK_TOOL_MAP[taskType]
  const toolId = toolIds[0]
  const logTemplates = TASK_LOG_TEMPLATES[taskType]
  const logs = logTemplates[Math.floor(Math.random() * logTemplates.length)]
  const [minMs, maxMs] = TASK_DURATIONS[taskType]
  const totalMs = minMs + Math.random() * (maxMs - minMs)
  const stepMs = totalMs / logs.length

  const toolCall: ToolCall = {
    id: uuid(),
    toolId,
    toolName: toolId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    input: { taskType },
    startedAt: now(),
    status: 'running',
    logMessages: [],
  }

  for (const log of logs) {
    await delay(stepMs)
    toolCall.logMessages.push(log)
  }

  toolCall.completedAt = now()
  toolCall.status = 'completed'
  toolCall.output = { success: true, recordsProcessed: Math.floor(Math.random() * 80) + 10 }
  return toolCall
}

async function executeTask(
  task: AgentTask,
  onUpdate: (task: AgentTask) => void
): Promise<AgentTask> {
  const running: AgentTask = { ...task, status: 'running', startedAt: now(), toolCalls: [] }
  onUpdate(running)

  try {
    const toolCall = await simulateToolCall(task.type)
    const completed: AgentTask = {
      ...running,
      status: 'completed',
      completedAt: now(),
      toolCalls: [toolCall],
      result: toolCall.logMessages[toolCall.logMessages.length - 1] ?? 'Task completed',
    }
    onUpdate(completed)
    return completed
  } catch (err) {
    const failed: AgentTask = {
      ...running,
      status: 'failed',
      completedAt: now(),
      error: err instanceof Error ? err.message : 'Unknown error',
    }
    onUpdate(failed)
    return failed
  }
}

class AgentPlanner {
  private history: AgentPlan[] = []

  async createPlan(userCommand: string): Promise<AgentPlan> {
    const prompt = buildPlanningPrompt(userCommand)
    const raw = await llmRouter.complete(prompt, {}, userCommand)
    const tasks = buildTasksFromLLMResponse(raw)

    const plan: AgentPlan = {
      id: uuid(),
      userCommand,
      tasks,
      createdAt: now(),
      status: 'pending',
    }

    return plan
  }

  async executePlan(
    plan: AgentPlan,
    onUpdate: (plan: AgentPlan) => void
  ): Promise<AgentPlan> {
    let current: AgentPlan = { ...plan, status: 'running' }
    onUpdate(current)

    for (let i = 0; i < current.tasks.length; i++) {
      const updatedTask = await executeTask(current.tasks[i], (task) => {
        current = {
          ...current,
          tasks: current.tasks.map((t) => (t.id === task.id ? task : t)),
        }
        onUpdate(current)
      })

      current = {
        ...current,
        tasks: current.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
      }

      if (updatedTask.status === 'failed') {
        current = { ...current, status: 'partial' }
        onUpdate(current)
        break
      }
    }

    const allCompleted = current.tasks.every((t) => t.status === 'completed')
    const finalStatus = allCompleted ? 'completed' : current.status === 'partial' ? 'partial' : 'failed'
    const final: AgentPlan = { ...current, status: finalStatus }
    onUpdate(final)

    this.history = [final, ...this.history].slice(0, 20)
    return final
  }

  getHistory(): AgentPlan[] {
    return [...this.history]
  }

  clearHistory(): void {
    this.history = []
  }
}

export const agentPlanner = new AgentPlanner()
