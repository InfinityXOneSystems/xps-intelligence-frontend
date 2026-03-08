import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { BackButton } from '@/components/BackButton'

export function SettingsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="space-y-8">
      <BackButton onBack={() => onNavigate('home')} />
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-white/70 mt-1">Configure your dashboard preferences and system settings</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
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
