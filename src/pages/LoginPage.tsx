import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import logoImage from '@/assets/images/XPS-Logo-Transparent.webp'

interface LoginPageProps {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      onLogin()
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(212,175,55,0.12),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgba(192,192,192,0.09),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_90%,rgba(183,112,40,0.08),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_80%,rgba(139,0,35,0.06),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(212,175,55,0.03)_0%,transparent_30%,rgba(192,192,192,0.02)_60%,transparent_100%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md mx-4"
      >
        <div 
          className="glass-card rounded-3xl p-8 sm:p-10"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 223, 0, 0.08) 0%, rgba(255, 255, 255, 0.06) 50%, rgba(255, 223, 0, 0.04) 100%)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            border: '1px solid var(--border-subtle)',
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
            <p className="text-muted-foreground text-center">
              Sign in to access your intelligence dashboard
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
                style={{
                  background: 'rgba(0, 0, 0, 0.50)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderColor: 'rgba(212, 175, 55, 0.20)',
                }}
                className="h-12 text-white placeholder:text-muted-foreground border-2 transition-all duration-200 hover:border-[oklch(0.88_0.20_95)] hover:shadow-[0_0_20px_rgba(255,223,0,0.25)] focus-visible:border-[oklch(0.90_0.21_93)] focus-visible:shadow-[0_0_28px_rgba(255,223,0,0.35)]"
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
                  style={{
                    background: 'rgba(0, 0, 0, 0.50)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderColor: 'rgba(212, 175, 55, 0.20)',
                  }}
                  className="h-12 text-white placeholder:text-muted-foreground pr-12 border-2 transition-all duration-200 hover:border-[oklch(0.88_0.20_95)] hover:shadow-[0_0_20px_rgba(255,223,0,0.25)] focus-visible:border-[oklch(0.90_0.21_93)] focus-visible:shadow-[0_0_28px_rgba(255,223,0,0.35)]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors"
                >
                  {showPassword ? (
                    <EyeSlash size={20} weight="regular" />
                  ) : (
                    <Eye size={20} weight="regular" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-semibold rounded-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(255,223,0,0.45)]"
              style={{
                background: 'linear-gradient(135deg, oklch(0.94 0.22 95) 0%, oklch(0.90 0.20 88) 35%, oklch(0.95 0.23 93) 100%)',
                color: '#1a1a1a',
              }}
            >
              Sign In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
