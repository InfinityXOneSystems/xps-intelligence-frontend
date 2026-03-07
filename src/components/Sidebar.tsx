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
          <div className="relative flex items-center justify-center w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-br from-gradient-gold-start via-gradient-silver-mid to-gradient-gold-end opacity-50 blur-2xl animate-pulse-glow" />
            <div className="absolute inset-0 bg-gradient-to-tr from-gradient-silver-start via-gradient-gold-mid to-gradient-silver-end opacity-40 blur-xl animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-0">
              <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gold animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
              <div className="absolute top-4 right-3 w-1.5 h-1.5 rounded-full bg-silver animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
              <div className="absolute bottom-3 left-4 w-1.5 h-1.5 rounded-full bg-gold-muted animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0.8s' }} />
              <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-silver animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '1.2s' }} />
              <div className="absolute top-1/2 left-1 w-1.5 h-1.5 rounded-full bg-gold animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '1.6s' }} />
              <div className="absolute top-1/2 right-1 w-1.5 h-1.5 rounded-full bg-silver animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0.6s' }} />
              <div className="absolute top-6 right-6 w-1 h-1 rounded-full bg-gold animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-6 left-6 w-1 h-1 rounded-full bg-silver animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
            </div>
            <svg 
              viewBox="0 0 600 500" 
              className="w-full h-full relative z-10"
              style={{ filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.8)) drop-shadow(0 0 8px rgba(192,192,192,0.6))' }}
            >
              <defs>
                <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F4D03F" />
                  <stop offset="40%" stopColor="#E6C65C" />
                  <stop offset="100%" stopColor="#B8941E" />
                </linearGradient>
                <linearGradient id="banner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E8E8E8" />
                  <stop offset="50%" stopColor="#F5F5F5" />
                  <stop offset="100%" stopColor="#E8E8E8" />
                </linearGradient>
              </defs>
              <g transform="translate(300, 220)">
                <path d="M-150,-90 L-155,-100 L-150,-110 L-145,-100 L-140,-110 L-135,-100 L-130,-110 L-125,-95 L-120,-105 L-115,-90 L-110,-100 L-105,-85 L-100,-95 L-95,-80 L-90,-90 L-85,-75 L-80,-85 L-75,-70 L-70,-80 L-65,-65 L-60,-75 L-55,-60 L-50,-70 L-45,-55 L-40,-65 L-35,-50 L-30,-60" 
                  fill="#1A1A1A" stroke="#000000" strokeWidth="1" />
                <path d="M-30,-60 L-25,-45 L-20,-55 L-15,-40 L-10,-50 L-5,-35 L0,-45" 
                  fill="#1A1A1A" stroke="#000000" strokeWidth="1" />
                
                <path d="M150,-90 L155,-100 L150,-110 L145,-100 L140,-110 L135,-100 L130,-110 L125,-95 L120,-105 L115,-90 L110,-100 L105,-85 L100,-95 L95,-80 L90,-90 L85,-75 L80,-85 L75,-70 L70,-80 L65,-65 L60,-75 L55,-60 L50,-70 L45,-55 L40,-65 L35,-50 L30,-60" 
                  fill="#1A1A1A" stroke="#000000" strokeWidth="1" />
                <path d="M30,-60 L25,-45 L20,-55 L15,-40 L10,-50 L5,-35 L0,-45" 
                  fill="#1A1A1A" stroke="#000000" strokeWidth="1" />
                
                <path d="M-120,95 L-125,105 L-120,115 L-115,105 L-110,115 L-105,105 L-100,115 L-95,100 L-90,110 L-85,95 L-80,105 L-75,90 L-70,100 L-65,85 L-60,95 L-55,80 L-50,90 L-45,75 L-40,85 L-35,70 L-30,80 L-25,65 L-20,75 L-15,60 L-10,70 L-5,55 L0,65" 
                  fill="#1A1A1A" stroke="#000000" strokeWidth="1" />
                
                <path d="M120,95 L125,105 L120,115 L115,105 L110,115 L105,105 L100,115 L95,100 L90,110 L85,95 L80,105 L75,90 L70,100 L65,85 L60,95 L55,80 L50,90 L45,75 L40,85 L35,70 L30,80 L25,65 L20,75 L15,60 L10,70 L5,55 L0,65" 
                  fill="#1A1A1A" stroke="#000000" strokeWidth="1" />
                
                <path d="M-100,-80 L-75,-40 L-50,-80 L-25,-40 L0,-75 L0,15 L-50,55 L-100,15 Z" 
                  fill="url(#shield-gradient)" stroke="#2A2A2A" strokeWidth="5" />
                
                <path d="M100,-80 L75,-40 L50,-80 L25,-40 L0,-75 L0,15 L50,55 L100,15 Z" 
                  fill="url(#shield-gradient)" stroke="#2A2A2A" strokeWidth="5" />
                
                <rect x="-110" y="-75" width="220" height="140" rx="12" 
                  fill="url(#shield-gradient)" stroke="#2A2A2A" strokeWidth="6" />
                <circle cx="-80" cy="-55" r="5" fill="#2A2A2A" />
                <circle cx="80" cy="-55" r="5" fill="#2A2A2A" />
                <circle cx="-80" cy="45" r="5" fill="#2A2A2A" />
                <circle cx="80" cy="45" r="5" fill="#2A2A2A" />
                
                <text x="0" y="-15" textAnchor="middle" fill="#1A1A1A" fontSize="65" fontWeight="900" fontFamily="Impact, Arial Black, sans-serif" letterSpacing="2">
                  XPS
                </text>
                <text x="0" y="40" textAnchor="middle" fontSize="42" fontWeight="900" fontFamily="Impact, Arial Black, sans-serif" letterSpacing="1">
                  <tspan fill="url(#shield-gradient)" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9)' }}>XPRESS</tspan>
                </text>
                
                <path d="M-140,75 Q-100,60 -60,70 L-50,75 Q-40,78 -30,75 L-20,72 Q0,68 20,72 L30,75 Q40,78 50,75 L60,70 Q100,60 140,75" 
                  fill="url(#banner-gradient)" stroke="#2A2A2A" strokeWidth="3" />
                <path d="M-140,75 Q-100,90 -60,80 L-50,78 Q-40,76 -30,78 L-20,80 Q0,84 20,80 L30,78 Q40,76 50,78 L60,80 Q100,90 140,75" 
                  fill="url(#banner-gradient)" stroke="#2A2A2A" strokeWidth="3" />
                
                <text x="0" y="82" textAnchor="middle" fill="#1A1A1A" fontSize="20" fontWeight="700" fontFamily="Brush Script MT, cursive" fontStyle="italic" letterSpacing="1">
                  Floors For Life
                </text>
              </g>
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
