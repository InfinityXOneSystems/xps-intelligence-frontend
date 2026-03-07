import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Users, TrendUp, ChartLine, CurrencyDollar, Phone, Envelope } from '@phosphor-icons/react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { Lead } from '@/types/lead'

interface DashboardPageProps {
  leads: Lead[]
}

export function DashboardPage({ leads }: DashboardPageProps) {
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

  const growthData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    return months.map((month, i) => ({
      month,
      leads: Math.floor(40 + (i * 25) + Math.random() * 15)
    }))
  }, [])

  const recentLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
  }, [leads])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Intelligence overview and key metrics
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-[18px] p-6 transition-all duration-200"
        style={{
          background: 'var(--card)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <h3 className="text-[22px] font-semibold mb-6 text-foreground">Lead Growth</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={growthData}>
            <defs>
              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.82 0.15 70)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="oklch(0.82 0.15 70)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis
              dataKey="month"
              stroke="#9CA3AF"
              style={{ fontSize: '12px', fontFamily: 'Montserrat, Inter, sans-serif' }}
            />
            <YAxis
              stroke="#9CA3AF"
              style={{ fontSize: '12px', fontFamily: 'Montserrat, Inter, sans-serif' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                backdropFilter: 'blur(32px) saturate(180%)',
                WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                color: 'var(--foreground)'
              }}
              formatter={(value: number) => [value, 'Leads']}
            />
            <Area
              type="monotone"
              dataKey="leads"
              stroke="oklch(0.82 0.15 70)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorGrowth)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-[18px] p-6 transition-all duration-200"
          style={{
            background: 'var(--card)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, var(--gradient-gold-start), var(--gradient-gold-end))' }}>
              <Users size={24} weight="duotone" className="text-white" />
            </div>
            <span className="text-sm text-success font-semibold">+12%</span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">{metrics.totalLeads}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Total Leads</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-[18px] p-6 transition-all duration-200"
          style={{
            background: 'var(--card)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, var(--gradient-silver-start), var(--gradient-silver-end))' }}>
              <TrendUp size={24} weight="duotone" className="text-foreground" />
            </div>
            <span className="text-sm text-success font-semibold">+8%</span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">{metrics.aPlusOpportunities}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">A+ Opportunities</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-[18px] p-6 transition-all duration-200"
          style={{
            background: 'var(--card)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, var(--gradient-bronze-start), var(--gradient-bronze-end))' }}>
              <ChartLine size={24} weight="duotone" className="text-white" />
            </div>
            <span className="text-sm text-success font-semibold">+5%</span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">{metrics.responseRate}%</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Response Rate</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-[18px] p-6 transition-all duration-200"
          style={{
            background: 'var(--card)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, var(--gradient-maroon-start), var(--gradient-maroon-end))' }}>
              <CurrencyDollar size={24} weight="duotone" className="text-white" />
            </div>
            <span className="text-sm text-success font-semibold">+18%</span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">${(metrics.revenuePipeline / 1000).toFixed(0)}K</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Revenue Pipeline</div>
        </motion.div>
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
        <h3 className="text-[22px] font-semibold mb-6 text-foreground">Recent Leads</h3>
        <div className="space-y-3">
          {recentLeads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + (index * 0.05) }}
              className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:bg-muted/20"
              style={{
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-foreground">{lead.company}</h4>
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
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{lead.city}</span>
                  <span>Score: {lead.opportunityScore}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${lead.phone}`}
                  className="p-2 rounded-lg transition-all duration-200 hover:bg-muted/30"
                  style={{ border: '1px solid var(--border-subtle)' }}
                  title={lead.phone}
                >
                  <Phone size={20} weight="duotone" className="text-foreground" />
                </a>
                <a
                  href={`mailto:info@infinityxonesystems@gmail.com?subject=Re: ${encodeURIComponent(lead.company)}`}
                  className="p-2 rounded-lg transition-all duration-200 hover:bg-muted/30"
                  style={{ border: '1px solid var(--border-subtle)' }}
                  title="info@infinityxonesystems@gmail.com"
                >
                  <Envelope size={20} weight="duotone" className="text-foreground" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
