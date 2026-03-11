/**
 * _proxyHelper.js — Shared Railway reverse-proxy helper for Control Plane endpoints.
 *
 * Usage:
 *   import { proxyToRailway } from './_proxyHelper.js'
 *   export default (req, res) => proxyToRailway(req, res, '/api/system/status')
 */

export const BACKEND_URL =
  process.env.BACKEND_URL || 'https://xpsintelligencesystem-production.up.railway.app'

/**
 * Forward the incoming Vercel request to the Railway Control Plane.
 * @param {import('@vercel/node').VercelRequest} req
 * @param {import('@vercel/node').VercelResponse} res
 * @param {string} backendPath  e.g. '/api/run-scraper'
 */
export async function proxyToRailway(req, res, backendPath) {
  const url = `${BACKEND_URL}${backendPath}`
  const isGetOrHead = req.method === 'GET' || req.method === 'HEAD'

  try {
    const upstream = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': req.headers['x-forwarded-for'] || '',
      },
      ...(isGetOrHead ? {} : { body: JSON.stringify(req.body) }),
    })

    const text = await upstream.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      // backend returned non-JSON (e.g. HTML error page) — surface it safely
      return res.status(upstream.status).json({
        error: `Backend returned non-JSON response`,
        status: upstream.status,
        preview: text.slice(0, 200),
      })
    }

    return res.status(upstream.status).json(data)
  } catch (err) {
    console.error(`[control-plane proxy] ${backendPath} error:`, err?.message || err)
    return res.status(502).json({
      error: 'Control Plane unreachable',
      path: backendPath,
      details: err?.message,
    })
  }
}
