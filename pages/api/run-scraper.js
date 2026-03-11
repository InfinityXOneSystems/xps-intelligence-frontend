/**
 * pages/api/run-scraper.js — Proxy: POST /api/run-scraper → Railway
 *
 * Kicks off a backend scraping job. The backend will:
 *   1. Run the scraper with the given config
 *   2. Commit raw results to the LEADS repo (InfinityXOneSystems/LEADS)
 *   3. Index results in Supabase for frontend visualization
 *
 * Body: { city: string, category: string, maxResults: number, sources: object }
 */
import { proxyToRailway } from './_proxyHelper.js'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Missing or invalid request body' })
  }
  const { city, category } = req.body
  if (!city || !category) {
    return res.status(400).json({ error: 'city and category are required' })
  }
  return proxyToRailway(req, res, '/api/run-scraper')
}
