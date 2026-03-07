import { motion } from 'framer-motion'
import { Lightning, Database, Envelope, Robot, Users, Sun, Moon } from '@phosphor-icons/react'
import { useTheme } from '@/hooks/use-theme'
import { Button } from '@/components/ui/button'

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
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="border-b border-border-subtle px-8 py-3"
      style={{
        background: 'var(--card)',
        backdropFilter: 'blur(40px) saturate(200%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
      }}
    >
      <div className="flex items-center justify-between max-w-[1800px] mx-auto">
        <div className="flex items-center gap-3 flex-1 justify-center">
          {indicators.map((indicator, index) => {
            const Icon = indicator.icon
            const statusColor = 
              indicator.status === 'active' ? 'text-gold' :
              indicator.status === 'warning' ? 'text-warning' :
              'text-muted-foreground'
            
            return (
              <motion.div
                key={indicator.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border-subtle hover:border-gold/50 transition-all duration-200 group"
                style={{
                  background: 'var(--card)',
                  backdropFilter: 'blur(20px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                }}
              >
                <div className="relative">
                  <Icon size={18} className={`${statusColor} transition-transform duration-200 group-hover:scale-110`} weight="duotone" />
                  {indicator.status === 'active' && (
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
                  )}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs text-muted-foreground font-medium">
                    {indicator.label}
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {indicator.value}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="ml-4 rounded-lg border border-border-subtle hover:border-gold/50 transition-all"
          style={{
            background: 'var(--card)',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          }}
        >
          {theme === 'dark' ? (
            <Sun size={18} weight="duotone" className="text-gold" />
          ) : (
            <Moon size={18} weight="duotone" className="text-gold" />
          )}
        </Button>
      </div>
    </motion.div>
  )
}
