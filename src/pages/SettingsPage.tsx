import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BackButton } from '@/components/BackButton'
import { toolRegistry } from '@/lib/toolRegistry'
import { llmRouter } from '@/lib/llm'
import { toast } from 'sonner'
import { Wrench, Brain, Globe, Key } from '@phosphor-icons/react'

const categoryColors: Record<string, string> = {
  browser: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  crawler: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  github: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  system: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  data: 'bg-green-500/20 text-green-400 border-green-500/30',
  deployment: 'bg-red-500/20 text-red-400 border-red-500/30',
  communication: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
}

export function SettingsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [tools, setTools] = useState(toolRegistry.getAll())
  const [llmConfig, setLlmConfig] = useState({
    groqApiKey: '',
    geminiApiKey: '',
    huggingfaceApiKey: '',
    provider: (llmRouter.getConfig().provider ?? 'groq') as 'groq' | 'gemini' | 'huggingface',
  })

  const handleToolToggle = (toolId: string, enabled: boolean) => {
    toolRegistry.setEnabled(toolId, enabled)
    setTools(toolRegistry.getAll())
    toast.success(`${enabled ? 'Enabled' : 'Disabled'} tool`)
  }

  const handleSaveLLM = () => {
    llmRouter.setConfig({
      groqApiKey: llmConfig.groqApiKey || undefined,
      geminiApiKey: llmConfig.geminiApiKey || undefined,
      huggingfaceApiKey: llmConfig.huggingfaceApiKey || undefined,
      provider: llmConfig.provider,
    })
    toast.success('LLM configuration saved')
  }

  return (
    <div className="space-y-8">
      <BackButton onBack={() => onNavigate('home')} />
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-white/70 mt-1">Configure your dashboard preferences and system settings</p>
      </div>

      <Tabs defaultValue="tools">
        <TabsList className="mb-6">
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Wrench size={16} />
            Tool Registry
          </TabsTrigger>
          <TabsTrigger value="llm" className="flex items-center gap-2">
            <Brain size={16} />
            LLM Providers
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe size={16} />
            General
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tools">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              Enable or disable tools available to the agent planner. Enabled tools can be invoked during command execution.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {tools.map((tool) => (
                <Card key={tool.id} className="glass-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-sm font-semibold">{tool.name}</CardTitle>
                        <Badge className={categoryColors[tool.category] ?? 'bg-muted text-muted-foreground'}>
                          {tool.category}
                        </Badge>
                      </div>
                      <Switch
                        checked={tool.enabled}
                        onCheckedChange={(checked) => handleToolToggle(tool.id, checked)}
                      />
                    </div>
                    <CardDescription className="text-xs">{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="llm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key size={18} />
                  LLM Provider Configuration
                </CardTitle>
                <CardDescription>
                  Configure API keys for LLM providers. The system will automatically fall back to the next provider if a rate limit is hit.
                  All providers offer free tiers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Preferred Provider</Label>
                    <div className="flex gap-2">
                      {(['groq', 'gemini', 'huggingface'] as const).map((p) => (
                        <Button
                          key={p}
                          size="sm"
                          variant={llmConfig.provider === p ? 'default' : 'outline'}
                          onClick={() => setLlmConfig((c) => ({ ...c, provider: p }))}
                          className="capitalize"
                        >
                          {p}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="groq-key">Groq API Key (free tier available)</Label>
                    <Input
                      id="groq-key"
                      type="password"
                      placeholder="gsk_..."
                      value={llmConfig.groqApiKey}
                      onChange={(e) => setLlmConfig((c) => ({ ...c, groqApiKey: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">Get your key at console.groq.com</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gemini-key">Gemini API Key (free tier available)</Label>
                    <Input
                      id="gemini-key"
                      type="password"
                      placeholder="AIza..."
                      value={llmConfig.geminiApiKey}
                      onChange={(e) => setLlmConfig((c) => ({ ...c, geminiApiKey: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">Get your key at aistudio.google.com</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hf-key">HuggingFace API Key (free tier available)</Label>
                    <Input
                      id="hf-key"
                      type="password"
                      placeholder="hf_..."
                      value={llmConfig.huggingfaceApiKey}
                      onChange={(e) => setLlmConfig((c) => ({ ...c, huggingfaceApiKey: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">Get your key at huggingface.co/settings/tokens</p>
                  </div>

                  <Button onClick={handleSaveLLM} className="w-full">
                    Save LLM Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card p-6">
              <p className="text-white/70">
                Additional settings coming soon
              </p>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
