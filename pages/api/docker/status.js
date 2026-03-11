/**
 * pages/api/docker/status.js — Proxy: GET /api/docker/status → Railway
 */
import { proxyToRailway } from '../_proxyHelper.js'

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  return proxyToRailway(req, res, '/api/docker/status')
}
