/**
 * supabase.ts — Database type definitions for Supabase tables.
 *
 * These types mirror the actual Supabase table schemas.
 * Columns follow PostgreSQL snake_case convention; the API layer
 * converts them to/from the camelCase interfaces used by the UI.
 *
 * Tables:
 *   leads           — contractor/business leads (primary CRM data)
 *   contractors     — enriched contractor records from scrapers
 *   scraper_logs    — scraper run history and status
 *   webhook_events  — Railway/external webhook event log
 */

// ── leads ─────────────────────────────────────────────────────────────────────

export interface LeadRow {
  id: string
  company: string
  city: string
  state: string | null
  phone: string
  email: string
  website: string | null
  rating: string                  // 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D'
  opportunity_score: number
  assigned_rep: string | null
  assigned_initials: string | null
  status: string                  // 'new' | 'contacted' | 'qualified' | 'proposal' | 'signed' | 'lost'
  priority: string | null         // 'green' | 'yellow' | 'red'
  is_new: boolean | null
  notes: string | null
  created_at: string
  updated_at: string | null
  last_touched_at: string | null
  last_touched_by: string | null
  category: string | null
  address: string | null
  revenue: number | null
  lat: number | null
  lng: number | null
}

// ── contractors ───────────────────────────────────────────────────────────────

export interface ContractorRow {
  id: string
  name: string
  company: string
  email: string
  phone: string
  website: string | null
  city: string
  state: string
  category: string
  status: string                  // 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  score: number
  source: string
  notes: string | null
  created_at: string
  updated_at: string
}

// ── scraper_logs ──────────────────────────────────────────────────────────────

export interface ScraperLogRow {
  id: string
  timestamp: string
  status: string                  // 'running' | 'completed' | 'failed'
  message: string
  config: Record<string, unknown> | null
  created_at: string
}

// ── webhook_events ────────────────────────────────────────────────────────────

export interface WebhookEventRow {
  id: string
  source: string                  // 'railway' | 'github' | 'vercel'
  event_type: string
  payload: Record<string, unknown>
  received_at: string
}
