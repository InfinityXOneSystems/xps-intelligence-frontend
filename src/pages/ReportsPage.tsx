import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBar,
  Robot,
  ChartPie,
  Users,
  CheckCircle,
  ArrowDown,
  ArrowUp,
  DownloadSimple,
  CalendarBlank,
} from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BackButton } from '@/components/BackButton'
import { cn } from '@/lib/utils'

interface ReportsPageProps {
  onNavigate: (page: string) => void
}

type ReportType = 'leads' | 'scraping' | 'agent_performance' | 'revenue_forecast' | 'system_health'
type DateRange = '7d' | '30d' | '90d' | 'custom'

const REPORT_TYPES: { id: ReportType; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'leads', label: 'Lead Reports', icon: Users, color: 'text-blue-400' },
  { id: 'scraping', label: 'Scraping Reports', icon: Robot, color: 'text-amber-400' },
  { id: 'agent_performance', label: 'Agent Performance', icon: ChartBar, color: 'text-purple-400' },
  { id: 'revenue_forecast', label: 'Revenue Forecast', icon: ChartPie, color: 'text-green-400' },
  { id: 'system_health', label: 'System Health', icon: CheckCircle, color: 'text-rose-400' },
]

const DATE_RANGES: { id: DateRange; label: string }[] = [
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: '90d', label: 'Last 90 Days' },
  { id: 'custom', label: 'Custom Range' },
]

const RECENT_REPORTS = [
  { id: '1', name: 'Weekly Lead Quality Report', type: 'leads', generatedAt: '2024-12-01T08:00:00Z', status: 'ready', size: '2.4 MB' },
  { id: '2', name: 'Agent Performance Summary – Nov', type: 'agent_performance', generatedAt: '2024-12-01T06:30:00Z', status: 'ready', size: '1.1 MB' },
  { id: '3', name: 'Scraping Campaign Results', type: 'scraping', generatedAt: '2024-11-30T22:00:00Z', status: 'ready', size: '8.7 MB' },
  { id: '4', name: 'Q4 Revenue Forecast', type: 'revenue_forecast', generatedAt: '2024-11-30T09:00:00Z', status: 'ready', size: '3.2 MB' },
  { id: '5', name: 'System Health Report – Nov', type: 'system_health', generatedAt: '2024-11-29T08:00:00Z', status: 'ready', size: '0.9 MB' },
]

const AGENT_PERFORMANCE = [
  { agent: 'ScraperAgent', tasks: 847, success: 0.94, avgTime: '2.1s', trend: 'up' },
  { agent: 'PlannerAgent', tasks: 312, success: 0.98, avgTime: '0.8s', trend: 'up' },
  { agent: 'ResearchAgent', tasks: 204, success: 0.91, avgTime: '4.3s', trend: 'down' },
  { agent: 'BuilderAgent', tasks: 156, success: 0.96, avgTime: '12.7s', trend: 'up' },
  { agent: 'ValidatorAgent', tasks: 289, success: 0.99, avgTime: '3.2s', trend: 'up' },
  { agent: 'BusinessAgent', tasks: 134, success: 0.88, avgTime: '5.6s', trend: 'down' },
]

const KPI_DATA: Record<ReportType, { label: string; value: string; delta: number; deltaLabel: string }[]> = {
  leads: [
    { label: 'Total Leads', value: '4,821', delta: 12.3, deltaLabel: 'vs last period' },
    { label: 'Qualified Rate', value: '68.4%', delta: 3.1, deltaLabel: 'improvement' },
    { label: 'Avg Lead Score', value: '73.2', delta: -1.4, deltaLabel: 'vs last period' },
    { label: 'Conversion Rate', value: '8.7%', delta: 2.2, deltaLabel: 'improvement' },
  ],
  scraping: [
    { label: 'Total Scraped', value: '48,291', delta: 24.7, deltaLabel: 'vs last period' },
    { label: 'Data Quality', value: '91.2%', delta: 1.8, deltaLabel: 'improvement' },
    { label: 'Unique Sources', value: '127', delta: 14.0, deltaLabel: 'new sources' },
    { label: 'Success Rate', value: '87.3%', delta: -0.5, deltaLabel: 'vs last period' },
  ],
  agent_performance: [
    { label: 'Tasks Completed', value: '1,942', delta: 18.6, deltaLabel: 'vs last period' },
    { label: 'Agents Active', value: '11/13', delta: 0, deltaLabel: 'online now' },
    { label: 'Avg Success Rate', value: '94.1%', delta: 2.3, deltaLabel: 'improvement' },
    { label: 'Avg Response', value: '3.8s', delta: -8.5, deltaLabel: 'faster' },
  ],
  revenue_forecast: [
    { label: 'Projected MRR', value: '$24,800', delta: 15.2, deltaLabel: 'vs current' },
    { label: 'Pipeline Value', value: '$312K', delta: 22.4, deltaLabel: 'vs last quarter' },
    { label: 'Win Probability', value: '34.7%', delta: 4.1, deltaLabel: 'improvement' },
    { label: 'Forecast Accuracy', value: '82.1%', delta: 1.9, deltaLabel: 'improvement' },
  ],
  system_health: [
    { label: 'Uptime', value: '99.97%', delta: 0.01, deltaLabel: 'improvement' },
    { label: 'Avg CPU', value: '34%', delta: -5.2, deltaLabel: 'reduction' },
    { label: 'Error Rate', value: '0.12%', delta: -18.4, deltaLabel: 'reduction' },
    { label: 'API Latency', value: '142ms', delta: -12.1, deltaLabel: 'faster' },
  ],
}

function KpiCard({ label, value, delta, deltaLabel }: { label: string; value: string; delta: number; deltaLabel: string }) {
  const isPositive = delta >= 0
  const cardStyle = {
    background: 'var(--card)',
    backdropFilter: 'blur(32px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)',
  }
  return (
    <Card style={cardStyle}>
      <CardContent className="p-5">
        <p className="text-xs text-white/50 mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        <div className={cn('flex items-center gap-1 mt-1.5 text-xs', isPositive ? 'text-green-400' : 'text-red-400')}>
          {isPositive ? <ArrowUp size={12} weight="bold" /> : <ArrowDown size={12} weight="bold" />}
          <span>{Math.abs(delta)}% {deltaLabel}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function ReportsPage({ onNavigate }: ReportsPageProps) {
  const [activeReport, setActiveReport] = useState<ReportType>('leads')
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  const kpis = useMemo(() => KPI_DATA[activeReport], [activeReport])

  const cardStyle = {
    background: 'var(--card)',
    backdropFilter: 'blur(32px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)',
  }

  return (
    <div className="space-y-8">
      <BackButton onBack={() => onNavigate('home')} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-white/50 mt-2 text-base">System-wide performance insights and data exports</p>
        </div>
        <Button className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30">
          <DownloadSimple size={18} /> Export Report
        </Button>
      </div>

      {/* Report type selector + date range */}
      <div className="flex flex-col lg:flex-row gap-4">
        <Card style={cardStyle} className="flex-1">
          <CardContent className="p-3">
            <div className="flex flex-wrap gap-2">
              {REPORT_TYPES.map(rt => {
                const Icon = rt.icon
                const isActive = rt.id === activeReport
                return (
                  <button
                    key={rt.id}
                    onClick={() => setActiveReport(rt.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300'
                        : 'border border-white/10 text-white/50 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon size={15} className={isActive ? 'text-yellow-400' : rt.color} />
                    {rt.label}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card style={cardStyle}>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <CalendarBlank size={16} className="text-white/40 shrink-0" />
              <div className="flex gap-1">
                {DATE_RANGES.map(dr => (
                  <button
                    key={dr.id}
                    onClick={() => setDateRange(dr.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                      dateRange === dr.id
                        ? 'bg-white/15 text-white'
                        : 'text-white/40 hover:text-white hover:bg-white/8'
                    )}
                  >
                    {dr.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <motion.div
        key={activeReport}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {kpis.map(kpi => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="lg:col-span-2">
          <Card style={cardStyle}>
            <CardHeader className="pb-3 border-b border-white/8">
              <CardTitle className="text-white text-base">Recent Reports</CardTitle>
              <CardDescription className="text-white/40 text-xs">Click to download or preview</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {RECENT_REPORTS.map((report, i) => {
                const meta = REPORT_TYPES.find(r => r.id === report.type)
                const Icon = meta?.icon || ChartBar
                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 shrink-0">
                        <Icon size={14} className={meta?.color || 'text-white/50'} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{report.name}</p>
                        <p className="text-xs text-white/40">
                          {new Date(report.generatedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} · {report.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500/15 text-green-400 border-green-500/30 text-xs border">
                        {report.status}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-white/40 hover:text-white p-1.5 h-auto">
                        <DownloadSimple size={14} />
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Agent Performance Summary */}
        <Card style={cardStyle}>
          <CardHeader className="pb-3 border-b border-white/8">
            <CardTitle className="text-white text-base">Agent Performance</CardTitle>
            <CardDescription className="text-white/40 text-xs">{dateRange === '7d' ? 'Last 7 days' : dateRange === '30d' ? 'Last 30 days' : 'Last 90 days'}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-left text-xs text-white/40 px-4 py-2">Agent</th>
                    <th className="text-right text-xs text-white/40 px-4 py-2">Tasks</th>
                    <th className="text-right text-xs text-white/40 px-4 py-2">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {AGENT_PERFORMANCE.map((row, i) => (
                    <tr key={row.agent} className={cn('border-b border-white/5', i % 2 === 0 ? '' : 'bg-white/2')}>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          {row.trend === 'up'
                            ? <ArrowUp size={10} className="text-green-400 shrink-0" weight="bold" />
                            : <ArrowDown size={10} className="text-red-400 shrink-0" weight="bold" />
                          }
                          <span className="text-xs text-white/80">{row.agent.replace('Agent', '')}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="text-xs font-mono text-white/70">{row.tasks}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={cn('text-xs font-mono font-medium', row.success >= 0.95 ? 'text-green-400' : row.success >= 0.90 ? 'text-yellow-400' : 'text-red-400')}>
                          {(row.success * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
