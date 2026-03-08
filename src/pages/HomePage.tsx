import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Robot, 
  ChartBar,
  FunnelSimple,
  ArrowRight,
  TrendUp
} from '@phosphor-icons/react'
import type { Lead } from '@/types/lead'

interface HomePageProps {
  leads: Lead[]
  onNavigate: (page: string) => void
}

export function HomePage({ leads, onNavigate }: HomePageProps) {
  const aLeads = leads.filter(lead => lead.rating === 'A+' || lead.rating === 'A')
  
  const totalLeads = leads.length
  const avgScore = leads.length > 0 
    ? (leads.reduce((sum, lead) => sum + lead.opportunityScore, 0) / leads.length).toFixed(1)
    : '0'

  const quickStats = [
    { label: 'Total Leads', value: totalLeads, icon: Users, page: 'leads' },
    { label: 'A+ Opportunities', value: aLeads.length, icon: TrendUp, page: 'leads' },
    { label: 'Avg Score', value: avgScore, icon: ChartBar, page: 'analytics' },
    { label: 'Pipeline', value: '$2.4M', icon: FunnelSimple, page: 'pipeline' },
  ]

  const quickAccess = [
    { label: 'Dashboard', icon: ChartBar, page: 'dashboard' },
    { label: 'Scraper', icon: Robot, page: 'scraper' },
    { label: 'Leads', icon: Users, page: 'leads' },
    { label: 'Pipeline', icon: FunnelSimple, page: 'pipeline' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-full flex flex-col items-center justify-center py-12"
    >
      <div className="max-w-5xl w-full mx-auto space-y-16">
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-foreground"
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Your intelligence system at a glance
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {quickStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.button
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                onClick={() => onNavigate(stat.page)}
                className="group relative p-8 rounded-2xl bg-card hover:bg-muted border border-border hover:border-gold transition-all text-center"
              >
                <Icon size={32} weight="regular" className="text-gold mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <ArrowRight size={16} className="absolute top-4 right-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            )
          })}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {quickAccess.map((item, index) => {
            const Icon = item.icon
            return (
              <Button
                key={item.page}
                variant="outline"
                size="lg"
                onClick={() => onNavigate(item.page)}
                className="h-auto py-6 px-4 flex flex-col items-center gap-3 hover:bg-muted hover:border-gold transition-all group"
              >
                <Icon size={28} weight="regular" className="text-gold group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">{item.label}</span>
              </Button>
            )
          })}
        </motion.div>
      </div>
    </motion.div>
  )
}
