import { api } from './api'
import type { Lead, DashboardMetrics, ScraperConfig, ScraperLog } from '@/types/lead'

export const leadsApi = {
  async getAll(): Promise<Lead[]> {
    return api.get<Lead[]>('/leads')
  },

  async getById(id: string): Promise<Lead> {
    return api.get<Lead>(`/leads/${id}`)
  },

  async create(lead: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> {
    return api.post<Lead>('/leads', lead)
  },

  async update(id: string, lead: Partial<Lead>): Promise<Lead> {
    return api.put<Lead>(`/leads/${id}`, lead)
  },

  async delete(id: string): Promise<void> {
    return api.delete<void>(`/leads/${id}`)
  },

  async getMetrics(): Promise<DashboardMetrics> {
    return api.get<DashboardMetrics>('/leads/metrics')
  },

  async assignRep(leadId: string, repId: string, repName: string, repInitials: string): Promise<Lead> {
    return api.post<Lead>(`/leads/${leadId}/assign`, { 
      repId, 
      repName, 
      repInitials 
    })
  },

  async updateStatus(leadId: string, status: Lead['status']): Promise<Lead> {
    return api.put<Lead>(`/leads/${leadId}/status`, { status })
  },

  async addNote(leadId: string, note: string): Promise<Lead> {
    return api.post<Lead>(`/leads/${leadId}/notes`, { note })
  },
}

export const scraperApi = {
  async run(config: ScraperConfig): Promise<{ jobId: string }> {
    return api.post<{ jobId: string }>('/scraper/run', config)
  },

  async getStatus(jobId: string): Promise<ScraperLog> {
    return api.get<ScraperLog>(`/scraper/status/${jobId}`)
  },

  async getLogs(limit: number = 50): Promise<ScraperLog[]> {
    return api.get<ScraperLog[]>(`/scraper/logs?limit=${limit}`)
  },

  async cancel(jobId: string): Promise<void> {
    return api.post<void>(`/scraper/cancel/${jobId}`, {})
  },
}
