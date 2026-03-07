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
        'glass-panel h-full flex flex-col relative',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      <div className="relative p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-16 h-16">
            <div className="absolute inset-0 rounded-lg" style={{ boxShadow: 'var(--glow-gold)' }} />
            <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 drop-shadow-[0_0_8px_rgba(217,179,66,0.6)]">
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
              <p className="text-[10px] text-white/60 uppercase tracking-wider">
                AI Operating System
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
              whileHover={{ x: 6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group',
                'text-sm font-medium',
                isActive
                  ? 'gradient-gold-animated text-background shadow-[0_0_25px_rgba(217,179,66,0.4)]'
                  : 'text-white hover:text-white hover:bg-white/5'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon 
                size={20} 
                weight={isActive ? 'fill' : 'regular'} 
                className={cn(
                  'relative z-10',
                  !isActive && 'group-hover:text-primary transition-colors'
                )} 
              />
              {!collapsed && (
                <span className="relative z-10">{item.label}</span>
              )}
              {!isActive && (
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 glow-border-silver" />
              )}
            </motion.button>
          )
        })}
      </nav>

      <div className="relative p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
          {!collapsed && (
            <div className="flex-1">
              <div className="text-xs font-medium text-white">System Active</div>
              <div className="text-[10px] text-white/60">v2.0.0 • Elite Mode</div>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
