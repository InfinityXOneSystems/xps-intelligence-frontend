import { motion } from 'framer-motion'
import { 
  ChartBar, 
  Users, 
  Robot, 
  FunnelSimple, 
  PaperPlaneTilt,
  ChartLine,
  UserList,
  GearSix,
  Sparkle,
  Square
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  collapsed?: boolean
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: ChartBar },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'scraper', label: 'Scraper Control', icon: Robot },
  { id: 'canvas', label: 'Execution Canvas', icon: Square },
  { id: 'pipeline', label: 'Sales Pipeline', icon: FunnelSimple },
  { id: 'outreach', label: 'Outreach', icon: PaperPlaneTilt },
  { id: 'analytics', label: 'Analytics', icon: ChartLine },
  { id: 'team', label: 'Team', icon: UserList },
  { id: 'settings', label: 'Settings', icon: GearSix }
]

export function Sidebar({ currentPage, onNavigate, collapsed = false }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'bg-background h-full flex flex-col relative border-r border-border-subtle',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      <div className="relative p-6 border-b border-border-subtle">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gradient-gold-start via-gradient-silver-mid to-gradient-gold-end opacity-40 blur-xl animate-pulse-glow" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gradient-silver-start via-gradient-gold-mid to-gradient-silver-end opacity-30 blur-lg animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-0">
              <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-gold animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
              <div className="absolute top-4 right-3 w-1 h-1 rounded-full bg-silver animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
              <div className="absolute bottom-3 left-4 w-1 h-1 rounded-full bg-gold-muted animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0.8s' }} />
              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-silver animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '1.2s' }} />
              <div className="absolute top-1/2 left-1 w-1 h-1 rounded-full bg-gold animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '1.6s' }} />
              <div className="absolute top-1/2 right-1 w-1 h-1 rounded-full bg-silver animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0.6s' }} />
            </div>
            <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 drop-shadow-[0_0_12px_rgba(212,175,55,0.8)]">
              <defs>
                <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.82 0.15 70)" />
                  <stop offset="50%" stopColor="oklch(0.75 0.14 55)" />
                  <stop offset="100%" stopColor="oklch(0.68 0.12 45)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M100 20 L160 50 L160 110 C160 150 130 180 100 190 C70 180 40 150 40 110 L40 50 Z"
                fill="url(#shield-gradient)"
                stroke="oklch(0.90 0.18 75)"
                strokeWidth="3"
                filter="url(#glow)"
              />
              <text
                x="100"
                y="125"
                textAnchor="middle"
                fill="oklch(0.1 0 0)"
                fontSize="48"
                fontWeight="900"
                fontFamily="Impact, sans-serif"
                letterSpacing="-2"
              >
                XPS
              </text>
            </svg>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                XPS Intelligence
              </h1>
              <p className="text-[10px] text-secondary uppercase tracking-[0.15em]">
                Intelligence v4.2
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          
          return (
            <motion.button
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onNavigate(item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 relative',
                'text-sm font-semibold',
                isActive
                  ? 'bg-[rgba(212,175,55,0.12)] border border-gold text-foreground'
                  : 'text-secondary hover:text-foreground hover:bg-muted border border-transparent'
              )}
            >
              <Icon 
                size={20} 
                weight="regular"
                strokeWidth={1.5}
                className="relative z-10" 
              />
              {!collapsed && (
                <span className="relative z-10">{item.label}</span>
              )}
            </motion.button>
          )
        })}
      </nav>

      <div className="relative p-4 border-t border-border-subtle">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted border border-border-subtle">
          <div className="w-2 h-2 bg-gold rounded-full animate-pulse-glow" />
          {!collapsed && (
            <div className="flex-1">
              <div className="text-xs font-semibold text-white">System Active</div>
              <div className="text-[10px] text-secondary">Elite Mode</div>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
