/**
 * pages/api/trigger-workflow.js — Proxy: POST /api/trigger-workflow → Railway
 *
 * Triggers a GitHub Actions workflow via the backend. The backend has access
 * to GITHUB_TOKEN with workflow write permissions.
 *
 * Body: { workflow: string, inputs?: object, branch?: string }
 */
import { proxyToRailway } from './_proxyHelper.js'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Missing or invalid request body' })
  }
  if (!req.body.workflow) {
    return res.status(400).json({ error: 'workflow is required' })
  }
  return proxyToRailway(req, res, '/api/trigger-workflow')
}
