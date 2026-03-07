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
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary via-bronze to-secondary p-[1px]"
            >
              <div className="w-full h-full rounded-lg bg-background flex items-center justify-center">
                <Sparkle size={20} className="text-primary" weight="fill" />
              </div>
            </motion.div>
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-primary glow-text-gold tracking-tight">
                XPS Intelligence
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
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
                  : 'text-secondary hover:text-foreground hover:bg-white/5'
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
              <div className="text-xs font-medium text-foreground">System Active</div>
              <div className="text-[10px] text-muted-foreground">v2.0.0 • Elite Mode</div>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
