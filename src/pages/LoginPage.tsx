import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import logoImage from '@/assets/images/XPS-Logo-Transparent.webp'

interface LoginPageProps {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      setIsLoading(true)
      setLoadingProgress(0)
      
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 100)

      setTimeout(() => {
        clearInterval(interval)
        setLoadingProgress(100)
        setTimeout(() => {
          onLogin()
        }, 300)
      }, 1200)
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#000000' }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(212,175,55,0.12),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgba(192,192,192,0.09),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_90%,rgba(183,112,40,0.08),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_80%,rgba(139,0,35,0.06),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(212,175,55,0.03)_0%,transparent_30%,rgba(192,192,192,0.02)_60%,transparent_100%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        className="relative w-full max-w-md mx-4"
      >
        <div 
          className="glass-card rounded-3xl p-8 sm:p-10"
          style={{
            background: 'rgba(0, 0, 0, 0.60)',
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            border: '1px solid rgba(212, 175, 55, 0.20)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
        >
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-24 h-24 mb-6">
              <div 
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(192,192,192,0.1) 50%, transparent 100%)',
                  filter: 'blur(12px)',
                }}
              />
              <div className="relative z-10 flex items-center justify-center w-full h-full">
                <img 
                  src={logoImage}
                  alt="XPS XPRESS Logo"
                  className="w-full h-full object-contain"
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.3)) drop-shadow(0 0 3px rgba(192,192,192,0.2))'
                  }}
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
              XPS Intelligence
            </h1>
            <p className="text-muted-foreground text-center text-sm">
              Enterprise-grade intelligence platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                style={{
                  background: 'rgba(0, 0, 0, 0.50)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderColor: 'rgba(212, 175, 55, 0.20)',
                }}
                className="h-12 text-white placeholder:text-muted-foreground border-2 transition-all duration-200 hover:border-[oklch(0.88_0.20_95)] hover:shadow-[0_0_20px_rgba(255,223,0,0.25)] focus-visible:border-[oklch(0.90_0.21_93)] focus-visible:shadow-[0_0_28px_rgba(255,223,0,0.35)] disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  style={{
                    background: 'rgba(0, 0, 0, 0.50)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderColor: 'rgba(212, 175, 55, 0.20)',
                  }}
                  className="h-12 text-white placeholder:text-muted-foreground pr-12 border-2 transition-all duration-200 hover:border-[oklch(0.88_0.20_95)] hover:shadow-[0_0_20px_rgba(255,223,0,0.25)] focus-visible:border-[oklch(0.90_0.21_93)] focus-visible:shadow-[0_0_28px_rgba(255,223,0,0.35)] disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeSlash size={20} weight="regular" />
                  ) : (
                    <Eye size={20} weight="regular" />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium">Authenticating...</span>
                    <span>{loadingProgress}%</span>
                  </div>
                  <Progress value={loadingProgress} className="h-1.5" />
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 font-semibold rounded-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(255,223,0,0.45)] disabled:opacity-70 disabled:hover:scale-100"
              style={{
                background: 'linear-gradient(135deg, oklch(0.92 0.22 95) 0%, oklch(0.88 0.01 0) 50%, oklch(0.92 0.22 95) 100%)',
                color: '#1a1a1a',
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-xl text-xs"
        style={{
          background: 'rgba(0, 0, 0, 0.50)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 175, 55, 0.12)',
        }}
      >
        <span className="text-muted-foreground">XPS Intelligence Platform</span>
        <div className="h-3 w-px bg-border-subtle" />
        <span className="text-gold font-medium">v4.2.0</span>
      </motion.div>
    </div>
  )
}
