import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BackButton } from '@/components/BackButton'
import {
  CheckCircle,
  XCircle,
  Warning,
  Clock,
  Download,
  ClipboardText,
  ArrowsClockwise,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { runDiagnostics, createSupportBundle, downloadSupportBundle } from '@/controlPlane/diagnostics/runner'
import type { DiagnosticReport, DiagnosticCheck } from '@/controlPlane/diagnostics/types'

const cardStyle = {
  background: 'var(--card)',
  backdropFilter: 'blur(32px) saturate(180%)',
  WebkitBackdropFilter: 'blur(32px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
}

function StatusIcon({ status }: { status: DiagnosticCheck['status'] }) {
  switch (status) {
    case 'pass':
      return <CheckCircle size={20} className="text-green-400" weight="fill" />
    case 'fail':
      return <XCircle size={20} className="text-red-400" weight="fill" />
    case 'warn':
      return <Warning size={20} className="text-yellow-400" weight="fill" />
    default:
      return <Clock size={20} className="text-white/30" />
  }
}

function StatusBadge({ status }: { status: DiagnosticCheck['status'] }) {
  const colors = {
    pass: 'bg-green-500/20 text-green-400 border-green-500/30',
    fail: 'bg-red-500/20 text-red-400 border-red-500/30',
    warn: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    skip: 'bg-white/10 text-white/50 border-white/20',
  }
  
  return (
    <Badge variant="outline" className={`${colors[status]} text-[10px] px-1.5 py-0 h-4 uppercase`}>
      {status}
    </Badge>
  )
}

export function DiagnosticsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [report, setReport] = useState<DiagnosticReport | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const handleRunTests = async () => {
    setIsRunning(true)
    toast.info('Running diagnostics...')
    
    try {
      const result = await runDiagnostics()
      setReport(result)
      
      const { passed, failed } = result.summary
      if (failed === 0) {
        toast.success(`All ${passed} tests passed!`)
      } else {
        toast.warning(`${passed} passed, ${failed} failed`)
      }
    } catch (error) {
      toast.error('Failed to run diagnostics')
      console.error(error)
    } finally {
      setIsRunning(false)
    }
  }

  const handleCopyReport = () => {
    if (!report) return
    
    const text = JSON.stringify(report, null, 2)
    navigator.clipboard.writeText(text)
    toast.success('Report copied to clipboard')
  }

  const handleDownloadBundle = () => {
    if (!report) return
    
    const integrations = report.checks.map(check => ({
      provider: check.id.replace('-test', ''),
      status: check.status,
      last_tested: check.timestamp,
    }))
    
    const bundle = createSupportBundle(report, integrations)
    downloadSupportBundle(bundle)
    toast.success('Support bundle downloaded')
  }

  return (
    <div className="space-y-6">
      <BackButton onBack={() => onNavigate('settings')} />
      
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">System Diagnostics</h1>
          <p className="text-white/60 mt-1 text-sm">
            Test integrations and generate support reports
          </p>
        </div>
        
        <div className="flex gap-2">
          {report && (
            <>
              <Button
                onClick={handleCopyReport}
                variant="outline"
                className="flex items-center gap-2"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white',
                }}
              >
                <ClipboardText size={16} />
                Copy Report
              </Button>
              <Button
                onClick={handleDownloadBundle}
                variant="outline"
                className="flex items-center gap-2"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'white',
                }}
              >
                <Download size={16} />
                Download Bundle
              </Button>
            </>
          )}
          <Button
            onClick={handleRunTests}
            disabled={isRunning}
            className="flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #b8860b 0%, #ffd700 100%)',
              color: 'black',
            }}
          >
            <ArrowsClockwise size={16} className={isRunning ? 'animate-spin' : ''} />
            {isRunning ? 'Running...' : 'Run All Tests'}
          </Button>
        </div>
      </div>

      {report && (
        <div className="grid grid-cols-4 gap-4">
          <Card style={cardStyle}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Total</p>
                <p className="text-3xl font-bold text-white">{report.summary.total}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card style={cardStyle}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-xs text-green-400/80 uppercase tracking-wider mb-1">Passed</p>
                <p className="text-3xl font-bold text-green-400">{report.summary.passed}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card style={cardStyle}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-xs text-red-400/80 uppercase tracking-wider mb-1">Failed</p>
                <p className="text-3xl font-bold text-red-400">{report.summary.failed}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card style={cardStyle}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-xs text-yellow-400/80 uppercase tracking-wider mb-1">Warnings</p>
                <p className="text-3xl font-bold text-yellow-400">{report.summary.warnings}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card style={cardStyle}>
        <CardHeader className="pb-3 border-b border-white/8">
          <CardTitle className="text-white text-base">Test Results</CardTitle>
          <CardDescription className="text-white/50 text-xs">
            {report ? `Last run: ${new Date(report.timestamp).toLocaleString()}` : 'No tests run yet'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 pb-4">
          {!report && (
            <div className="text-center py-12">
              <Clock size={48} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/50 text-sm">Click "Run All Tests" to begin diagnostics</p>
            </div>
          )}
          
          {report && report.checks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/50 text-sm">No test results available</p>
            </div>
          )}
          
          {report && report.checks.length > 0 && (
            <div className="space-y-3">
              {report.checks.map((check) => (
                <div
                  key={check.id}
                  className="p-4 rounded-lg"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <StatusIcon status={check.status} />
                      <div>
                        <p className="text-sm font-medium text-white">{check.name}</p>
                        <p className="text-xs text-white/50 mt-0.5">{check.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {check.latency_ms !== undefined && (
                        <span className="text-xs text-white/40 font-mono">{check.latency_ms}ms</span>
                      )}
                      <StatusBadge status={check.status} />
                    </div>
                  </div>
                  
                  {check.fix_hint && (
                    <div
                      className="mt-2 p-2 rounded text-xs"
                      style={{
                        background: 'rgba(234,179,8,0.1)',
                        border: '1px solid rgba(234,179,8,0.2)',
                        color: 'rgb(250,204,21)',
                      }}
                    >
                      <strong>💡 How to fix:</strong> {check.fix_hint}
                    </div>
                  )}
                  
                  {check.details && Object.keys(check.details).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs text-white/40 cursor-pointer hover:text-white/60 transition-colors">
                        Show details
                      </summary>
                      <pre className="mt-2 p-2 rounded bg-black/40 text-xs text-white/60 overflow-auto">
                        {JSON.stringify(check.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
