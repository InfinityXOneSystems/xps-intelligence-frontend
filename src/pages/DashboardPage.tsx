import { useMemo } from 'react'
import {  Users, Envelope, ChartLine, CurrencyDollar, Star } from '@phosphor-icons/react'
import { MetricCard } from '@/components/MetricCard'
import { DashboardCharts } from '@/components/DashboardCharts'
import type { Lead } from '@/types/lead'

interface DashboardPageProps {
  leads: Lead[]
}

export function DashboardPage({ leads }: DashboardPageProps) {
  const metrics = useMemo(() => {
    const aPlusLeads = leads.filter((l) => l.rating === 'A+').length
    const emailsSent = Math.floor(leads.length * 0.6)
    const responseRate = 23.5
    const revenuePipeline = leads.reduce((sum, lead) => sum + (lead.revenue || 0), 0)

    return {
      totalLeads: leads.length,
      aPlusOpportunities: aPlusLeads,
      emailsSent,
      responseRate,
      revenuePipeline
    }
  }, [leads])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Intelligence overview and key metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Leads"
          value={metrics.totalLeads}
          change={12}
          icon={<Users size={32} weight="duotone" />}
          delay={0}
        />
        <MetricCard
          title="A+ Opportunities"
          value={metrics.aPlusOpportunities}
          change={8}
          icon={<Star size={32} weight="duotone" />}
          delay={0.1}
        />
        <MetricCard
          title="Emails Sent"
          value={metrics.emailsSent}
          change={-3}
          icon={<Envelope size={32} weight="duotone" />}
          delay={0.2}
        />
        <MetricCard
          title="Response Rate"
          value={`${metrics.responseRate}%`}
          change={5}
          icon={<ChartLine size={32} weight="duotone" />}
          delay={0.3}
        />
        <MetricCard
          title="Revenue Pipeline"
          value={`$${(metrics.revenuePipeline / 1000).toFixed(0)}K`}
          change={18}
          icon={<CurrencyDollar size={32} weight="duotone" />}
          delay={0.4}
        />
      </div>

      <DashboardCharts leads={leads} />
    </div>
  )
}
