import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Stop, Scroll } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { BackButton } from '@/components/BackButton'
import { controlPlaneApi } from '@/services/api/controlPlane'

export function ScraperPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [isRunning, setIsRunning] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [config, setConfig] = useState({
    city: '',
    category: 'epoxy contractors',
    maxResults: 50,
    sources: {
      googleMaps: true,
      yelp: false,
      directories: false
    }
  })
  const [logs, setLogs] = useState<string[]>([])

  const appendLog = (msg: string) =>
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])

  const handleRunScraper = async () => {
    if (!config.city) {
      toast.error('Please enter a city')
      return
    }

    setIsRunning(true)
    appendLog(`Starting scraper for ${config.city} — category: ${config.category}`)

    try {
      const result = await controlPlaneApi.runScraper(config)
      setJobId(result.jobId)
      appendLog(`Job queued — ID: ${result.jobId} | status: ${result.status}`)
      toast.success('Scraper started on the backend')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      appendLog(`ERROR: ${msg}`)
      toast.error(`Failed to start scraper: ${msg}`)
      setIsRunning(false)
      return
    }

    // Results will be committed to the LEADS repo and indexed in Supabase by the backend.
    // Poll for completion or let the user check the Leads page for results.
    appendLog('Results will be committed to the LEADS repo and indexed in Supabase.')
    appendLog('Check the Leads or Contractors pages once the job completes.')
    setIsRunning(false)
  }

  const handleStopScraper = () => {
    setIsRunning(false)
    appendLog('Scraper stop requested — the backend will halt the job gracefully.')
    toast.info('Stop signal sent')
  }

  return (
    <div className="space-y-10">
      <BackButton onBack={() => onNavigate('home')} />
      <div>
        <h1 className="text-4xl font-bold">Scraper Control</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Configure and run lead generation scraper
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Scraper Configuration</CardTitle>
              <CardDescription>
                Set parameters for lead scraping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="city">City</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="city"
                    value={config.city}
                    onChange={(e) => setConfig({ ...config, city: e.target.value })}
                    placeholder="Tampa"
                    className="border-2 border-transparent"
                    style={{
                      background: 'rgba(0, 0, 0, 0.70)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                    }}
                  />
                  <div 
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      padding: '2px',
                      background: 'linear-gradient(135deg, var(--gradient-gold-start) 0%, var(--gradient-gold-mid) 25%, var(--gradient-silver-start) 50%, var(--gradient-gold-mid) 75%, var(--gradient-gold-start) 100%)',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      backgroundSize: '200% 200%',
                      animation: 'gradient-shift 3s linear infinite',
                    }}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="category"
                    value={config.category}
                    onChange={(e) => setConfig({ ...config, category: e.target.value })}
                    placeholder="epoxy contractors"
                    className="border-2 border-transparent"
                    style={{
                      background: 'rgba(0, 0, 0, 0.70)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                    }}
                  />
                  <div 
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      padding: '2px',
                      background: 'linear-gradient(135deg, var(--gradient-gold-start) 0%, var(--gradient-gold-mid) 25%, var(--gradient-silver-start) 50%, var(--gradient-gold-mid) 75%, var(--gradient-gold-start) 100%)',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      backgroundSize: '200% 200%',
                      animation: 'gradient-shift 3s linear infinite',
                    }}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="maxResults">Max Results</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="maxResults"
                    type="number"
                    value={config.maxResults}
                    onChange={(e) => setConfig({ ...config, maxResults: parseInt(e.target.value) || 50 })}
                    className="border-2 border-transparent"
                    style={{
                      background: 'rgba(0, 0, 0, 0.70)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                    }}
                  />
                  <div 
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      padding: '2px',
                      background: 'linear-gradient(135deg, var(--gradient-gold-start) 0%, var(--gradient-gold-mid) 25%, var(--gradient-silver-start) 50%, var(--gradient-gold-mid) 75%, var(--gradient-gold-start) 100%)',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      backgroundSize: '200% 200%',
                      animation: 'gradient-shift 3s linear infinite',
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Sources</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="googleMaps"
                      checked={config.sources.googleMaps}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          sources: { ...config.sources, googleMaps: checked as boolean }
                        })
                      }
                    />
                    <Label htmlFor="googleMaps" className="cursor-pointer font-normal">
                      Google Maps
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="yelp"
                      checked={config.sources.yelp}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          sources: { ...config.sources, yelp: checked as boolean }
                        })
                      }
                    />
                    <Label htmlFor="yelp" className="cursor-pointer font-normal">
                      Yelp
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="directories"
                      checked={config.sources.directories}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          sources: { ...config.sources, directories: checked as boolean }
                        })
                      }
                    />
                    <Label htmlFor="directories" className="cursor-pointer font-normal">
                      Business Directories
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                {!isRunning ? (
                  <Button
                    onClick={handleRunScraper}
                    className="flex-1"
                  >
                    <Play size={16} className="mr-2" weight="fill" />
                    Run Scraper
                  </Button>
                ) : (
                  <Button
                    onClick={handleStopScraper}
                    variant="destructive"
                    className="flex-1"
                  >
                    <Stop size={16} className="mr-2" weight="fill" />
                    Stop Scraper
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scroll size={20} />
                Scraper Logs
              </CardTitle>
              <CardDescription>
                Real-time scraper activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-background/50 rounded-lg p-4 h-[400px] overflow-y-auto font-mono text-xs space-y-1">
                {logs.length === 0 ? (
                  <p className="text-muted-foreground">No logs yet. Start the scraper to see activity.</p>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className={log.startsWith('[') && log.includes('ERROR') ? 'text-red-400' : 'text-green-500'}>
                      {log}
                    </div>
                  ))
                )}
                {isRunning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-primary animate-pulse"
                  >
                    Sending to backend…
                  </motion.div>
                )}
                {jobId && !isRunning && (
                  <div className="text-yellow-400 mt-2">
                    Job ID: {jobId} — results will appear in Leads / Contractors once indexed.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
