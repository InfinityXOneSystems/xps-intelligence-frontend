/**
 * Orchestrator — Parallel multi-agent execution engine
 *
 * Implements the orchestration architecture defined in AGENTS.md:
 *   goal decomposition → agent routing → parallel execution → retry → error recovery
 */

import type {
  AgentPlan,
  AgentTask,
  AgentRole,
  OrchestratorConfig,
  TaskStatus,
} from './agentTypes'
import { TASK_AGENT_MAP } from './agentTypes'

function uuid(): string {
  return crypto.randomUUID()
}

function now(): string {
  return new Date().toISOString()
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Per-agent status visible on the Pipeline page
export interface AgentSlot {
  role: AgentRole
  status: 'idle' | 'running' | 'completed' | 'failed'
  currentTaskId: string | null
  tasksCompleted: number
  tasksFailed: number
  lastActive: string | null
}

export interface OrchestratorState {
  activePlanId: string | null
  agents: AgentSlot[]
  queue: AgentTask[]
  running: AgentTask[]
  completed: AgentTask[]
  failed: AgentTask[]
}

export type OrchestratorListener = (state: OrchestratorState) => void

const ALL_AGENT_ROLES: AgentRole[] = [
  'PlannerAgent',
  'ResearchAgent',
  'BuilderAgent',
  'ScraperAgent',
  'MediaAgent',
  'ValidatorAgent',
  'DevOpsAgent',
  'MonitoringAgent',
  'KnowledgeAgent',
  'BusinessAgent',
  'PredictionAgent',
  'SimulationAgent',
]

const SIMULATED_FAILURE_RATE = 0.05 // 5% chance of task failure in simulation
const MAX_HISTORY_SIZE = 20

const DEFAULT_CONFIG: OrchestratorConfig = {
  concurrencyLimit: 4,
  maxRetries: 2,
  retryDelayMs: 500,
}

// Simulated per-agent execution logs (one entry per agent role)
const AGENT_EXEC_LOGS: Record<AgentRole, string[]> = {
  PlannerAgent: [
    'Decomposing goal into subtasks...',
    'Building dependency graph...',
    'Routing tasks to agents...',
    'Plan ready for execution',
  ],
  ResearchAgent: [
    'Querying search index...',
    'Fetching page content...',
    'Extracting relevant data...',
    'Synthesizing results...',
  ],
  BuilderAgent: [
    'Scaffolding component structure...',
    'Generating TypeScript interfaces...',
    'Writing styled components...',
    'Running type checker...',
  ],
  ScraperAgent: [
    'Initializing Playwright browser...',
    'Navigating to target URL...',
    'Extracting business listings...',
    'Parsing contact data...',
    'Deduplicating records...',
  ],
  MediaAgent: [
    'Loading generation model...',
    'Applying prompt parameters...',
    'Rendering output...',
    'Post-processing artifact...',
  ],
  ValidatorAgent: [
    'Running ESLint...',
    'Executing TypeScript compiler...',
    'Running security scan...',
    'All checks passed',
  ],
  DevOpsAgent: [
    'Building production bundle...',
    'Running pre-deploy checks...',
    'Uploading artifacts...',
    'Deployment successful ✓',
  ],
  MonitoringAgent: [
    'Collecting system metrics...',
    'Checking error rates...',
    'Aggregating log streams...',
    'Health check passed',
  ],
  KnowledgeAgent: [
    'Encoding content to vector...',
    'Writing to memory store...',
    'Indexing knowledge entry...',
    'Memory persisted',
  ],
  BusinessAgent: [
    'Loading lead profiles...',
    'Scoring opportunities...',
    'Generating outreach content...',
    'Pipeline updated',
  ],
  PredictionAgent: [
    'Loading training data...',
    'Computing feature vectors...',
    'Running inference...',
    'Prediction complete',
  ],
  SimulationAgent: [
    'Initializing simulation context...',
    'Running scenario iterations...',
    'Collecting outcomes...',
    'Simulation complete',
  ],
}

// Task execution durations in ms [min, max]
const TASK_DURATIONS: Record<string, [number, number]> = {
  scrape: [3000, 6000],
  generate_email: [1500, 3000],
  analyze_leads: [2000, 4000],
  deploy: [4000, 7000],
  build_ui: [3000, 5000],
  search: [1500, 3000],
  report: [1000, 2000],
  github_action: [2500, 5000],
}

class Orchestrator {
  private config: OrchestratorConfig = { ...DEFAULT_CONFIG }
  private state: OrchestratorState
  private listeners: Set<OrchestratorListener> = new Set()
  private history: AgentPlan[] = []

  constructor() {
    this.state = {
      activePlanId: null,
      agents: ALL_AGENT_ROLES.map((role) => ({
        role,
        status: 'idle',
        currentTaskId: null,
        tasksCompleted: 0,
        tasksFailed: 0,
        lastActive: null,
      })),
      queue: [],
      running: [],
      completed: [],
      failed: [],
    }
  }

  setConfig(config: Partial<OrchestratorConfig>) {
    this.config = { ...this.config, ...config }
  }

  getConfig(): OrchestratorConfig {
    return { ...this.config }
  }

  getState(): OrchestratorState {
    return { ...this.state, agents: [...this.state.agents] }
  }

  getHistory(): AgentPlan[] {
    return [...this.history]
  }

  subscribe(listener: OrchestratorListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    const snapshot = this.getState()
    this.listeners.forEach((l) => l(snapshot))
  }

  private updateAgent(role: AgentRole, patch: Partial<AgentSlot>) {
    this.state = {
      ...this.state,
      agents: this.state.agents.map((a) =>
        a.role === role ? { ...a, ...patch } : a
      ),
    }
  }

  private addToRunning(task: AgentTask) {
    this.state = {
      ...this.state,
      running: [...this.state.running, task],
    }
  }

  private removeFromRunning(taskId: string) {
    this.state = {
      ...this.state,
      running: this.state.running.filter((t) => t.id !== taskId),
    }
  }

  /**
   * Simulate executing a single task with the assigned agent.
   * Returns the completed task (possibly with failed status on exhausted retries).
   */
  private async executeTask(
    task: AgentTask,
    onUpdate: (t: AgentTask) => void,
    abortSignal: { aborted: boolean }
  ): Promise<AgentTask> {
    const agent = task.assignedAgent ?? TASK_AGENT_MAP[task.type]
    const logs = AGENT_EXEC_LOGS[agent] ?? ['Processing...', 'Done']
    const [minDur, maxDur] = TASK_DURATIONS[task.type] ?? [1000, 3000]
    const totalDur = minDur + Math.random() * (maxDur - minDur)
    const intervalMs = totalDur / logs.length

    let current: AgentTask = {
      ...task,
      status: 'running',
      assignedAgent: agent,
      startedAt: now(),
      toolCalls: [
        {
          id: uuid(),
          toolId: agent,
          toolName: agent,
          input: { description: task.description },
          startedAt: now(),
          status: 'running',
          logMessages: [],
        },
      ],
    }
    onUpdate(current)

    for (let i = 0; i < logs.length; i++) {
      if (abortSignal.aborted) break
      await delay(intervalMs)
      const logMessages = logs.slice(0, i + 1)
      current = {
        ...current,
        toolCalls: current.toolCalls?.map((tc, idx) =>
          idx === 0 ? { ...tc, logMessages } : tc
        ),
      }
      onUpdate(current)
    }

    if (abortSignal.aborted) {
      return { ...current, status: 'failed', error: 'Aborted' }
    }

    const success = Math.random() > SIMULATED_FAILURE_RATE
    const finalStatus: TaskStatus = success ? 'completed' : 'failed'
    const finalTask: AgentTask = {
      ...current,
      status: finalStatus,
      completedAt: now(),
      result: success ? `${agent} completed successfully` : undefined,
      error: success ? undefined : `${agent} encountered an error`,
      toolCalls: current.toolCalls?.map((tc, idx) =>
        idx === 0
          ? {
              ...tc,
              status: finalStatus,
              completedAt: now(),
            }
          : tc
      ),
    }
    onUpdate(finalTask)
    return finalTask
  }

  /**
   * Execute a plan's tasks in parallel (up to concurrencyLimit), with retry logic.
   */
  async executePlan(
    plan: AgentPlan,
    onUpdate: (plan: AgentPlan) => void,
    abortSignal: { aborted: boolean }
  ): Promise<AgentPlan> {
    // Assign agents to tasks
    const assignedTasks: AgentTask[] = plan.tasks.map((t) => ({
      ...t,
      assignedAgent: t.assignedAgent ?? TASK_AGENT_MAP[t.type],
      retryCount: 0,
    }))

    let currentPlan: AgentPlan = {
      ...plan,
      tasks: assignedTasks,
      status: 'running',
    }

    // Reset orchestrator running state for this plan
    this.state = {
      ...this.state,
      activePlanId: plan.id,
      queue: [...assignedTasks],
      running: [],
      completed: [],
      failed: [],
    }
    this.notify()

    const updateTask = (updatedTask: AgentTask) => {
      currentPlan = {
        ...currentPlan,
        tasks: currentPlan.tasks.map((t) =>
          t.id === updatedTask.id ? updatedTask : t
        ),
      }
      onUpdate(currentPlan)
    }

    // Run tasks in waves respecting concurrency limit
    const pending = [...assignedTasks]

    while (pending.length > 0 && !abortSignal.aborted) {
      const batch = pending.splice(0, this.config.concurrencyLimit)

      // Move batch from queue to running
      this.state = {
        ...this.state,
        queue: pending,
        running: [...this.state.running, ...batch],
      }
      this.notify()

      // Mark agents as running
      batch.forEach((t) => {
        const role = t.assignedAgent ?? TASK_AGENT_MAP[t.type]
        this.updateAgent(role, {
          status: 'running',
          currentTaskId: t.id,
          lastActive: now(),
        })
        this.notify()
      })

      // Execute batch in parallel
      const results = await Promise.all(
        batch.map((task) =>
          this.executeWithRetry(task, updateTask, abortSignal)
        )
      )

      // Update state with results
      results.forEach((result) => {
        const role = result.assignedAgent ?? TASK_AGENT_MAP[result.type]
        this.removeFromRunning(result.id)

        if (result.status === 'completed') {
          this.state = {
            ...this.state,
            completed: [...this.state.completed, result],
          }
          this.updateAgent(role, {
            status: 'completed',
            currentTaskId: null,
            tasksCompleted: (this.state.agents.find((a) => a.role === role)?.tasksCompleted ?? 0) + 1,
          })
        } else {
          this.state = {
            ...this.state,
            failed: [...this.state.failed, result],
          }
          this.updateAgent(role, {
            status: 'failed',
            currentTaskId: null,
            tasksFailed: (this.state.agents.find((a) => a.role === role)?.tasksFailed ?? 0) + 1,
          })
        }
        this.notify()
      })
    }

    const allTasks = currentPlan.tasks
    const anyFailed = allTasks.some((t) => t.status === 'failed')
    const allCompleted = allTasks.every(
      (t) => t.status === 'completed' || t.status === 'failed'
    )

    const finalStatus = abortSignal.aborted
      ? 'failed'
      : anyFailed
      ? 'partial'
      : allCompleted
      ? 'completed'
      : 'partial'

    const finalPlan: AgentPlan = { ...currentPlan, status: finalStatus }
    onUpdate(finalPlan)

    this.state = { ...this.state, activePlanId: null }
    this.notify()

    this.history = [finalPlan, ...this.history].slice(0, MAX_HISTORY_SIZE)
    return finalPlan
  }

  private async executeWithRetry(
    task: AgentTask,
    onUpdate: (t: AgentTask) => void,
    abortSignal: { aborted: boolean }
  ): Promise<AgentTask> {
    let attempt = task
    for (let i = 0; i <= this.config.maxRetries; i++) {
      const result = await this.executeTask(attempt, onUpdate, abortSignal)
      if (result.status === 'completed' || abortSignal.aborted) return result
      if (i < this.config.maxRetries) {
        await delay(this.config.retryDelayMs)
        attempt = { ...result, status: 'pending', retryCount: i + 1 }
        onUpdate(attempt)
      } else {
        return result
      }
    }
    return attempt
  }
}

export const orchestrator = new Orchestrator()
