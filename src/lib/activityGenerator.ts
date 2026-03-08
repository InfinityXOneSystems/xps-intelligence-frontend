import type { Activity, ActivityType, Notification } from '@/types/activity'
import type { Lead } from '@/types/lead'

export function generateMockActivities(leads: Lead[]): Activity[] {
  const activities: Activity[] = []
  const now = Date.now()
  
  const activityTemplates: Array<{
    type: ActivityType
    titleFn: (lead: Lead) => string
    descFn: (lead: Lead) => string
  }> = [
    {
      type: 'lead_added',
      titleFn: (lead) => `New lead discovered`,
      descFn: (lead) => `${lead.company} from ${lead.city} added to pipeline`
    },
    {
      type: 'score_updated',
      titleFn: (lead) => `Score updated`,
      descFn: (lead) => `${lead.company} opportunity score: ${lead.opportunityScore}`
    },
    {
      type: 'lead_assigned',
      titleFn: (lead) => `Lead assigned`,
      descFn: (lead) => `${lead.company} assigned to ${lead.assignedRep}`
    },
    {
      type: 'email_sent',
      titleFn: (lead) => `Email sent`,
      descFn: (lead) => `Outreach email sent to ${lead.company}`
    },
    {
      type: 'call_made',
      titleFn: (lead) => `Call logged`,
      descFn: (lead) => `Call made to ${lead.company}`
    },
    {
      type: 'status_changed',
      titleFn: (lead) => `Status updated`,
      descFn: (lead) => `${lead.company} marked as ${lead.status}`
    }
  ]

  leads.slice(0, 15).forEach((lead, index) => {
    const template = activityTemplates[index % activityTemplates.length]
    const minutesAgo = Math.floor(Math.random() * 120) + 1
    
    activities.push({
      id: `activity-${lead.id}-${index}`,
      type: template.type,
      title: template.titleFn(lead),
      description: template.descFn(lead),
      timestamp: now - (minutesAgo * 60 * 1000),
      leadId: lead.id,
      leadName: lead.company
    })
  })

  activities.push(
    {
      id: 'activity-scraper-1',
      type: 'scraper_started',
      title: 'Scraper initiated',
      description: 'Web scraper started for Tampa contractors',
      timestamp: now - (45 * 60 * 1000)
    },
    {
      id: 'activity-scraper-2',
      type: 'scraper_completed',
      title: 'Scraper completed',
      description: 'Found 87 new leads in Miami area',
      timestamp: now - (30 * 60 * 1000)
    }
  )

  return activities.sort((a, b) => b.timestamp - a.timestamp)
}

export function generateMockNotifications(): Notification[] {
  const now = Date.now()
  
  return [
    {
      id: 'notif-1',
      type: 'success',
      title: 'New A+ Lead',
      message: '5 new high-value opportunities added to your pipeline',
      timestamp: now - (5 * 60 * 1000),
      read: false,
      actionUrl: 'leads',
      actionLabel: 'View Leads'
    },
    {
      id: 'notif-2',
      type: 'info',
      title: 'Scraper Update',
      message: 'Web scraper completed successfully with 87 results',
      timestamp: now - (15 * 60 * 1000),
      read: false,
      actionUrl: 'scraper',
      actionLabel: 'View Results'
    },
    {
      id: 'notif-3',
      type: 'warning',
      title: 'Follow-up Required',
      message: '12 leads pending response for over 48 hours',
      timestamp: now - (30 * 60 * 1000),
      read: true,
      actionUrl: 'leads',
      actionLabel: 'Review'
    },
    {
      id: 'notif-4',
      type: 'success',
      title: 'Email Campaign',
      message: '24 outreach emails sent with 68% open rate',
      timestamp: now - (60 * 60 * 1000),
      read: true
    },
    {
      id: 'notif-5',
      type: 'info',
      title: 'Pipeline Update',
      message: 'Revenue pipeline increased to $2.4M',
      timestamp: now - (90 * 60 * 1000),
      read: true,
      actionUrl: 'pipeline',
      actionLabel: 'View Pipeline'
    }
  ]
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

export function getActivityIcon(type: ActivityType): string {
  const iconMap: Record<ActivityType, string> = {
    lead_added: 'UserPlus',
    lead_updated: 'PencilSimple',
    lead_assigned: 'UserCheck',
    email_sent: 'EnvelopeSimple',
    call_made: 'Phone',
    scraper_started: 'Robot',
    scraper_completed: 'CheckCircle',
    score_updated: 'ChartLine',
    note_added: 'Note',
    status_changed: 'ArrowsClockwise'
  }
  
  return iconMap[type] || 'Dot'
}

export function getActivityColor(type: ActivityType): string {
  const colorMap: Record<ActivityType, string> = {
    lead_added: 'text-gold',
    lead_updated: 'text-info',
    lead_assigned: 'text-success',
    email_sent: 'text-gold-muted',
    call_made: 'text-gold',
    scraper_started: 'text-info',
    scraper_completed: 'text-success',
    score_updated: 'text-warning',
    note_added: 'text-muted-foreground',
    status_changed: 'text-info'
  }
  
  return colorMap[type] || 'text-muted-foreground'
}
