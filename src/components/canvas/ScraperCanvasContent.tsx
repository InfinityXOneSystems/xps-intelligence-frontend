import { motion } from 'framer-motion'
import { Globe, Pulse, Monitor } from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import type { ScraperCanvasData } from '@/types/canvas'

interface ScraperCanvasContentProps {
  data: ScraperCanvasData
}

export function ScraperCanvasContent({ data }: ScraperCanvasContentProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 bg-black/40 relative overflow-hidden">
        {data.screenshot ? (
          <img 
            src={data.screenshot} 
            alt="Browser Screenshot" 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <Monitor size={64} weight="duotone" className="mb-4 opacity-50" />
            <p className="text-sm">Browser viewport will appear here</p>
            <p className="text-xs mt-1">Start the scraper to see live activity</p>
          </div>
        )}
        
        {data.isActive && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-primary-foreground animate-pulse-glow">
              <Pulse size={12} weight="fill" className="mr-1.5" />
              Scraping
            </Badge>
          </div>
        )}

        {data.browserUrl && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-border/50 px-4 py-2">
            <div className="flex items-center gap-2 text-xs">
              <Globe size={14} className="text-muted-foreground" />
              <span className="text-muted-foreground font-mono">{data.browserUrl}</span>
            </div>
          </div>
        )}
      </div>

      <div className="h-48 border-t border-border/50 bg-black/20">
        <div className="px-4 py-2 border-b border-border/30 bg-black/30">
          <span className="text-xs font-semibold text-muted-foreground">Console Output</span>
        </div>
        <ScrollArea className="h-[calc(100%-2.5rem)]">
          <div className="p-3 space-y-1 font-mono text-xs">
            {data.logs.length === 0 ? (
              <p className="text-muted-foreground">No logs yet...</p>
            ) : (
              data.logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-green-500"
                >
                  {log}
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
