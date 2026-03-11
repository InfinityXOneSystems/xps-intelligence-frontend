/**
 * POST /api/scraper-trigger
 * Triggers the GitHub Actions agent-scraper workflow and returns the run URL.
 * Body: { city: string, category: string, max_results?: number, job_id?: string }
 */
import { z } from 'zod'

const BodySchema = z.object({
  city: z.string().min(1).max(100),
  category: z.string().min(1).max(100).default('epoxy contractors'),
  max_results: z.number().int().min(1).max(500).default(50),
  job_id: z.string().max(64).optional(),
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const parse = BodySchema.safeParse(req.body)
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid request body', details: parse.error.flatten() })
  }

  const { city, category, max_results, job_id } = parse.data

  const ghToken = process.env.GITHUB_TOKEN || process.env.GH_PAT
  if (!ghToken) {
    // Fall through to backend if no GitHub token
    const backendUrl = process.env.BACKEND_URL || 'https://xpsintelligencesystem-production.up.railway.app'
    try {
      const r = await fetch(`${backendUrl}/api/scraper/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, category, max_results, job_id }),
      })
      const data = await r.json()
      return res.status(r.status).json(data)
    } catch (err) {
      return res.status(503).json({ error: 'Scraper trigger unavailable', details: err.message })
    }
  }

  try {
    const owner = process.env.GITHUB_REPO_OWNER || 'InfinityXOneSystems'
    const repo = process.env.GITHUB_REPO_NAME || 'XPS-INTELLIGENCE-FRONTEND'

    const r = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/agent-scraper.yml/dispatches`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${ghToken}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: 'main',
          inputs: {
            city,
            category,
            max_results: String(max_results),
            job_id: job_id ?? `api-${Date.now()}`,
          },
        }),
      }
    )

    if (!r.ok) {
      const txt = await r.text()
      return res.status(r.status).json({ error: 'GitHub workflow dispatch failed', details: txt })
    }

    return res.status(202).json({
      status: 'dispatched',
      city,
      category,
      max_results,
      workflow: `https://github.com/${owner}/${repo}/actions/workflows/agent-scraper.yml`,
    })
  } catch (err) {
    console.error('Scraper trigger error:', err)
    return res.status(500).json({ error: 'Failed to dispatch workflow', details: err.message })
  }
}
