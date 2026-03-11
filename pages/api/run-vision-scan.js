/**
 * pages/api/run-vision-scan.js — Proxy: POST /api/run-vision-scan → Railway
 *
 * Triggers the Vision Cortex scan on the backend.
 * Body: { targetUrl: string, scanType?: 'full' | 'quick', context?: object }
 */
import { proxyToRailway } from './_proxyHelper.js'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Missing or invalid request body' })
  }
  if (!req.body.targetUrl) {
    return res.status(400).json({ error: 'targetUrl is required' })
  }
  return proxyToRailway(req, res, '/api/run-vision-scan')
}
