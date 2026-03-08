import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Robot, 
  ChartBar,
  FunnelSimple,
  PaperPlaneTilt,
  ChartLine,
  UserList,
  ArrowRight,
  TrendUp,
  Phone,
  EnvelopeSimple
} from '@phosphor-icons/react'
import type { Lead } from '@/types/lead'

interface HomePageProps {
  leads: Lead[]
  onNavigate: (page: string) => void
}

export function HomePage({ leads, onNavigate }: HomePageProps) {
  const aLeads = leads.filter(lead => lead.rating === 'A+' || lead.rating === 'A')
  const unansweredLeads = leads.slice(0, 5)
  
  const totalLeads = leads.length
  const avgScore = leads.length > 0 
    ? (leads.reduce((sum, lead) => sum + lead.opportunityScore, 0) / leads.length).toFixed(1)
    : '0'

  const quickStats = [
    { label: 'Total Leads', value: totalLeads, icon: Users, page: 'leads', color: 'gold' },
    { label: 'A+ Opportunities', value: aLeads.length, icon: TrendUp, page: 'leads', color: 'gold-muted' },
    { label: 'Avg Score', value: avgScore, icon: ChartBar, page: 'analytics', color: 'silver' },
    { label: 'Pipeline', value: '$2.4M', icon: FunnelSimple, page: 'pipeline', color: 'gold' },
  ]

  const quickAccess = [
    { label: 'Dashboard', icon: ChartBar, page: 'dashboard', desc: 'Analytics & Charts' },
    { label: 'Scraper', icon: Robot, page: 'scraper', desc: 'Lead Generation' },
    { label: 'Outreach', icon: PaperPlaneTilt, page: 'outreach', desc: 'Email Campaigns' },
    { label: 'Analytics', icon: ChartLine, page: 'analytics', desc: 'Deep Insights' },
    { label: 'Team', icon: UserList, page: 'team', desc: 'Team Management' },
    { label: 'Pipeline', icon: FunnelSimple, page: 'pipeline', desc: 'Sales Funnel' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
        <p className="text-muted-foreground">Quick overview of your intelligence system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="glass-panel-hover p-6 cursor-pointer"
                onClick={() => onNavigate(stat.page)}
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon size={24} weight="regular" className="text-gold" />
                  <ArrowRight size={16} className="text-muted-foreground" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Leads</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('leads')}
              className="text-gold hover:text-gold-muted"
            >
              View All
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
          <div className="space-y-3">
            {unansweredLeads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-[rgba(212,175,55,0.08)] transition-colors cursor-pointer border border-transparent hover:border-gold"
                onClick={() => onNavigate('leads')}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground truncate">{lead.company}</div>
                  <div className="text-xs text-muted-foreground">{lead.city}</div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <a 
                    href={`tel:${lead.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg hover:bg-gold hover:text-background transition-colors"
                  >
                    <Phone size={16} weight="bold" />
                  </a>
                  <a 
                    href={`mailto:${lead.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg hover:bg-gold hover:text-background transition-colors"
                  >
                    <EnvelopeSimple size={16} weight="bold" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickAccess.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={item.page}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onNavigate(item.page)}
                  className="p-4 rounded-xl bg-muted hover:bg-[rgba(212,175,55,0.12)] border border-transparent hover:border-gold transition-all group text-left"
                >
                  <Icon size={24} weight="regular" className="text-gold mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-semibold text-foreground mb-0.5">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </motion.button>
              )
            })}
          </div>
        </Card>
      </div>

      <Card className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">System Status</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Scraper', status: 'Ready', color: 'text-success' },
            { label: 'Pipeline', status: 'Active', color: 'text-success' },
            { label: 'AI Agent', status: 'Online', color: 'text-success' },
            { label: 'Database', status: 'Synced', color: 'text-success' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted"
            >
              <div className={`w-2 h-2 rounded-full ${item.color} animate-pulse`} />
              <div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="text-sm font-semibold text-foreground">{item.status}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
