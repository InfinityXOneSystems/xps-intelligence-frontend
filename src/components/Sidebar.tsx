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
          <div className="relative flex items-center justify-center w-full h-40">
            <div className="absolute inset-0 bg-gradient-to-br from-gradient-gold-start via-gradient-silver-mid to-gradient-gold-end opacity-60 blur-3xl animate-pulse-glow" />
            <div className="absolute inset-0 bg-gradient-to-tr from-gradient-silver-start via-gradient-gold-mid to-gradient-silver-end opacity-50 blur-2xl animate-[spin_8s_linear_infinite]" />
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
            <div className="relative z-10 flex items-center justify-center w-full h-full p-3">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDUwMCA0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPCEtLSBMZWZ0IFdpbmcgLS0+CiAgPHBhdGggZD0iTTEwMCwxMDAgTDE1MCw2MCBMMTgwLDgwIEwxOTAsNjAgTDIwMCw3MCBMMjEwLDUwIEwyMjAsNjAgTDI0MCw0MCBMMjYwLDYwIEwyODAsNDAgTDMwMCw2MCBMMzEwLDUwIEwzMjAsNzAgTDMzMCw2MCBMMzYwLDgwIEwzOTAsNjAgTDQ0MCwxMDAgTDQ0MCwzMDAgTDM5MCwzNDAgTDM2MCwzMjAgTDMzMCwzNDAgTDMyMCwzMzAgTDMxMCwzNTAgTDMwMCwzNDAgTDI4MCwzNjAgTDI2MCwzNDAgTDI0MCwzNjAgTDIyMCwzNDAgTDIxMCwzNTAgTDIwMCwzMzAgTDE5MCwzNDAgTDE4MCwzMjAgTDE1MCwzNDAgTDEwMCwzMDAiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iI0Q0QUYzNyIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgCiAgPCEtLSBTaGllbGQgLS0+CiAgPHBhdGggZD0iTTE3MCwxNDAgTDI1MCwxMDAgTDMzMCwxNDAgTDM0MCwyMjAgTDI3MCwyODAgTDIwMCwyMjAgWiIgZmlsbD0iI0Q0QUYzNyIgc3Ryb2tlPSIjMkEyOTI2IiBzdHJva2Utd2lkdGg9IjQiLz4KICAKICA8IS0tIFNoaWVsZCBCYW5kcyAtLT4KICA8cmVjdCB4PSIxNjAiIHk9IjE0NSIgd2lkdGg9IjE4MCIgaGVpZ2h0PSI4IiBmaWxsPSIjMkEyOTI2IiByeD0iMiIvPgogIDxyZWN0IHg9IjE2MCIgeT0iMjY3IiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjgiIGZpbGw9IiMyQTI5MjYiIHJ4PSIyIi8+CiAgCiAgPCEtLSBYUFMgVGV4dCAtLT4KICA8dGV4dCB4PSIyNzAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IidNb250c2VycmF0JywgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDgiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMDAwMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5YUFM8L3RleHQ+CiAgCiAgPCEtLSBYUFJFU1MgVGV4dCAtLT4KICA8dGV4dCB4PSIyNzAiIHk9IjI0MCIgZm9udC1mYW1pbHk9IidNb250c2VycmF0JywgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRDRBRjM3IiBzdHJva2U9IiMyQTI5MjYiIHN0cm9rZS13aWR0aD0iMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+WFBSRVNTPC90ZXh0PgogIAogIDwhLS0gTGVmdCBSaWJib24gLS0+CiAgPHBhdGggZD0iTTE0MCwyODUgUTE4MCwyNzUgMjIwLDI4NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRTVFNUU1IiBzdHJva2Utd2lkdGg9IjMiLz4KICA8cGF0aCBkPSJNMTQwLDI5MCBRMTgwLDI4MCAyMjAsMjkwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGNUY1RjUiIHN0cm9rZS13aWR0aD0iMiIvPgogIAogIDwhLS0gUmlnaHQgUmliYm9uIC0tPgogIDxwYXRoIGQ9Ik0zMjAsMjg1IFEzNjAsMjc1IDQwMCwyODUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0U1RTVFNSIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPHBhdGggZD0iTTMyMCwyOTAgUTM2MCwyODAgNDAwLDI5MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRjVGNUY1IiBzdHJva2Utd2lkdGg9IjIiLz4KICAKICA8IS0tIEZsb29ycyBGb3IgTGlmZSAtLT4KICA8dGV4dCB4PSIyNzAiIHk9IjMxNSIgZm9udC1mYW1pbHk9IidDb3VyaWVyIE5ldycsICdjdXJzaXZlJywgc2VyaWYiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtc3R5bGU9Iml0YWxpYyIgZmlsbD0iIzMzMzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Rmxvb3JzIEZvciBMaWZlPC90ZXh0PgogIAogIDwhLS0gQm90dG9tIFdpbmcgLS0+CiAgPHBhdGggZD0iTTI3MCwzMjAgTDI1MCwzMzAgTDI0MCwzNjAgTDI2MCwzNzAgTDI3MCwzNTAgTDI4MCwzNzAgTDMwMCwzNjAgTDI5MCwzMzAgWiIgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjRDRBRjM3IiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+"
                alt="XPS XPRESS Logo"
                className="w-full h-full object-contain"
                style={{
                  filter: 'drop-shadow(0 0 25px rgba(212,175,55,0.7)) drop-shadow(0 0 45px rgba(192,192,192,0.4))'
                }}
              />
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
