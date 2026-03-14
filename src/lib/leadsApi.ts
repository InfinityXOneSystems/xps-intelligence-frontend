import { api } from './api'
import type { Lead, DashboardMetrics, ScraperConfig, ScraperLog } from '@/types/lead'
import { generateDemoLeads } from '@/lib/mockData'

let localLeadsCache: Lead[] | null = null
let backendAvailable: boolean | null = null

async function getLocalLeads(): Promise<Lead[]> {
  if (localLeadsCache) return localLeadsCache
  
  try {
    const stored = localStorage.getItem('xps_leads_cache')
    if (stored) {
      localLeadsCache = JSON.parse(stored)
      return localLeadsCache!
    }
  } catch (error) {
    console.warn('Failed to load cached leads')
  }
  
  localLeadsCache = generateDemoLeads()
  return localLeadsCache
}

function saveLocalLeads(leads: Lead[]) {
  localLeadsCache = leads
  try {
    localStorage.setItem('xps_leads_cache', JSON.stringify(leads))
  } catch (error) {
    console.warn('Failed to cache leads locally')
  }
}

function calculateMetrics(leads: Lead[]): DashboardMetrics {
  return {
    totalLeads: leads.length,
    aPlusOpportunities: leads.filter(l => l.rating === 'A+').length,
    emailsSent: Math.floor(leads.length * 0.6),
    responseRate: 42.5,
    revenuePipeline: leads.reduce((sum, l) => sum + (l.revenue || 0), 0),
  }
}

export const leadsApi = {
  async getAll(): Promise<Lead[]> {
    try {
      console.log('[LeadsAPI] Fetching leads from backend...')
      const leads = await api.get<Lead[]>('/leads')
      console.log('[LeadsAPI] Successfully fetched', leads.length, 'leads from backend')
      saveLocalLeads(leads)
      backendAvailable = true
      return leads
    } catch (error) {
      console.warn('[LeadsAPI] Backend unavailable, using local/demo data:', error)
      backendAvailable = false
      const localLeads = await getLocalLeads()
      console.log('[LeadsAPI] Loaded', localLeads.length, 'leads from local cache/demo')
      return localLeads
    }
  },

  async getById(id: string): Promise<Lead> {
    try {
      return await api.get<Lead>(`/leads/${id}`)
    } catch (error) {
      const leads = await getLocalLeads()
      const lead = leads.find(l => l.id === id)
      if (!lead) throw new Error('Lead not found')
      return lead
    }
  },

  async create(lead: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> {
    try {
      const newLead = await api.post<Lead>('/leads', lead)
      return newLead
    } catch (error) {
      const leads = await getLocalLeads()
      const newLead: Lead = {
        ...lead,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      saveLocalLeads([...leads, newLead])
      return newLead
    }
  },

  async update(id: string, leadData: Partial<Lead>): Promise<Lead> {
    try {
      return await api.put<Lead>(`/leads/${id}`, leadData)
    } catch (error) {
      const leads = await getLocalLeads()
      const index = leads.findIndex(l => l.id === id)
      if (index === -1) throw new Error('Lead not found')
      
      const updated = { ...leads[index], ...leadData, updatedAt: new Date().toISOString() }
      leads[index] = updated
      saveLocalLeads(leads)
      return updated
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete<void>(`/leads/${id}`)
    } catch (error) {
      const leads = await getLocalLeads()
      const filtered = leads.filter(l => l.id !== id)
      saveLocalLeads(filtered)
    }
  },

  async getMetrics(): Promise<DashboardMetrics> {
    try {
      return await api.get<DashboardMetrics>('/leads/metrics')
    } catch (error) {
      const leads = await getLocalLeads()
      return calculateMetrics(leads)
    }
  },

  async assignRep(leadId: string, repId: string, repName: string, repInitials: string): Promise<Lead> {
    try {
      return await api.post<Lead>(`/leads/${leadId}/assign`, { 
        repId, 
        repName, 
        repInitials 
      })
    } catch (error) {
      const leads = await getLocalLeads()
      const index = leads.findIndex(l => l.id === leadId)
      if (index === -1) throw new Error('Lead not found')
      
      const updated = {
        ...leads[index],
        assignedRep: repName,
        assignedInitials: repInitials,
        updatedAt: new Date().toISOString(),
      }
      leads[index] = updated
      saveLocalLeads(leads)
      return updated
    }
  },

  async updateStatus(leadId: string, status: Lead['status']): Promise<Lead> {
    try {
      return await api.put<Lead>(`/leads/${leadId}/status`, { status })
    } catch (error) {
      const leads = await getLocalLeads()
      const index = leads.findIndex(l => l.id === leadId)
      if (index === -1) throw new Error('Lead not found')
      
      const updated = {
        ...leads[index],
        status,
        updatedAt: new Date().toISOString(),
      }
      leads[index] = updated
      saveLocalLeads(leads)
      return updated
    }
  },

  async addNote(leadId: string, note: string): Promise<Lead> {
    try {
      return await api.post<Lead>(`/leads/${leadId}/notes`, { note })
    } catch (error) {
      const leads = await getLocalLeads()
      const index = leads.findIndex(l => l.id === leadId)
      if (index === -1) throw new Error('Lead not found')
      
      const currentNotes = leads[index].notes || ''
      const updated = {
        ...leads[index],
        notes: currentNotes + '\n' + note,
        updatedAt: new Date().toISOString(),
      }
      leads[index] = updated
      saveLocalLeads(leads)
      return updated
    }
  },

  isBackendAvailable(): boolean {
    return backendAvailable ?? false
  }
}

export const scraperApi = {
  async run(config: ScraperConfig): Promise<{ jobId: string }> {
    try {
      return await api.post<{ jobId: string }>('/scraper/run', config)
    } catch (error) {
      const jobId = 'demo-' + Date.now()
      console.warn('Backend unavailable, simulating scraper job:', jobId)
      return { jobId }
    }
  },

  async getStatus(jobId: string): Promise<ScraperLog> {
    try {
      return await api.get<ScraperLog>(`/scraper/status/${jobId}`)
    } catch (error) {
      return {
        id: jobId,
        timestamp: new Date().toISOString(),
        status: 'completed',
        message: 'Demo mode - backend unavailable',
      }
    }
  },

  async getLogs(limit: number = 50): Promise<ScraperLog[]> {
    try {
      return await api.get<ScraperLog[]>(`/scraper/logs?limit=${limit}`)
    } catch (error) {
      return [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          status: 'completed',
          message: 'Demo mode - backend unavailable',
        }
      ]
    }
  },

  async cancel(jobId: string): Promise<void> {
    try {
      await api.post<void>(`/scraper/cancel/${jobId}`, {})
    } catch (error) {
      console.warn('Backend unavailable, cannot cancel job')
    }
  },
}
