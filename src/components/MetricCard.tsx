import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendUp, TrendDown } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon?: React.ReactNode
  delay?: number
}

export function MetricCard({ title, value, change, icon, delay = 0 }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const targetValue = typeof value === 'number' ? value : parseInt(value.toString().replace(/[^0-9]/g, '')) || 0

  useEffect(() => {
    if (typeof value !== 'number') return
    
    const duration = 1000
    const steps = 30
    const increment = targetValue / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current += increment
      if (step >= steps) {
        setDisplayValue(targetValue)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [targetValue, value])

  const formattedValue = typeof value === 'number' ? displayValue.toLocaleString() : value

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="glass-panel p-6 rounded-2xl cursor-pointer relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <motion.div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground mt-3 glow-text-gold">
            {formattedValue}
          </p>
          {change !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.2 }}
              className="flex items-center gap-1.5 mt-3"
            >
              {change >= 0 ? (
                <TrendUp size={14} className="text-green-400" weight="bold" />
              ) : (
                <TrendDown size={14} className="text-red-400" weight="bold" />
              )}
              <span
                className={cn(
                  'text-xs font-semibold',
                  change >= 0 ? 'text-green-400' : 'text-red-400'
                )}
              >
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </motion.div>
          )}
        </div>
        {icon && (
          <motion.div
            className="text-primary/60 group-hover:text-primary transition-colors duration-300"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  )
}
