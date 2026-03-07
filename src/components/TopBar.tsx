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
      <div className="flex items-center justify-end max-w-[1800px] mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-lg border border-border-subtle hover:border-gold/50 transition-all"
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
