import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GithubLogo,
  Database,
  RocketLaunch,
  Train,
  Brain,
  CheckCircle,
  XCircle,
  Warning,
  Plugs,
  Key,
  CaretDown,
  Play,
  SpinnerGap,
} from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { integrationClient } from '@/controlPlane/integrations/client'
import { getAllIntegrations } from '@/controlPlane/integrations/registry'
import type { Integration, IntegrationProvider, IntegrationStatus } from '@/controlPlane/integrations/types'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  GithubLogo,
  Database,
  RocketLaunch,
  Train,
  Brain,
}

const STATUS_CONFIG: Record<IntegrationStatus, { icon: React.ReactNode; color: string; label: string }> = {
  connected: {
    icon: <CheckCircle size={16} weight="fill" />,
    color: 'text-green-400',
    label: 'Connected',
  },
  disconnected: {
    icon: <XCircle size={16} weight="fill" />,
    color: 'text-white/30',
    label: 'Disconnected',
  },
  error: {
    icon: <Warning size={16} weight="fill" />,
    color: 'text-red-400',
    label: 'Error',
  },
  testing: {
    icon: <SpinnerGap size={16} className="animate-spin" />,
    color: 'text-yellow-400',
    label: 'Testing...',
  },
}

interface ProviderCardProps {
  integration: Integration
  onConnect: (provider: IntegrationProvider) => void
  onTest: (provider: IntegrationProvider) => void
  onDisconnect: (provider: IntegrationProvider) => void
  onAction: (endpoint: string, method: string) => void
}

function ProviderCard({ integration, onConnect, onTest, onDisconnect, onAction }: ProviderCardProps) {
  const IconComponent = ICON_MAP[integration.icon] || Plugs
  const statusConfig = STATUS_CONFIG[integration.status]
  const isConnected = integration.status === 'connected'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="relative overflow-hidden border-white/10 hover:border-white/20 transition-all"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(32px)',
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-lg"
                style={{
                  background: isConnected ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: isConnected ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <IconComponent
                  size={20}
                  className={isConnected ? 'text-green-400' : 'text-white/50'}
                />
              </div>
              <div>
                <CardTitle className="text-white text-sm font-semibold">{integration.name}</CardTitle>
                <CardDescription className="text-white/50 text-xs mt-0.5">
                  {integration.description}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 ${statusConfig.color}`}>
                {statusConfig.icon}
                <span className="text-xs font-medium">{statusConfig.label}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            {!isConnected ? (
              <Button
                size="sm"
                onClick={() => onConnect(integration.provider)}
                className="h-7 text-xs"
                style={{
                  background: 'linear-gradient(135deg, rgba(184,134,11,0.25), rgba(255,215,0,0.15))',
                  border: '1px solid rgba(255,215,0,0.25)',
                }}
              >
                <Key size={14} className="mr-1.5" />
                Connect
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={() => onTest(integration.provider)}
                  variant="outline"
                  className="h-7 text-xs border-white/20 hover:bg-white/5"
                >
                  <Play size={14} className="mr-1.5" />
                  Test
                </Button>
                <Button
                  size="sm"
                  onClick={() => onDisconnect(integration.provider)}
                  variant="outline"
                  className="h-7 text-xs border-red-400/30 text-red-400 hover:bg-red-400/10"
                >
                  Disconnect
                </Button>
                {integration.actions.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-white/20 hover:bg-white/5 ml-auto"
                      >
                        Actions
                        <CaretDown size={14} className="ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-zinc-900/95 backdrop-blur-xl border-white/20"
                    >
                      {integration.actions
                        .filter((action) => !action.requiresConnection || isConnected)
                        .map((action) => (
                          <DropdownMenuItem
                            key={action.id}
                            onClick={() => onAction(action.endpoint, action.method || 'GET')}
                            className="text-xs text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
                          >
                            <span className="font-medium">{action.label}</span>
                            <span className="text-white/40 text-[10px] ml-2">{action.description}</span>
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </>
            )}
          </div>

          {integration.metadata?.last_error && (
            <div className="mt-2 p-2 rounded-md bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400">{integration.metadata.last_error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface ConnectionDialogProps {
  open: boolean
  provider: IntegrationProvider | null
  onClose: () => void
  onSubmit: (provider: IntegrationProvider, token: string) => void
}

function ConnectionDialog({ open, provider, onClose, onSubmit }: ConnectionDialogProps) {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!provider || !token.trim()) return
    setLoading(true)
    try {
      await onSubmit(provider, token.trim())
      setToken('')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const providerLabels: Record<IntegrationProvider, { name: string; placeholder: string; hint: string }> = {
    github: {
      name: 'GitHub',
      placeholder: 'ghp_...',
      hint: 'Generate a personal access token from GitHub Settings → Developer settings',
    },
    supabase: {
      name: 'Supabase',
      placeholder: 'eyJhbG...',
      hint: 'Service role key from your Supabase project settings',
    },
    vercel: {
      name: 'Vercel',
      placeholder: 'vercel_...',
      hint: 'Create a token in Vercel Account Settings → Tokens',
    },
    railway: {
      name: 'Railway',
      placeholder: 'railway_...',
      hint: 'Generate an API token from Railway Account Settings',
    },
    groq: {
      name: 'Groq',
      placeholder: 'gsk_...',
      hint: 'Get your API key from Groq Console',
    },
  }

  const config = provider ? providerLabels[provider] : null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900/95 backdrop-blur-xl border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Connect {config?.name}</DialogTitle>
          <DialogDescription className="text-white/60 text-xs">{config?.hint}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/80">API Token / Key</label>
            <Input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder={config?.placeholder}
              className="bg-black/40 border-white/20 text-white text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit()
              }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={onClose} className="border-white/20">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!token.trim() || loading}
              style={{
                background: 'linear-gradient(135deg, rgba(184,134,11,0.35), rgba(255,215,0,0.2))',
                border: '1px solid rgba(255,215,0,0.3)',
              }}
            >
              {loading ? 'Connecting...' : 'Connect'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ControlPlanePanel() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [connectDialogOpen, setConnectDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<IntegrationProvider | null>(null)

  useEffect(() => {
    const allIntegrations = getAllIntegrations()
    setIntegrations(allIntegrations)
  }, [])

  const updateIntegrationStatus = (provider: IntegrationProvider, status: IntegrationStatus, error?: string) => {
    setIntegrations((prev) =>
      prev.map((int) =>
        int.provider === provider
          ? {
              ...int,
              status,
              metadata: {
                ...int.metadata,
                provider,
                status,
                last_error: error,
                updated_at: new Date().toISOString(),
              },
            }
          : int
      )
    )
  }

  const handleConnect = (provider: IntegrationProvider) => {
    setSelectedProvider(provider)
    setConnectDialogOpen(true)
  }

  const handleConnectSubmit = async (provider: IntegrationProvider, token: string) => {
    updateIntegrationStatus(provider, 'testing')
    try {
      const response = await integrationClient.connect({
        provider,
        config: { token },
      })

      if (response.ok) {
        updateIntegrationStatus(provider, 'connected')
        toast.success(`${provider} connected successfully`)
      } else {
        updateIntegrationStatus(provider, 'error', response.error?.message)
        toast.error(`Failed to connect ${provider}`, {
          description: response.error?.message,
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      updateIntegrationStatus(provider, 'error', message)
      toast.error(`Connection failed`, { description: message })
    }
  }

  const handleTest = async (provider: IntegrationProvider) => {
    updateIntegrationStatus(provider, 'testing')
    try {
      const response = await integrationClient.test(provider)

      if (response.ok) {
        updateIntegrationStatus(provider, 'connected')
        const message = response.data && typeof response.data === 'object' && 'message' in response.data
          ? String(response.data.message)
          : 'Connection successful'
        toast.success(`${provider} connection verified`, {
          description: message,
        })
      } else {
        updateIntegrationStatus(provider, 'error', response.error?.message)
        toast.error(`Test failed for ${provider}`, {
          description: response.error?.message,
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      updateIntegrationStatus(provider, 'error', message)
      toast.error(`Test failed`, { description: message })
    }
  }

  const handleDisconnect = async (provider: IntegrationProvider) => {
    try {
      const response = await integrationClient.disconnect(provider)

      if (response.ok) {
        updateIntegrationStatus(provider, 'disconnected')
        toast.success(`${provider} disconnected`)
      } else {
        toast.error(`Failed to disconnect ${provider}`, {
          description: response.error?.message,
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Disconnect failed`, { description: message })
    }
  }

  const handleAction = async (endpoint: string, method: string) => {
    toast.info('Action triggered', { description: `${method} ${endpoint}` })
    try {
      const response = await integrationClient.action(endpoint, method as 'GET' | 'POST' | 'DELETE')

      if (response.ok) {
        toast.success('Action completed', {
          description: JSON.stringify(response.data, null, 2),
        })
      } else {
        toast.error('Action failed', {
          description: response.error?.message,
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast.error('Action failed', { description: message })
    }
  }

  const connectedCount = integrations.filter((i) => i.status === 'connected').length

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-yellow-400/80 uppercase tracking-wider mb-1">
              Integration Hub
            </p>
            <p className="text-sm text-white/60">
              Connect external services and manage cloud accounts
              {connectedCount > 0 && (
                <Badge variant="outline" className="ml-2 text-[10px] border-green-400/30 text-green-400">
                  {connectedCount} connected
                </Badge>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {integrations.map((integration) => (
              <ProviderCard
                key={integration.id}
                integration={integration}
                onConnect={handleConnect}
                onTest={handleTest}
                onDisconnect={handleDisconnect}
                onAction={handleAction}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <ConnectionDialog
        open={connectDialogOpen}
        provider={selectedProvider}
        onClose={() => {
          setConnectDialogOpen(false)
          setSelectedProvider(null)
        }}
        onSubmit={handleConnectSubmit}
      />
    </>
  )
}
