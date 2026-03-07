import { motion } from 'framer-motion'
import { Lightning, Database, Envelope, Robot, Users, ChartLineUp } from '@phosphor-icons/react'

interface SystemIndicator {
  label: string
  value: string | number
  status: 'active' | 'idle' | 'warning'
  icon: typeof Lightning
}

interface TopBarProps {
  indicators?: SystemIndicator[]
}

const defaultIndicators: SystemIndicator[] = [
  { label: 'Scraper', value: 'Active', status: 'active', icon: Robot },
  { label: 'Pipeline', value: '47 Deals', status: 'active', icon: Database },
  { label: 'Emails Sent', value: '1,234', status: 'active', icon: Envelope },
  { label: 'Leads', value: '892', status: 'active', icon: Users },
  { label: 'AI Agent', value: 'Online', status: 'active', icon: Lightning },
]

export function TopBar({ indicators = defaultIndicators }: TopBarProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="glass-panel border-b border-white/10 px-6 py-4"
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 flex-1">
          {indicators.map((indicator, index) => {
            const Icon = indicator.icon
            const statusColor = 
              indicator.status === 'active' ? 'text-primary' :
              indicator.status === 'warning' ? 'text-yellow-500' :
              'text-muted-foreground'
            
            return (
              <motion.div
                key={indicator.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-primary/40 transition-all group"
              >
                <div className="relative">
                  <Icon size={16} className={statusColor} weight="fill" />
                  {indicator.status === 'active' && (
                    <motion.div
                      className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.6, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none">
                    {indicator.label}
                  </span>
                  <span className="text-xs font-medium text-foreground mt-0.5">
                    {indicator.value}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
        
        <div className="flex items-center gap-3">
          <motion.div
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/40"
            animate={{
              boxShadow: [
                '0 0 20px rgba(217, 179, 66, 0.2)',
                '0 0 30px rgba(217, 179, 66, 0.4)',
                '0 0 20px rgba(217, 179, 66, 0.2)',
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="flex items-center gap-2">
              <Lightning size={16} className="text-primary" weight="fill" />
              <span className="text-xs font-medium text-foreground">
                Mission Control Active
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
