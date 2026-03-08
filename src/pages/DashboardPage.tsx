import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, TrendUp, ChartLine, CurrencyDollar, Phone, Envelope, ChatCircleText } from '@phosphor-icons/react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import type { Lead } from '@/types/lead'
import { toast } from 'sonner'

interface DashboardPageProps {
  leads: Lead[]
}

export function DashboardPage({ leads }: DashboardPageProps) {
  const [draggedMetric, setDraggedMetric] = useState<string | null>(null)
  const [metricOrder, setMetricOrder] = useState(['totalLeads', 'aPlusOpportunities', 'responseRate', 'revenuePipeline'])

  const metrics = useMemo(() => {
    const aPlusLeads = leads.filter((l) => l.rating === 'A+').length
    const responseRate = 23.5
    const revenuePipeline = leads.reduce((sum, lead) => sum + (lead.revenue || 0), 0)

    return {
      totalLeads: leads.length,
      aPlusOpportunities: aPlusLeads,
      responseRate,
      revenuePipeline
    }
  }, [leads])

  const trendData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      value: Math.floor(40 + (i * 8) + Math.random() * 10)
    }))
  }, [])

  const unansweredLeads = useMemo(() => {
    return [...leads]
      .filter((l) => l.status === 'new')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [leads])

  const handleShareEmail = (lead: Lead) => {
    const subject = encodeURIComponent(`Re: ${lead.company}`)
    const body = encodeURIComponent(`Hi ${lead.company},\n\nI wanted to reach out regarding...`)
    window.location.href = `mailto:info@infinityxonesystems@gmail.com?subject=${subject}&body=${body}`
    toast.success('Email draft opened')
  }

  const handleShareSMS = (lead: Lead) => {
    const message = encodeURIComponent(`Hi ${lead.company}, this is regarding your inquiry...`)
    window.location.href = `sms:${lead.phone}?body=${message}`
    toast.success('SMS draft opened')
  }

  const handleDragStart = (metricId: string) => {
    setDraggedMetric(metricId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetMetricId: string) => {
    if (!draggedMetric || draggedMetric === targetMetricId) return
    
    const newOrder = [...metricOrder]
    const draggedIndex = newOrder.indexOf(draggedMetric)
    const targetIndex = newOrder.indexOf(targetMetricId)
    
    newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, draggedMetric)
    
    setMetricOrder(newOrder)
    setDraggedMetric(null)
  }

  const metricConfig: Record<string, {
    title: string
    value: string | number
    icon: React.ReactNode
    gradient: string
    change: string
  }> = {
    totalLeads: {
      title: 'Total Leads',
      value: metrics.totalLeads,
      icon: <Users size={24} weight="duotone" className="text-white" />,
      gradient: 'linear-gradient(135deg, var(--gradient-gold-start), var(--gradient-gold-end))',
      change: '+12%'
    },
    aPlusOpportunities: {
      title: 'A+ Opportunities',
      value: metrics.aPlusOpportunities,
      icon: <TrendUp size={24} weight="duotone" className="text-foreground" />,
      gradient: 'linear-gradient(135deg, var(--gradient-silver-start), var(--gradient-silver-end))',
      change: '+8%'
    },
    responseRate: {
      title: 'Response Rate',
      value: `${metrics.responseRate}%`,
      icon: <ChartLine size={24} weight="duotone" className="text-white" />,
      gradient: 'linear-gradient(135deg, var(--gradient-bronze-start), var(--gradient-bronze-end))',
      change: '+5%'
    },
    revenuePipeline: {
      title: 'Revenue Pipeline',
      value: `$${(metrics.revenuePipeline / 1000).toFixed(0)}K`,
      icon: <CurrencyDollar size={24} weight="duotone" className="text-white" />,
      gradient: 'linear-gradient(135deg, var(--gradient-maroon-start), var(--gradient-maroon-end))',
      change: '+18%'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Intelligence overview and key metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricOrder.map((metricId, index) => {
          const config = metricConfig[metricId]
          return (
            <motion.div
              key={metricId}
              draggable
              onDragStart={() => handleDragStart(metricId)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(metricId)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-[18px] p-4 transition-all duration-200 cursor-move hover:scale-105"
              style={{
                background: 'var(--card)',
                backdropFilter: 'blur(32px) saturate(180%)',
                WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl" style={{ background: config.gradient }}>
                  {config.icon}
                </div>
                <span className="text-xs text-success font-semibold">{config.change}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{config.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                {config.title}
              </div>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#FFFFFF" 
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-[18px] p-6 transition-all duration-200"
        style={{
          background: 'var(--card)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[22px] font-semibold text-white">Unanswered Leads</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {unansweredLeads.length} leads awaiting response
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          {unansweredLeads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No unanswered leads at the moment
            </div>
          ) : (
            unansweredLeads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + (index * 0.05) }}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl transition-all duration-200 hover:bg-muted/20 gap-4"
                style={{
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h4 className="font-semibold text-white">{lead.company}</h4>
                    <span
                      className="px-2 py-1 text-xs font-semibold rounded-md"
                      style={{
                        background: lead.rating === 'A+' 
                          ? 'linear-gradient(135deg, var(--gradient-gold-start), var(--gradient-gold-end))'
                          : lead.rating === 'A'
                          ? 'linear-gradient(135deg, var(--gradient-silver-start), var(--gradient-silver-end))'
                          : 'linear-gradient(135deg, var(--gradient-bronze-start), var(--gradient-bronze-end))',
                        color: '#FFFFFF'
                      }}
                    >
                      {lead.rating}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Score: {lead.opportunityScore}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Phone size={14} weight="duotone" />
                      {lead.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Envelope size={14} weight="duotone" />
                      {lead.email}
                    </span>
                    <span className="text-muted-foreground">{lead.city}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShareEmail(lead)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 text-white text-sm font-medium"
                    style={{ 
                      border: '1px solid var(--border-subtle)',
                      background: 'linear-gradient(135deg, var(--gradient-gold-start), var(--gradient-gold-end))'
                    }}
                    title="Share via Email"
                  >
                    <Envelope size={18} weight="duotone" />
                    Email
                  </button>
                  <button
                    onClick={() => handleShareSMS(lead)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 text-white text-sm font-medium"
                    style={{ 
                      border: '1px solid var(--border-subtle)',
                      background: 'linear-gradient(135deg, var(--gradient-maroon-start), var(--gradient-maroon-end))'
                    }}
                    title="Share via SMS"
                  >
                    <ChatCircleText size={18} weight="duotone" />
                    SMS
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}
