/**
 * pages/api/agents.js — Proxy: GET /api/agents → Railway
 */
import { proxyToRailway } from './_proxyHelper.js'

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  return proxyToRailway(req, res, '/api/agents')
}
