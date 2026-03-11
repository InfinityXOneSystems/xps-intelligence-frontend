/**
 * controlPlane.ts — XPS Control Plane client.
 *
 * This module exposes typed calls to every endpoint in the XPS Control Plane
 * running on Railway (XPS_INTELLIGENCE_SYSTEM). The frontend NEVER runs agents,
 * scrapers, or pipelines locally — it only sends commands to this API.
 *
 * All requests are routed through Vercel serverless proxy functions in
 * pages/api/ to avoid CORS issues and keep BACKEND_URL server-side-only.
 *
 * Architecture:
 *   Browser → Vercel Edge (pages/api/*) → Railway Control Plane
 *
 * Endpoints exposed by Railway:
 *   GET  /api/system/status
 *   GET  /api/agents
 *   POST /api/run-agent
 *   POST /api/run-scraper
 *   POST /api/run-vision-scan
 *   POST /api/run-invention
 *   POST /api/trigger-workflow
 *   GET  /api/docker/status
 *   GET  /api/logs
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SystemStatus {
  status: 'healthy' | 'degraded' | 'down'
  uptime: number
  version: string
  services: {
    name: string
    status: 'up' | 'down' | 'degraded'
    latencyMs?: number
  }[]
  timestamp: string
}

export interface AgentInfo {
  id: string
  role: string
  status: 'idle' | 'running' | 'error'
  lastActivity?: string
  tasksCompleted: number
  successRate: number
}

export interface RunAgentParams {
  agentRole: string
  command: string
  context?: Record<string, unknown>
}

export interface RunScraperParams {
  city: string
  category: string
  maxResults: number
  sources: {
    googleMaps: boolean
    yelp: boolean
    directories: boolean
  }
}

export interface RunVisionScanParams {
  targetUrl: string
  scanType?: 'full' | 'quick'
  context?: Record<string, unknown>
}

export interface RunInventionParams {
  prompt: string
  domain?: string
  context?: Record<string, unknown>
}

export interface TriggerWorkflowParams {
  workflow: string
  inputs?: Record<string, unknown>
  branch?: string
}

export interface JobResult {
  jobId: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  message?: string
  output?: unknown
  startedAt?: string
  completedAt?: string
  error?: string
}

export interface DockerContainer {
  id: string
  name: string
  image: string
  status: string
  ports: string
  created: string
}

export interface DockerStatus {
  containers: DockerContainer[]
  stackHealth: 'healthy' | 'degraded' | 'down'
}

export interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  service: string
  message: string
}

// ── Proxy base URL ────────────────────────────────────────────────────────────
// All requests go to Vercel Edge proxy functions (/api/*) which forward to Railway.
// This keeps BACKEND_URL secret-only and avoids cross-origin issues.

const PROXY_BASE = '/api'

async function cpFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const method = options.method ?? 'GET'
  const res = await fetch(`${PROXY_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    // Include method + path in the error so callers can identify which
    // endpoint failed and log the request body for debugging.
    const payload = options.body ? ` | payload: ${String(options.body).slice(0, 200)}` : ''
    throw new Error(`Control Plane ${method} ${path} → ${res.status}: ${text}${payload}`)
  }
  return res.json() as Promise<T>
}

// ── Control Plane API ─────────────────────────────────────────────────────────

export const controlPlaneApi = {
  /**
   * GET /api/system/status
   * Returns overall health of the XPS backend system.
   */
  getSystemStatus(): Promise<SystemStatus> {
    return cpFetch<SystemStatus>('/system/status')
  },

  /**
   * GET /api/agents
   * Returns the list of available agents and their current state.
   */
  getAgents(): Promise<AgentInfo[]> {
    return cpFetch<AgentInfo[]>('/agents')
  },

  /**
   * POST /api/run-agent
   * Dispatches a single agent with a command.
   */
  runAgent(params: RunAgentParams): Promise<JobResult> {
    return cpFetch<JobResult>('/run-agent', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  /**
   * POST /api/run-scraper
   * Kicks off a lead-scraping job. Results land in the LEADS repo and Supabase.
   * The frontend must NEVER store scraper output locally.
   */
  runScraper(params: RunScraperParams): Promise<JobResult> {
    return cpFetch<JobResult>('/run-scraper', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  /**
   * POST /api/run-vision-scan
   * Runs the Vision Cortex scan on a target URL.
   */
  runVisionScan(params: RunVisionScanParams): Promise<JobResult> {
    return cpFetch<JobResult>('/run-vision-scan', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  /**
   * POST /api/run-invention
   * Invokes the Invention Factory to generate a new capability or solution.
   */
  runInvention(params: RunInventionParams): Promise<JobResult> {
    return cpFetch<JobResult>('/run-invention', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  /**
   * POST /api/trigger-workflow
   * Triggers a GitHub Actions workflow in any repository via the backend.
   */
  triggerWorkflow(params: TriggerWorkflowParams): Promise<JobResult> {
    return cpFetch<JobResult>('/trigger-workflow', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  /**
   * GET /api/docker/status
   * Returns the current state of all Docker containers in the backend stack.
   */
  getDockerStatus(): Promise<DockerStatus> {
    return cpFetch<DockerStatus>('/docker/status')
  },

  /**
   * GET /api/logs
   * Returns recent log entries from backend services.
   */
  getLogs(limit = 100, service?: string): Promise<LogEntry[]> {
    const qs = new URLSearchParams({ limit: String(limit) })
    if (service) qs.set('service', service)
    return cpFetch<LogEntry[]>(`/logs?${qs}`)
  },
}
