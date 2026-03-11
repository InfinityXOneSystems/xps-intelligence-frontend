/**
 * pages/api/system/status.js — Proxy: GET /api/system/status → Railway
 *
 * Configure in Railway webhooks to point at this app's Vercel domain:
 *   https://<vercel-domain>/api/system/status
 */
import { proxyToRailway } from '../_proxyHelper.js'

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  return proxyToRailway(req, res, '/api/system/status')
}
