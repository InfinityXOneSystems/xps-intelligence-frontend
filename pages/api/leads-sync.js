/**
 * POST /api/leads-sync
 * Syncs scraped leads to the InfinityXOneSystems/XPS-LEADS repository.
 * Called by CI workflows after scraping to persist leads as the source of truth.
 * Body: { leads: Lead[], source?: string, runId?: string }
 */
import { z } from 'zod'

const LeadSchema = z.object({
  company: z.string().min(1),
  phone: z.string().optional(),
  email: z.union([z.string().email(), z.literal(''), z.null()]).optional().transform(v => v || undefined),
  website: z.union([z.string().url(), z.literal(''), z.null()]).optional().transform(v => v || undefined),
  industry: z.string().optional(),
  location: z.string().optional(),
  lead_score: z.number().min(0).max(100).optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

const BodySchema = z.object({
  leads: z.array(LeadSchema).min(1).max(1000),
  source: z.string().max(128).optional(),
  runId: z.string().max(64).optional(),
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const parse = BodySchema.safeParse(req.body)
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid request body', details: parse.error.flatten() })
  }

  const { leads, source, runId } = parse.data
  const apiToken = req.headers['authorization']?.replace('Bearer ', '')
  const expectedToken = process.env.XPS_API_TOKEN

  if (expectedToken && apiToken !== expectedToken) {
    return res.status(401).json({ error: 'Unauthorized — invalid XPS_API_TOKEN' })
  }

  const ghToken = process.env.LEADS_REPO_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_PAT
  const leadsOwner = process.env.LEADS_REPO_OWNER || 'InfinityXOneSystems'
  const leadsRepo = process.env.LEADS_REPO_NAME || 'XPS-LEADS'

  // Also forward to Railway backend for DB persistence
  const backendUrl = process.env.BACKEND_URL || 'https://xpsintelligencesystem-production.up.railway.app'
  const backendPromise = fetch(`${backendUrl}/api/leads/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${expectedToken || ''}` },
    body: JSON.stringify({ leads, source, runId }),
  }).catch(err => ({ ok: false, status: 503, _err: err.message }))

  // Commit leads to GitHub leads repo as JSON
  if (ghToken) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `data/leads/${timestamp}-${source ?? 'scraper'}.json`
      const content = Buffer.from(JSON.stringify({ leads, source, runId, exportedAt: new Date().toISOString() }, null, 2)).toString('base64')

      // Get current SHA if file exists (for updates)
      let fileSha
      try {
        const existing = await fetch(
          `https://api.github.com/repos/${leadsOwner}/${leadsRepo}/contents/${fileName}`,
          { headers: { Authorization: `Bearer ${ghToken}`, Accept: 'application/vnd.github+json' } }
        )
        if (existing.ok) {
          const d = await existing.json()
          fileSha = d.sha
        }
      } catch { /* new file */ }

      const commitPayload = {
        message: `feat(leads): add ${leads.length} leads from ${source ?? 'scraper'} [run:${runId ?? 'api'}]`,
        content,
        ...(fileSha && { sha: fileSha }),
      }

      const commitRes = await fetch(
        `https://api.github.com/repos/${leadsOwner}/${leadsRepo}/contents/${fileName}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${ghToken}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commitPayload),
        }
      )

      const backendResult = await backendPromise
      const leadsRepoStatus = commitRes.ok ? 'committed' : `failed_${commitRes.status}`

      return res.status(201).json({
        status: 'synced',
        leadsCount: leads.length,
        leadsRepo: `${leadsOwner}/${leadsRepo}`,
        leadsRepoStatus,
        leadsFile: fileName,
        backendStatus: 'ok' in backendResult ? (backendResult.ok ? 'stored' : `failed_${backendResult.status}`) : 'error',
      })
    } catch (err) {
      console.error('[leads-sync] GitHub commit error:', err)
    }
  }

  // Fallback: just forward to backend
  const backendResult = await backendPromise
  return res.status(201).json({
    status: 'partial',
    leadsCount: leads.length,
    warning: 'Could not commit to leads repo — LEADS_REPO_TOKEN not configured',
    backendStatus: 'ok' in backendResult ? (backendResult.ok ? 'stored' : `failed_${backendResult.status}`) : 'error',
  })
}
