import { motion } from 'framer-motion'
import { 
  ChartBar, 
  Users, 
  Robot, 
  FunnelSimple, 
  PaperPlaneTilt,
  ChartLine,
  UserList,
  GearSix
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
      className={cn(
        'glass-card h-full flex flex-col border-r border-border/50',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-4 border-b border-border/50">
        <h1 className="text-xl font-bold glow-text text-primary">
          {collapsed ? 'XPS' : 'XPS Intelligence'}
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                'text-sm font-medium',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_rgba(217,179,66,0.2)]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
              {!collapsed && <span>{item.label}</span>}
            </motion.button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="text-xs text-muted-foreground">
          {!collapsed && 'v1.0.0 • Lead Sniper AI'}
        </div>
      </div>
    </motion.aside>
  )
}
