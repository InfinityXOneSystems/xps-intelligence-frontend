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
import logoImage from '@/assets/images/XPS-Logo-Transparent.webp'

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
          <motion.div 
            className="relative flex-shrink-0 w-20 h-20"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div 
              className="absolute inset-0 rounded-xl"
              animate={{
                background: [
                  'radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(192,192,192,0.15) 50%, rgba(212,175,55,0.25) 100%)',
                  'radial-gradient(circle, rgba(192,192,192,0.25) 0%, rgba(212,175,55,0.15) 50%, rgba(192,192,192,0.25) 100%)',
                  'radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(192,192,192,0.15) 50%, rgba(212,175,55,0.25) 100%)',
                ],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                filter: 'blur(16px)',
              }}
            />
            <motion.div 
              className="absolute inset-[-4px] rounded-xl"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(212,175,55,0.4), 0 0 40px rgba(212,175,55,0.2)',
                  '0 0 25px rgba(192,192,192,0.4), 0 0 45px rgba(192,192,192,0.2)',
                  '0 0 20px rgba(212,175,55,0.4), 0 0 40px rgba(212,175,55,0.2)',
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="relative z-10 flex items-center justify-center w-full h-full"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <motion.img 
                src={logoImage}
                alt="XPS XPRESS Logo"
                className="w-full h-full object-contain"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.4)) drop-shadow(0 0 4px rgba(192,192,192,0.3))'
                }}
                animate={{
                  filter: [
                    'drop-shadow(0 0 8px rgba(212,175,55,0.4)) drop-shadow(0 0 4px rgba(192,192,192,0.3))',
                    'drop-shadow(0 0 10px rgba(192,192,192,0.5)) drop-shadow(0 0 6px rgba(212,175,55,0.3))',
                    'drop-shadow(0 0 8px rgba(212,175,55,0.4)) drop-shadow(0 0 4px rgba(192,192,192,0.3))',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <Sparkle 
              className="absolute -top-1 -right-1 text-gold"
              size={14}
              weight="fill"
            />
            <motion.div
              className="absolute -bottom-1 -left-1"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkle 
                className="text-silver"
                size={12}
                weight="fill"
              />
            </motion.div>
          </motion.div>
          {!collapsed && (
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.h1 
                className="text-lg font-bold text-white tracking-tight leading-tight"
                animate={{
                  textShadow: [
                    '0 0 10px rgba(212,175,55,0.3)',
                    '0 0 15px rgba(192,192,192,0.4)',
                    '0 0 10px rgba(212,175,55,0.3)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                XPS Intelligence
              </motion.h1>
            </motion.div>
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
