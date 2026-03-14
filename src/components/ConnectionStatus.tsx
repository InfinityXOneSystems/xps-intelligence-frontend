import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiHigh, WifiSlash, Circle } from '@phosphor-icons/react'
import { api } from '@/lib/api'

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null)
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    const checkConnection = async () => {
      const available = await api.checkHealth()
      setIsOnline(available)
      
      if (!available) {
        setShowStatus(true)
      }
    }

    checkConnection()

    const interval = setInterval(checkConnection, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (showStatus) {
      const timer = setTimeout(() => setShowStatus(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showStatus, isOnline])

  if (isOnline === null || (!showStatus && isOnline)) return null

  return (
    <AnimatePresence>
      {(showStatus || !isOnline) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-6 z-50"
        >
          <div
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full
              backdrop-blur-md shadow-lg border
              ${isOnline 
                ? 'bg-success/10 border-success/20 text-success' 
                : 'bg-destructive/10 border-destructive/20 text-destructive'
              }
            `}
          >
            {isOnline ? (
              <>
                <WifiHigh weight="bold" className="w-4 h-4" />
                <span className="text-sm font-medium">Connected to backend</span>
                <Circle weight="fill" className="w-2 h-2 animate-pulse" />
              </>
            ) : (
              <>
                <WifiSlash weight="bold" className="w-4 h-4" />
                <span className="text-sm font-medium">Offline - Using local data</span>
                <Circle weight="fill" className="w-2 h-2" />
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
