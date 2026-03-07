import { motion } from 'framer-motion'
import { Lightning, Database, Envelope, Robot, Users } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SystemIndicator {
  label: string
  value: string | number
  status: 'active' | 'idle' | 'warning'
  icon: typeof Lightning
  description: string
}

const systemIndicators: SystemIndicator[] = [
  { 
    label: 'Scraper', 
    value: 'Active', 
    status: 'active', 
    icon: Robot,
    description: 'Lead scraping system is currently running'
  },
  { 
    label: 'Pipeline', 
    value: '47 Deals', 
    status: 'active', 
    icon: Database,
    description: 'Active deals in the sales pipeline'
  },
  { 
    label: 'Emails Sent', 
    value: '1,234', 
    status: 'active', 
    icon: Envelope,
    description: 'Total outreach emails sent'
  },
  { 
    label: 'Leads Discovered', 
    value: '892', 
    status: 'active', 
    icon: Users,
    description: 'Total leads in the database'
  },
  { 
    label: 'AI Agent', 
    value: 'Online', 
    status: 'active', 
    icon: Lightning,
    description: 'Lead Sniper AI assistant is online'
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'oklch(0.42 0.14 20)'
    case 'warning':
      return 'oklch(0.68 0.13 50)'
    case 'idle':
      return 'oklch(0.62 0.03 250)'
    default:
      return 'oklch(0.62 0.03 250)'
  }
}

export function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-white/70 mt-1">Configure your dashboard preferences and system settings</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-white">System Status</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {systemIndicators.map((indicator, index) => {
            const Icon = indicator.icon
            return (
              <motion.div
                key={indicator.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className="p-5 hover:border-border-hover transition-all"
                  style={{
                    background: 'var(--card)',
                    backdropFilter: 'blur(32px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className="p-2.5 rounded-lg"
                        style={{
                          background: `${getStatusColor(indicator.status)}20`,
                        }}
                      >
                        <Icon 
                          size={20} 
                          weight="duotone"
                          style={{ color: getStatusColor(indicator.status) }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{indicator.label}</h3>
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{
                              borderColor: getStatusColor(indicator.status),
                              color: getStatusColor(indicator.status),
                            }}
                          >
                            {indicator.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/70 mb-2">
                          {indicator.description}
                        </p>
                        <div
                          className="text-2xl font-bold"
                          style={{
                            color: getStatusColor(indicator.status),
                          }}
                        >
                          {indicator.value}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-white">General Settings</h2>
        <Card 
          className="p-6"
          style={{
            background: 'var(--card)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <p className="text-white/70">
            Additional settings coming soon
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
