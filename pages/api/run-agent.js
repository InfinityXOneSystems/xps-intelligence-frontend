/**
 * pages/api/run-agent.js — Proxy: POST /api/run-agent → Railway
 *
 * Dispatches a single named agent with a command on the backend.
 * The frontend never runs agents locally — this endpoint is the sole entry point.
 *
 * Body: { agentRole: string, command: string, context?: object }
 */
import { proxyToRailway } from './_proxyHelper.js'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Missing or invalid request body' })
  }
  const { agentRole, command } = req.body
  if (!agentRole || !command) {
    return res.status(400).json({ error: 'agentRole and command are required' })
  }
  return proxyToRailway(req, res, '/api/run-agent')
}
