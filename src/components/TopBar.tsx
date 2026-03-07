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
      className="bg-surface border-b border-border-subtle px-6 py-4"
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 flex-1">
          {indicators.map((indicator, index) => {
            const Icon = indicator.icon
            const statusColor = 
              indicator.status === 'active' ? 'text-gold' :
              indicator.status === 'warning' ? 'text-warning' :
              'text-muted-foreground'
            
            return (
              <motion.div
                key={indicator.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-card border border-border hover:border-border-hover transition-all duration-150"
              >
                <div className="relative">
                  <Icon size={16} className={statusColor} weight="regular" strokeWidth={1.5} />
                  {indicator.status === 'active' && (
                    <motion.div
                      className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gold rounded-full"
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
                  <span className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] leading-none font-semibold">
                    {indicator.label}
                  </span>
                  <span className="text-xs font-semibold text-foreground mt-0.5">
                    {indicator.value}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
        
        <div className="flex items-center gap-3">
          <motion.div
            className="px-4 py-2 rounded-xl border border-gold/40 bg-[rgba(212,175,55,0.08)]"
            animate={{
              boxShadow: [
                '0 0 14px rgba(212, 175, 55, 0.2)',
                '0 0 20px rgba(212, 175, 55, 0.3)',
                '0 0 14px rgba(212, 175, 55, 0.2)',
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="flex items-center gap-2">
              <Lightning size={16} className="text-gold" weight="fill" />
              <span className="text-xs font-semibold text-foreground">
                Mission Control Active
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
