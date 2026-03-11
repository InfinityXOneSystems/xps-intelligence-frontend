/**
 * leadsApi.ts — Supabase-backed leads and scraper data layer.
 *
 * All lead CRUD and scraper log operations go directly to Supabase,
 * bypassing the Railway backend to prevent merge conflicts in the
 * backend repository.
 *
 * Supabase table: `leads`      (columns: snake_case)
 * Supabase table: `scraper_logs`
 */

import { supabase } from './supabase'
import { api } from './api'
import type { Lead, DashboardMetrics, ScraperConfig, ScraperLog } from '@/types/lead'
import type { LeadRow, ScraperLogRow } from '@/types/supabase'

// ── Row ↔ Model converters ────────────────────────────────────────────────────

function rowToLead(row: LeadRow): Lead {
  return {
    id: row.id,
    company: row.company,
    city: row.city,
    state: row.state ?? undefined,
    phone: row.phone,
    email: row.email,
    website: row.website ?? undefined,
    rating: row.rating as Lead['rating'],
    opportunityScore: row.opportunity_score,
    assignedRep: row.assigned_rep ?? undefined,
    assignedInitials: row.assigned_initials ?? undefined,
    status: row.status as Lead['status'],
    priority: (row.priority as Lead['priority']) ?? undefined,
    isNew: row.is_new ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
    lastTouchedAt: row.last_touched_at ?? undefined,
    lastTouchedBy: row.last_touched_by ?? undefined,
    category: row.category ?? undefined,
    address: row.address ?? undefined,
    revenue: row.revenue ?? undefined,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
  }
}

function leadToRow(lead: Partial<Lead>): Partial<LeadRow> {
  const row: Partial<LeadRow> = {}
  if (lead.company !== undefined) row.company = lead.company
  if (lead.city !== undefined) row.city = lead.city
  if ('state' in lead) row.state = lead.state ?? null
  if (lead.phone !== undefined) row.phone = lead.phone
  if (lead.email !== undefined) row.email = lead.email
  if ('website' in lead) row.website = lead.website ?? null
  if (lead.rating !== undefined) row.rating = lead.rating
  if (lead.opportunityScore !== undefined) row.opportunity_score = lead.opportunityScore
  if ('assignedRep' in lead) row.assigned_rep = lead.assignedRep ?? null
  if ('assignedInitials' in lead) row.assigned_initials = lead.assignedInitials ?? null
  if (lead.status !== undefined) row.status = lead.status
  if ('priority' in lead) row.priority = lead.priority ?? null
  if ('isNew' in lead) row.is_new = lead.isNew ?? null
  if ('notes' in lead) row.notes = lead.notes ?? null
  if ('updatedAt' in lead) row.updated_at = lead.updatedAt ?? null
  if ('lastTouchedAt' in lead) row.last_touched_at = lead.lastTouchedAt ?? null
  if ('lastTouchedBy' in lead) row.last_touched_by = lead.lastTouchedBy ?? null
  if ('category' in lead) row.category = lead.category ?? null
  if ('address' in lead) row.address = lead.address ?? null
  if ('revenue' in lead) row.revenue = lead.revenue ?? null
  if ('lat' in lead) row.lat = lead.lat ?? null
  if ('lng' in lead) row.lng = lead.lng ?? null
  return row
}

function rowToScraperLog(row: ScraperLogRow): ScraperLog {
  return {
    id: row.id,
    timestamp: row.timestamp,
    status: row.status as ScraperLog['status'],
    message: row.message,
    config: row.config as unknown as ScraperConfig | undefined,
  }
}

// ── Leads API ─────────────────────────────────────────────────────────────────

export const leadsApi = {
  async getAll(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as LeadRow[]).map(rowToLead)
  },

  async getById(id: string): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return rowToLead(data as LeadRow)
  },

  async create(lead: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> {
    const row = {
      ...leadToRow(lead),
      created_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from('leads')
      .insert(row)
      .select()
      .single()
    if (error) throw error
    return rowToLead(data as LeadRow)
  },

  async update(id: string, lead: Partial<Lead>): Promise<Lead> {
    const row = {
      ...leadToRow(lead),
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from('leads')
      .update(row)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return rowToLead(data as LeadRow)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('leads').delete().eq('id', id)
    if (error) throw error
  },

  async getMetrics(): Promise<DashboardMetrics> {
    const { data, error } = await supabase.from('leads').select('rating, revenue, status')
    if (error) throw error
    const rows = data as Pick<LeadRow, 'rating' | 'revenue' | 'status'>[]
    const totalLeads = rows.length
    const aPlusOpportunities = rows.filter(r => r.rating === 'A+').length
    const revenuePipeline = rows.reduce((sum, r) => sum + (r.revenue ?? 0), 0)
    return {
      totalLeads,
      aPlusOpportunities,
      emailsSent: 0,
      responseRate: 0,
      revenuePipeline,
    }
  },

  async assignRep(
    leadId: string,
    repId: string,
    repName: string,
    repInitials: string
  ): Promise<Lead> {
    void repId // repId is stored externally (auth system); we store display values
    return leadsApi.update(leadId, {
      assignedRep: repName,
      assignedInitials: repInitials,
      lastTouchedAt: new Date().toISOString(),
      lastTouchedBy: repName,
    })
  },

  async updateStatus(leadId: string, status: Lead['status']): Promise<Lead> {
    return leadsApi.update(leadId, {
      status,
      updatedAt: new Date().toISOString(),
    })
  },

  async addNote(leadId: string, note: string): Promise<Lead> {
    const existing = await leadsApi.getById(leadId)
    const combined = existing.notes ? `${existing.notes}\n${note}` : note
    return leadsApi.update(leadId, { notes: combined })
  },
}

// ── Scraper API ───────────────────────────────────────────────────────────────
// Scraper job execution is orchestrated by the Railway backend; only log reads
// are redirected to Supabase so results land in one place (not the backend repo).

export const scraperApi = {
  async run(config: ScraperConfig): Promise<{ jobId: string }> {
    return api.post<{ jobId: string }>('/scraper/run', config)
  },

  async getStatus(jobId: string): Promise<ScraperLog> {
    return api.get<ScraperLog>(`/scraper/status/${jobId}`)
  },

  /** Reads scraper logs from Supabase (Railway backend writes them there). */
  async getLogs(limit = 50): Promise<ScraperLog[]> {
    const { data, error } = await supabase
      .from('scraper_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) {
      // Graceful fallback: try legacy Railway endpoint if Supabase table isn't ready
      console.warn('[XPS] scraper_logs Supabase query failed, falling back to API:', error.message)
      return api.get<ScraperLog[]>(`/scraper/logs?limit=${limit}`)
    }
    return (data as ScraperLogRow[]).map(rowToScraperLog)
  },

  async cancel(jobId: string): Promise<void> {
    return api.post<void>(`/scraper/cancel/${jobId}`, {})
  },
}

