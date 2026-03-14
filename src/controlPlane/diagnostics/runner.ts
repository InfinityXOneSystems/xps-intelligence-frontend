import type { DiagnosticReport, DiagnosticCheck, DiagnosticSupportBundle } from './types'
import type { IntegrationProvider } from '../integrations/types'

const PROVIDERS: IntegrationProvider[] = ['github', 'supabase', 'vercel', 'railway', 'groq']

export async function runDiagnostics(): Promise<DiagnosticReport> {
  const checks: DiagnosticCheck[] = []
  
  for (const provider of PROVIDERS) {
    const start = performance.now()
    try {
      const res = await fetch(`/api/integrations/${provider}/test`, {
        credentials: 'include',
      })
      const latency = Math.round(performance.now() - start)
      const data = await res.json()
      
      checks.push({
        id: `${provider}-test`,
        name: `${provider.toUpperCase()} Connection`,
        status: data.ok ? 'pass' : 'fail',
        message: data.ok ? `Connected successfully` : data.error?.message || 'Connection failed',
        latency_ms: latency,
        details: data.data,
        fix_hint: data.error?.hint,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      const latency = Math.round(performance.now() - start)
      checks.push({
        id: `${provider}-test`,
        name: `${provider.toUpperCase()} Connection`,
        status: 'fail',
        message: err instanceof Error ? err.message : 'Unknown error',
        latency_ms: latency,
        fix_hint: 'Check network connectivity and server logs',
        timestamp: new Date().toISOString(),
      })
    }
  }

  const summary = {
    total: checks.length,
    passed: checks.filter(c => c.status === 'pass').length,
    failed: checks.filter(c => c.status === 'fail').length,
    warnings: checks.filter(c => c.status === 'warn').length,
    skipped: checks.filter(c => c.status === 'skip').length,
  }

  return {
    timestamp: new Date().toISOString(),
    checks,
    summary,
  }
}

export function createSupportBundle(report: DiagnosticReport, integrationStatuses: Array<{ provider: string; status: string; last_tested?: string }>): DiagnosticSupportBundle {
  return {
    report,
    environment: {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    },
    integrations: integrationStatuses,
  }
}

export function downloadSupportBundle(bundle: DiagnosticSupportBundle): void {
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `xps-support-bundle-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}
