/**
 * POST /api/orchestrator
 * Full autonomous orchestration endpoint.
 * Accepts a user command, routes it through the LLM, and returns an agent plan.
 * Body: { command: string, agentRole?: string, sessionId?: string, strategy?: string }
 */
import { Groq } from 'groq-sdk'
import { z } from 'zod'

const BodySchema = z.object({
  command: z.string().min(1).max(4000),
  agentRole: z.string().optional(),
  sessionId: z.string().max(64).optional(),
  strategy: z.enum(['auto', 'cloud', 'local', 'groq']).default('auto'),
})

const TASK_TYPES = ['scrape', 'generate_email', 'analyze_leads', 'deploy', 'build_ui', 'search', 'report', 'github_action', 'plan', 'research', 'validate', 'monitor', 'media', 'knowledge', 'predict', 'simulate']
const AGENT_ROLES = ['PlannerAgent', 'ResearchAgent', 'BuilderAgent', 'ScraperAgent', 'MediaAgent', 'ValidatorAgent', 'DevOpsAgent', 'MonitoringAgent', 'KnowledgeAgent', 'BusinessAgent', 'PredictionAgent', 'SimulationAgent', 'MetaAgent']

function buildSystemPrompt() {
  return `You are the XPS Intelligence Orchestrator — a sophisticated AI operating system controller.
Your job is to decompose user commands into executable task plans for 13 specialized agents.

Available task types: ${TASK_TYPES.join(', ')}
Available agents: ${AGENT_ROLES.join(', ')}

Always respond with a valid JSON array of tasks. Each task must have:
- type: one of the task types above
- description: clear, specific description of what the agent should do
- agent: (optional) preferred agent role

Rules:
1. Generate 2-6 tasks per plan (no more)
2. Order tasks logically (dependencies first)
3. Be specific about what each task should accomplish
4. For scraping tasks, include target location and category
5. For deploy tasks, include environment details

Respond ONLY with a JSON array — no markdown, no explanation.`
}

function fallbackPlan(command) {
  const lower = command.toLowerCase()
  if (lower.includes('scrape') || lower.includes('lead') || lower.includes('contractor')) {
    return [
      { type: 'scrape', description: `Scrape business leads matching: ${command}`, agent: 'ScraperAgent' },
      { type: 'analyze_leads', description: 'Score and rank scraped leads by conversion potential', agent: 'PredictionAgent' },
      { type: 'report', description: 'Generate leads report with top opportunities', agent: 'BusinessAgent' },
    ]
  }
  if (lower.includes('deploy') || lower.includes('build')) {
    return [
      { type: 'validate', description: 'Run full validation suite (lint, types, tests)', agent: 'ValidatorAgent' },
      { type: 'build_ui', description: 'Build production bundle', agent: 'BuilderAgent' },
      { type: 'deploy', description: 'Deploy to Vercel production', agent: 'DevOpsAgent' },
    ]
  }
  if (lower.includes('email') || lower.includes('outreach')) {
    return [
      { type: 'analyze_leads', description: 'Select top leads for outreach campaign', agent: 'PredictionAgent' },
      { type: 'generate_email', description: 'Generate personalized email sequences', agent: 'BusinessAgent' },
      { type: 'report', description: 'Log campaign and track open/click metrics', agent: 'MonitoringAgent' },
    ]
  }
  return [
    { type: 'search', description: `Research: ${command}`, agent: 'ResearchAgent' },
    { type: 'analyze_leads', description: 'Analyze and process research results', agent: 'PredictionAgent' },
    { type: 'report', description: 'Synthesize findings into actionable report', agent: 'PlannerAgent' },
  ]
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const parse = BodySchema.safeParse(req.body)
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid request body', details: parse.error.flatten() })
  }

  const { command, agentRole, sessionId, strategy } = parse.data
  const planId = `plan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  // Try Groq first for plan generation
  if (process.env.AI_GROQ_API_KEY && (strategy === 'auto' || strategy === 'cloud' || strategy === 'groq')) {
    try {
      const groq = new Groq({ apiKey: process.env.AI_GROQ_API_KEY })
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: `User command: "${command}"${agentRole ? `\nPreferred agent: ${agentRole}` : ''}` },
        ],
        max_tokens: 1024,
        temperature: 0.3,
        response_format: { type: 'json_object' },
      })

      let tasks = []
      const content = completion.choices[0]?.message?.content || '{}'
      try {
        const parsed = JSON.parse(content)
        tasks = Array.isArray(parsed) ? parsed : (parsed.tasks ?? parsed.plan ?? [])
      } catch {
        tasks = fallbackPlan(command)
      }

      if (!Array.isArray(tasks) || tasks.length === 0) {
        tasks = fallbackPlan(command)
      }

      // Normalize tasks
      tasks = tasks.slice(0, 6).map((t, i) => ({
        id: `${planId}_t${i}`,
        type: TASK_TYPES.includes(t.type) ? t.type : 'search',
        description: String(t.description || t.task || '').slice(0, 200),
        agent: AGENT_ROLES.includes(t.agent) ? t.agent : undefined,
        status: 'pending',
      }))

      return res.status(200).json({
        planId,
        sessionId: sessionId ?? planId,
        command,
        tasks,
        provider: 'groq',
        model: 'llama-3.3-70b-versatile',
      })
    } catch (err) {
      console.error('[orchestrator] Groq error:', err.message)
      // Fall through to fallback
    }
  }

  // Try Railway backend as fallback
  const backendUrl = process.env.BACKEND_URL || 'https://xpsintelligencesystem-production.up.railway.app'
  try {
    const r = await fetch(`${backendUrl}/api/orchestrator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command, agentRole, sessionId }),
      signal: AbortSignal.timeout(10000),
    })
    if (r.ok) {
      const data = await r.json()
      return res.status(200).json({ ...data, planId, provider: 'backend' })
    }
  } catch { /* fallback */ }

  // Rule-based fallback
  const tasks = fallbackPlan(command).slice(0, 6).map((t, i) => ({
    id: `${planId}_t${i}`,
    ...t,
    status: 'pending',
  }))

  return res.status(200).json({
    planId,
    sessionId: sessionId ?? planId,
    command,
    tasks,
    provider: 'fallback',
  })
}
