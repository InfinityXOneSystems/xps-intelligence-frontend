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
            <div className="absolute inset-0 bg-gradient-to-br from-gradient-gold-start via-gradient-silver-mid to-gradient-gold-end opacity-40 blur-xl animate-pulse-glow" />
            <div className="absolute inset-0 bg-gradient-to-tr from-gradient-silver-start via-gradient-gold-mid to-gradient-silver-end opacity-30 blur-lg animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-0">
              <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-gold animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
              <div className="absolute top-4 right-3 w-1 h-1 rounded-full bg-silver animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
              <div className="absolute bottom-3 left-4 w-1 h-1 rounded-full bg-gold-muted animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0.8s' }} />
              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-silver animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '1.2s' }} />
              <div className="absolute top-1/2 left-1 w-1 h-1 rounded-full bg-gold animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '1.6s' }} />
              <div className="absolute top-1/2 right-1 w-1 h-1 rounded-full bg-silver animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0.6s' }} />
            </div>
            <svg 
              viewBox="0 0 500 400" 
              className="w-full h-full relative z-10 drop-shadow-[0_0_16px_rgba(212,175,55,0.9)]"
              style={{ filter: 'drop-shadow(0 0 8px rgba(192,192,192,0.6))' }}
            >
              <g transform="translate(250, 200)">
                <path d="M-120,-80 L-140,-100 L-135,-105 L-130,-95 L-125,-105 L-115,-95 L-110,-105 L-105,-95 L-100,-105 L-90,-90 L-85,-100 L-80,-85 L-75,-95 L-70,-85 L-65,-90 L-60,-75" 
                  fill="#000000" stroke="none" />
                <path d="M-60,-75 L-55,-70 L-50,-75 L-45,-65 L-40,-70 L-35,-60 L-30,-65 L-25,-55 L-20,-60 L-15,-50 L-10,-55 L-5,-45 L0,-50" 
                  fill="#000000" stroke="none" />
                
                <path d="M120,-80 L140,-100 L135,-105 L130,-95 L125,-105 L115,-95 L110,-105 L105,-95 L100,-105 L90,-90 L85,-100 L80,-85 L75,-95 L70,-85 L65,-90 L60,-75" 
                  fill="#000000" stroke="none" />
                <path d="M60,-75 L55,-70 L50,-75 L45,-65 L40,-70 L35,-60 L30,-65 L25,-55 L20,-60 L15,-50 L10,-55 L5,-45 L0,-50" 
                  fill="#000000" stroke="none" />
                
                <path d="M-80,40 L-100,60 L-95,65 L-90,55 L-85,65 L-75,55 L-70,65 L-65,55 L-60,65 L-50,50 L-45,60 L-40,45 L-35,55 L-30,45 L-25,50 L-20,35" 
                  fill="#000000" stroke="none" />
                <path d="M-20,35 L-15,30 L-10,35 L-5,25 L0,30" 
                  fill="#000000" stroke="none" />
                
                <path d="M80,40 L100,60 L95,65 L90,55 L85,65 L75,55 L70,65 L65,55 L60,65 L50,50 L45,60 L40,45 L35,55 L30,45 L25,50 L20,35" 
                  fill="#000000" stroke="none" />
                <path d="M20,35 L15,30 L10,35 L5,25 L0,30" 
                  fill="#000000" stroke="none" />
                
                <defs>
                  <linearGradient id="xps-logo-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F4D03F" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#B8941E" />
                  </linearGradient>
                </defs>
                
                <path d="M-70,-60 L-20,20 L-50,20 Z M-20,-60 L-70,20 L-40,20 Z" 
                  fill="url(#xps-logo-gradient)" stroke="#1A1A1A" strokeWidth="3" />
                
                <path d="M70,-60 L20,20 L50,20 Z M20,-60 L70,20 L40,20 Z" 
                  fill="url(#xps-logo-gradient)" stroke="#1A1A1A" strokeWidth="3" />
                
                <rect x="-70" y="-60" width="140" height="100" rx="8" 
                  fill="url(#xps-logo-gradient)" stroke="#1A1A1A" strokeWidth="4" />
                
                <text x="0" y="-15" textAnchor="middle" fill="#1A1A1A" fontSize="56" fontWeight="900" fontFamily="Impact, Arial Black, sans-serif">
                  XPS
                </text>
                <text x="0" y="25" textAnchor="middle" fill="#D4AF37" fontSize="32" fontWeight="900" fontFamily="Impact, Arial Black, sans-serif" 
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                  XPRESS
                </text>
                
                <path d="M-100,-70 Q-80,-90 -50,-85 L-40,-75" 
                  fill="none" stroke="#E8E8E8" strokeWidth="2" />
                <path d="M100,-70 Q80,-90 50,-85 L40,-75" 
                  fill="none" stroke="#E8E8E8" strokeWidth="2" />
                
                <ellipse cx="-80" cy="45" rx="120" ry="12" 
                  fill="#E8E8E8" opacity="0.9" />
                <text x="-80" y="50" textAnchor="middle" fill="#1A1A1A" fontSize="18" fontWeight="700" fontFamily="Brush Script MT, cursive" fontStyle="italic">
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
