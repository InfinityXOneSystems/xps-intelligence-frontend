import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { Lead } from '@/types/lead'

interface DashboardChartsProps {
  leads: Lead[]
}

export function DashboardCharts({ leads }: DashboardChartsProps) {
  const scoreDistribution = useMemo(() => {
    const ranges = [
      { name: '90-100', min: 90, max: 100, count: 0 },
      { name: '80-89', min: 80, max: 89, count: 0 },
      { name: '70-79', min: 70, max: 79, count: 0 },
      { name: '60-69', min: 60, max: 69, count: 0 },
      { name: 'Below 60', min: 0, max: 59, count: 0 }
    ]

    leads.forEach((lead) => {
      const range = ranges.find((r) => lead.opportunityScore >= r.min && lead.opportunityScore <= r.max)
      if (range) range.count++
    })

    return ranges
  }, [leads])

  const pipelineData = useMemo(() => {
    const statusMap: Record<string, number> = {
      new: 0,
      contacted: 0,
      qualified: 0,
      proposal: 0,
      closed: 0,
      lost: 0
    }

    leads.forEach((lead) => {
      statusMap[lead.status] = (statusMap[lead.status] || 0) + 1
    })

    return Object.entries(statusMap)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count
      }))
  }, [leads])

  const revenueData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map((month, i) => ({
      month,
      revenue: Math.floor(Math.random() * 100000) + 50000 + (i * 10000)
    }))
  }, [])

  const COLORS = [
    'oklch(0.85 0.15 85)',
    'oklch(0.7 0.12 120)',
    'oklch(0.65 0.15 200)',
    'oklch(0.6 0.10 280)',
    'oklch(0.55 0.15 340)',
    'oklch(0.5 0.10 60)'
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card glass-card-hover p-6 rounded-lg"
      >
        <h3 className="text-lg font-semibold mb-4">Opportunity Score Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scoreDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 250)" />
            <XAxis
              dataKey="name"
              stroke="oklch(0.6 0.01 250)"
              style={{ fontSize: '12px', fontFamily: 'Inter' }}
            />
            <YAxis
              stroke="oklch(0.6 0.01 250)"
              style={{ fontSize: '12px', fontFamily: 'Inter' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(0.12 0 0)',
                border: '1px solid oklch(0.25 0.01 250)',
                borderRadius: '0.5rem',
                color: 'oklch(0.98 0 0)'
              }}
            />
            <Bar dataKey="count" fill="oklch(0.85 0.15 85)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card glass-card-hover p-6 rounded-lg"
      >
        <h3 className="text-lg font-semibold mb-4">Lead Pipeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pipelineData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="oklch(0.85 0.15 85)"
              dataKey="value"
            >
              {pipelineData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(0.12 0 0)',
                border: '1px solid oklch(0.25 0.01 250)',
                borderRadius: '0.5rem',
                color: 'oklch(0.98 0 0)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card glass-card-hover p-6 rounded-lg lg:col-span-2"
      >
        <h3 className="text-lg font-semibold mb-4">Revenue Pipeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.85 0.15 85)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="oklch(0.85 0.15 85)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 250)" />
            <XAxis
              dataKey="month"
              stroke="oklch(0.6 0.01 250)"
              style={{ fontSize: '12px', fontFamily: 'Inter' }}
            />
            <YAxis
              stroke="oklch(0.6 0.01 250)"
              style={{ fontSize: '12px', fontFamily: 'Inter' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(0.12 0 0)',
                border: '1px solid oklch(0.25 0.01 250)',
                borderRadius: '0.5rem',
                color: 'oklch(0.98 0 0)'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="oklch(0.85 0.15 85)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
