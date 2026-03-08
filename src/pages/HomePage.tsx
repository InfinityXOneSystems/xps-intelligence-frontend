import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Envelope, Star, Clock, TrendUp } from '@phosphor-icons/react'
import type { Lead } from '@/types/lead'

interface HomePageProps {
  leads: Lead[]
  onNavigate: (page: string) => void
}

export function HomePage({ leads, onNavigate }: HomePageProps) {
  const greenLeads = leads.filter(lead => lead.priority === 'green')
  const yellowLeads = leads.filter(lead => lead.priority === 'yellow')
  const redLeads = leads.filter(lead => lead.priority === 'red')
  
  const recentLeads = leads
    .filter(lead => lead.status === 'new' || lead.isNew)
    .slice(0, 3)

  return (
    <div className="space-y-12 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div 
          className="inline-block mb-6"
          style={{
            padding: '2rem',
            borderRadius: '2rem',
            background: 'linear-gradient(135deg, var(--gradient-gold-start), var(--gradient-gold-end))',
          }}
        >
          <img 
            src="/xps-logo.svg"
            alt="XPS XPRESS Logo"
            className="h-16 w-auto"
            style={{
              filter: 'brightness(0) invert(1)'
            }}
          />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          XPS INTELLIGENCE
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          AI Operating System for Lead Intelligence
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.button
          onClick={() => onNavigate('leads')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 rounded-2xl text-center cursor-pointer"
        >
          <div className="text-5xl font-bold text-success mb-2">{greenLeads.length}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Green Priority</div>
        </motion.button>

        <motion.button
          onClick={() => onNavigate('leads')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 rounded-2xl text-center cursor-pointer"
        >
          <div className="text-5xl font-bold text-warning mb-2">{yellowLeads.length}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Yellow Priority</div>
        </motion.button>

        <motion.button
          onClick={() => onNavigate('leads')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 rounded-2xl text-center cursor-pointer"
        >
          <div className="text-5xl font-bold text-danger mb-2">{redLeads.length}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Red Priority</div>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => onNavigate('dashboard')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                <TrendUp size={20} weight="duotone" className="mr-2" />
                View Dashboard
              </Button>
              <Button
                onClick={() => onNavigate('prospects')}
                className="w-full bg-success hover:bg-success/90 text-white"
                size="lg"
              >
                Go to Prospects
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Recent Leads</h2>
              <Clock size={20} weight="duotone" className="text-muted-foreground" />
            </div>
            {recentLeads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No recent leads
              </div>
            ) : (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="p-4 rounded-xl"
                    style={{
                      border: '1px solid var(--border-subtle)',
                      background: 'rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-white">{lead.company}</h3>
                          {lead.rating === 'A+' && (
                            <Star size={16} weight="fill" className="text-warning" />
                          )}
                        </div>
                        {lead.assignedRep && (
                          <span className="text-xs text-muted-foreground">
                            {lead.assignedRep}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-colors"
                        style={{
                          background: 'var(--primary)',
                          color: 'white'
                        }}
                      >
                        <Phone size={16} weight="duotone" />
                      </a>
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-colors"
                        style={{
                          background: 'var(--accent)',
                          color: 'white'
                        }}
                      >
                        <Envelope size={16} weight="duotone" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
