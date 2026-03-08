import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
  Phone, 
  Star,
  Phone, 
  Envelope,
  Star,
  Clock

  leads: Lead[]
}
export function HomePage({ leads

  const yellowLeads = lea

    if (lead.status === 'signed' || 
 

  return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
      >
          <div 
            style={{

          />
            <img 
              alt="XPS XPRESS Logo"
              style={{
             
   

          
      </motion.div>
      <div classN
          onClick={() => onNavigate('lea
          whileTap={{ scale: 0.98 }}
          animate={{ opacity: 1, y: 0 }}
       
          <div className="text-5xl font-bold
        </motio
        <motion.button
          whileHover
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.2 
        >
          <d

          onClick
          whileTap={{ scale: 
          animate={{ opacity: 1, y:
          className="glass-card p-8 rounded-2xl text-c
          <div classNa
        </motion.button>
        <motion.
          whil
          initia
          tran
        >
          <div className="text-sm text-muted-foreground uppercase track
      </div>
      <div>
          <h2 class

            size="lg"
          >
          </Button>

          <Card className="glass-car
            <Button
              className="bg-success hove
              Go to Prospects
          </Card>
         
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                transiti

                >
                    <div className="flex item
                      <div className="flex-1"
                        <div classNa
                          {lead.assignedI
                              {lead.assi
                          )}
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
         
                          )}
                      </div>
                    

                      
                      >
                      </a>
                        href={`mailt
                        className="p-3 ro
                        <Envelope size={
                    </div>
                </Card>
         
        )}
    </div>
}


































































































