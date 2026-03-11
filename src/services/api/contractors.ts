/**
 * contractors.ts — Supabase-backed contractors data layer.
 *
 * All contractor CRUD operations go directly to Supabase,
 * bypassing the Railway backend to prevent merge conflicts.
 *
 * Supabase table: `contractors`  (columns: snake_case)
 */

import { supabase } from '@/lib/supabase'
import type { ContractorRow } from '@/types/supabase'

export interface Contractor {
  id: string
  name: string
  company: string
  email: string
  phone: string
  website?: string
  city: string
  state: string
  category: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  score: number
  source: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ContractorFilters {
  status?: string
  category?: string
  city?: string
  state?: string
  search?: string
  page?: number
  limit?: number
}

// ── Row ↔ Model converters ────────────────────────────────────────────────────

function rowToContractor(row: ContractorRow): Contractor {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    website: row.website ?? undefined,
    city: row.city,
    state: row.state,
    category: row.category,
    status: row.status as Contractor['status'],
    score: row.score,
    source: row.source,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function contractorToRow(
  c: Partial<Omit<Contractor, 'id' | 'createdAt' | 'updatedAt'>>
): Partial<Omit<ContractorRow, 'id' | 'created_at' | 'updated_at'>> {
  const row: Partial<Omit<ContractorRow, 'id' | 'created_at' | 'updated_at'>> = {}
  if (c.name !== undefined) row.name = c.name
  if (c.company !== undefined) row.company = c.company
  if (c.email !== undefined) row.email = c.email
  if (c.phone !== undefined) row.phone = c.phone
  if ('website' in c) row.website = c.website ?? null
  if (c.city !== undefined) row.city = c.city
  if (c.state !== undefined) row.state = c.state
  if (c.category !== undefined) row.category = c.category
  if (c.status !== undefined) row.status = c.status
  if (c.score !== undefined) row.score = c.score
  if (c.source !== undefined) row.source = c.source
  if ('notes' in c) row.notes = c.notes ?? null
  return row
}

// ── Contractors API ───────────────────────────────────────────────────────────

export const contractorsApi = {
  async list(
    filters?: ContractorFilters
  ): Promise<{ contractors: Contractor[]; total: number; page: number; pages: number }> {
    const page = filters?.page ?? 1
    const limit = filters?.limit ?? 50
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase.from('contractors').select('*', { count: 'exact' })

    if (filters?.status) query = query.eq('status', filters.status)
    if (filters?.category) query = query.eq('category', filters.category)
    if (filters?.city) query = query.ilike('city', `%${filters.city}%`)
    if (filters?.state) query = query.eq('state', filters.state)
    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,company.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
      )
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error
    const total = count ?? 0
    return {
      contractors: (data as ContractorRow[]).map(rowToContractor),
      total,
      page,
      pages: Math.ceil(total / limit),
    }
  },

  async create(
    data: Omit<Contractor, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Contractor> {
    const now = new Date().toISOString()
    const { data: row, error } = await supabase
      .from('contractors')
      .insert({ ...contractorToRow(data), created_at: now, updated_at: now })
      .select()
      .single()
    if (error) throw error
    return rowToContractor(row as ContractorRow)
  },

  async update(id: string, data: Partial<Contractor>): Promise<Contractor> {
    const { data: row, error } = await supabase
      .from('contractors')
      .update({ ...contractorToRow(data), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return rowToContractor(row as ContractorRow)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('contractors').delete().eq('id', id)
    if (error) throw error
  },

  async bulkUpdate(ids: string[], data: Partial<Contractor>): Promise<{ updated: number }> {
    const { data: rows, error } = await supabase
      .from('contractors')
      .update({ ...contractorToRow(data), updated_at: new Date().toISOString() })
      .in('id', ids)
      .select('id')
    if (error) throw error
    return { updated: rows?.length ?? 0 }
  },

  async export(format: 'csv' | 'excel' | 'pdf'): Promise<{ url: string }> {
    // Export is generated server-side; delegate to Railway for file generation
    const { API_BASE } = await import('@/lib/config')
    const res = await fetch(
      `${API_BASE}/contractors/export?format=${encodeURIComponent(format)}`
    )
    if (!res.ok) throw new Error('Export failed')
    return res.json() as Promise<{ url: string }>
  },
}

