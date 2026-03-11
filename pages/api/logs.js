/**
 * pages/api/logs.js — Proxy: GET /api/logs → Railway
 *
 * Query params: limit (number), service (string)
 */
import { proxyToRailway } from './_proxyHelper.js'

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  // Pass through query string to backend
  const qs = new URLSearchParams(
    Object.entries(req.query || {}).map(([k, v]) => [k, String(v)])
  ).toString()
  const path = qs ? `/api/logs?${qs}` : '/api/logs'
  return proxyToRailway(req, res, path)
}
