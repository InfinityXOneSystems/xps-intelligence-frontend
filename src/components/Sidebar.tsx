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
        <div className="flex flex-col gap-4">
          <div className="relative flex items-center justify-center w-full h-32">
            <div className="absolute inset-0 bg-gradient-to-br from-gradient-gold-start via-gradient-silver-mid to-gradient-gold-end opacity-50 blur-2xl animate-pulse-glow" />
            <div className="absolute inset-0 bg-gradient-to-tr from-gradient-silver-start via-gradient-gold-mid to-gradient-silver-end opacity-40 blur-xl animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-0">
              <div className="absolute top-2 left-8 w-2 h-2 rounded-full bg-gold animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
              <div className="absolute top-6 right-12 w-1.5 h-1.5 rounded-full bg-silver animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
              <div className="absolute bottom-4 left-12 w-1.5 h-1.5 rounded-full bg-gold-muted animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0.8s' }} />
              <div className="absolute bottom-2 right-8 w-2 h-2 rounded-full bg-silver animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '1.2s' }} />
              <div className="absolute top-1/2 left-4 w-1.5 h-1.5 rounded-full bg-gold animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '1.6s' }} />
              <div className="absolute top-1/2 right-4 w-1.5 h-1.5 rounded-full bg-silver animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0.6s' }} />
              <div className="absolute top-8 right-16 w-1 h-1 rounded-full bg-gold animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-8 left-16 w-1 h-1 rounded-full bg-silver animate-[sparkle_2s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
            </div>
            <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold/10 via-transparent to-silver/10 rounded-lg border border-gold/20 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-4xl font-black text-gold mb-1" style={{ textShadow: '0 0 20px rgba(212,175,55,0.6), 0 0 40px rgba(192,192,192,0.3)' }}>
                    XPS
                  </div>
                  <div className="text-lg font-bold bg-gradient-to-r from-gold via-gold-muted to-silver bg-clip-text text-transparent">
                    XPRESS
                  </div>
                  <div className="text-[10px] text-silver/80 italic mt-0.5">
                    Floors For Life
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!collapsed && (
            <div className="text-center">
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
