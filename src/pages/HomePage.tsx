import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Phone, 
  Envelope,
  Star,
  Clock
} from '@phosphor-icons/react'
import type { Lead } from '@/types/lead'
import logoImage from '@/assets/images/XPS-Logo-Transparent.webp'
import { cn } from '@/lib/utils'

interface HomePageProps {
  leads: Lead[]
  onNavigate: (page: string) => void
}

export function HomePage({ leads, onNavigate }: HomePageProps) {
  const recentLeads = leads.slice(0, 10)
  const newLeads = leads.filter(l => l.isNew || l.status === 'new')
  const greenLeads = leads.filter(l => l.priority === 'green' || l.status === 'signed')
  const yellowLeads = leads.filter(l => l.priority === 'yellow' || l.status === 'contacted')
  const redLeads = leads.filter(l => l.priority === 'red')

  const getPriorityColor = (lead: Lead) => {
    if (lead.status === 'signed' || lead.priority === 'green') return 'priority-green'
    if (lead.priority === 'yellow' || lead.status === 'contacted') return 'priority-yellow'
    if (lead.priority === 'red') return 'priority-red'
    return ''
  }

  return (
    <div className="space-y-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-8 py-16"
      >
        <div className="relative w-48 h-48">
          <div 
            className="absolute inset-0 rounded-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(234,179,8,0.10) 50%, transparent 100%)',
              filter: 'blur(30px)',
            }}
          />
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <img 
              src={logoImage}
              alt="XPS XPRESS Logo"
              className="w-full h-full object-contain"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(34,197,94,0.4)) drop-shadow(0 0 10px rgba(234,179,8,0.3))'
              }}
            />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">XPS INTELLIGENCE</h1>
          <p className="text-xl text-muted-foreground">Lead Management System</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.button
          onClick={() => onNavigate('leads')}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 rounded-2xl text-center group cursor-pointer border-2 border-border hover:border-success transition-all"
        >
          <div className="text-5xl font-bold text-success mb-2">{leads.length}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wide">Total Leads</div>
        </motion.button>

        <motion.button
          onClick={() => onNavigate('leads')}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 rounded-2xl text-center group cursor-pointer border-2 border-border hover:border-success transition-all"
        >
          <div className="text-5xl font-bold text-success mb-2">{greenLeads.length}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wide">Green (Positive)</div>
        </motion.button>

        <motion.button
          onClick={() => onNavigate('leads')}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 rounded-2xl text-center group cursor-pointer border-2 border-border hover:border-warning transition-all"
        >
          <div className="text-5xl font-bold text-warning mb-2">{yellowLeads.length}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wide">Yellow (Pending)</div>
        </motion.button>

        <motion.button
          onClick={() => onNavigate('leads')}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8 rounded-2xl text-center group cursor-pointer border-2 border-border hover:border-destructive transition-all"
        >
          <div className="text-5xl font-bold text-destructive mb-2">{redLeads.length}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wide">Red (Late/Missed)</div>
        </motion.button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Recent Leads</h2>
          <Button
            onClick={() => onNavigate('leads')}
            variant="outline"
            size="lg"
            className="border-success text-success hover:bg-success hover:text-white"
          >
            View All Leads
          </Button>
        </div>

        {recentLeads.length === 0 ? (
          <Card className="glass-card p-16 text-center">
            <p className="text-muted-foreground text-lg mb-6">No leads yet. Start by searching for prospects.</p>
            <Button
              onClick={() => onNavigate('prospects')}
              className="bg-success hover:bg-success/90"
            >
              Go to Prospects
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {recentLeads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn('glass-card p-6 cursor-pointer hover:scale-[1.01] transition-transform', getPriorityColor(lead))}
                  onClick={() => onNavigate('leads')}
                >
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 flex-1">
                      {lead.isNew && <Star size={24} weight="fill" className="text-warning" />}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{lead.company}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground">{lead.city}{lead.state ? `, ${lead.state}` : ''}</span>
                          {lead.assignedInitials && (
                            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-mono font-bold">
                              {lead.assignedInitials}
                            </span>
                          )}
                          {lead.lastTouchedAt && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock size={14} />
                              {new Date(lead.lastTouchedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <a 
                        href={`tel:${lead.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-3 rounded-xl bg-success/10 hover:bg-success hover:text-white transition-colors"
                      >
                        <Phone size={20} weight="fill" />
                      </a>
                      <a 
                        href={`mailto:${lead.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-3 rounded-xl bg-primary/10 hover:bg-primary hover:text-white transition-colors"
                      >
                        <Envelope size={20} weight="fill" />
                      </a>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
