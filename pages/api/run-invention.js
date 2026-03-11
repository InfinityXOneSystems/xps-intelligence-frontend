/**
 * pages/api/run-invention.js — Proxy: POST /api/run-invention → Railway
 *
 * Invokes the Invention Factory on the backend.
 * Body: { prompt: string, domain?: string, context?: object }
 */
import { proxyToRailway } from './_proxyHelper.js'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Missing or invalid request body' })
  }
  if (!req.body.prompt) {
    return res.status(400).json({ error: 'prompt is required' })
  }
  return proxyToRailway(req, res, '/api/run-invention')
}
