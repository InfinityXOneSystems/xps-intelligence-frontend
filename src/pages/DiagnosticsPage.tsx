import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowClockwise, 
  DownloadSimple, 
  CheckCircle, 
  XCircle, 
  WarningCircle,
  Clock,
  Database,
  Globe,
  Gauge,
  Browser,
  ShieldCheck,
  Play
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import {
  DiagnosticTest,
  DiagnosticCategory,
  getDefaultTests,
  runDiagnosticTest,
  categorizTests,
  generateSupportBundle,
  downloadSupportBundle,
  getSystemInfo,
} from '@/lib/diagnostics'

interface DiagnosticsPageProps {
  onNavigate: (page: string) => void
}

export function DiagnosticsPage({ onNavigate }: DiagnosticsPageProps) {
  const [tests, setTests] = useState<DiagnosticTest[]>(getDefaultTests())
  const [isRunning, setIsRunning] = useState(false)
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set())
  const [progress, setProgress] = useState(0)
  const [categories, setCategories] = useState<DiagnosticCategory[]>([])

  const runAllTests = async () => {
    setIsRunning(true)
    setProgress(0)
    
    const defaultTests = getDefaultTests()
    setTests(defaultTests.map(t => ({ ...t, status: 'running' as const })))
    
    const results: DiagnosticTest[] = []
    
    for (let i = 0; i < defaultTests.length; i++) {
      const test = defaultTests[i]
      const result = await runDiagnosticTest(test)
      results.push(result)
      
      setTests([...results, ...defaultTests.slice(i + 1)])
      setProgress(((i + 1) / defaultTests.length) * 100)
    }
    
    setTests(results)
    setCategories(categorizTests(results))
    setIsRunning(false)
    
    const failed = results.filter(t => t.status === 'failed').length
    const warnings = results.filter(t => t.status === 'warning').length
    
    if (failed > 0) {
      toast.error(`Diagnostics complete: ${failed} test(s) failed`)
    } else if (warnings > 0) {
      toast.warning(`Diagnostics complete: ${warnings} warning(s)`)
    } else {
      toast.success('All diagnostics passed!')
    }
  }

  const runSingleTest = async (testId: string) => {
    const testToRun = tests.find(t => t.id === testId)
    if (!testToRun) return

    setRunningTests(prev => new Set(prev).add(testId))
    
    setTests(prevTests => 
      prevTests.map(t => 
        t.id === testId ? { ...t, status: 'running' as const } : t
      )
    )

    try {
      const result = await runDiagnosticTest(testToRun)
      
      setTests(prevTests => 
        prevTests.map(t => t.id === testId ? result : t)
      )
      
      setCategories(categorizTests(
        tests.map(t => t.id === testId ? result : t)
      ))

      if (result.status === 'failed') {
        toast.error(`Test failed: ${result.name}`, {
          description: result.error,
        })
      } else if (result.status === 'warning') {
        toast.warning(`Test completed with warning: ${result.name}`, {
          description: result.error || 'Check details for more information',
        })
      } else {
        toast.success(`Test passed: ${result.name}`)
      }
    } catch (err) {
      toast.error(`Failed to run test: ${testToRun.name}`, {
        description: err instanceof Error ? err.message : 'Unknown error',
      })
    } finally {
      setRunningTests(prev => {
        const next = new Set(prev)
        next.delete(testId)
        return next
      })
    }
  }

  const handleExportBundle = async () => {
    try {
      const bundle = await generateSupportBundle(tests)
      downloadSupportBundle(bundle)
      
      const systemInfo = await getSystemInfo()
      
      toast.success('Support bundle downloaded', {
        description: `File size: ${new Blob([JSON.stringify(bundle)]).size} bytes`,
      })
    } catch (err) {
      toast.error('Failed to generate support bundle', {
        description: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'storage':
        return <Database className="h-5 w-5" />
      case 'network':
        return <Globe className="h-5 w-5" />
      case 'performance':
        return <Gauge className="h-5 w-5" />
      case 'browser':
        return <Browser className="h-5 w-5" />
      case 'data':
        return <ShieldCheck className="h-5 w-5" />
      default:
        return null
    }
  }

  const getStatusIcon = (status: DiagnosticTest['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-success" weight="fill" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-danger" weight="fill" />
      case 'warning':
        return <WarningCircle className="h-5 w-5 text-warning" weight="fill" />
      case 'running':
        return <ArrowClockwise className="h-5 w-5 animate-spin text-primary" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: DiagnosticTest['status']) => {
    const variants: Record<string, any> = {
      passed: 'default',
      failed: 'destructive',
      warning: 'secondary',
      running: 'outline',
      pending: 'outline',
      skipped: 'outline',
    }
    
    return (
      <Badge variant={variants[status] || 'outline'} className="uppercase font-mono text-xs">
        {status}
      </Badge>
    )
  }

  const completedTests = tests.filter(t => 
    t.status === 'passed' || t.status === 'failed' || t.status === 'warning' || t.status === 'skipped'
  )
  const passedTests = tests.filter(t => t.status === 'passed')
  const failedTests = tests.filter(t => t.status === 'failed')
  const warningTests = tests.filter(t => t.status === 'warning')
  
  const overallHealth = completedTests.length > 0 
    ? (passedTests.length / completedTests.length) * 100 
    : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">System Diagnostics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive system health checks and support export
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            className="gap-2"
          >
            {isRunning ? (
              <>
                <ArrowClockwise className="h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" weight="fill" />
                Run All Tests
              </>
            )}
          </Button>
          
          <Button
            onClick={handleExportBundle}
            variant="outline"
            disabled={completedTests.length === 0}
            className="gap-2"
          >
            <DownloadSimple className="h-4 w-4" />
            Export Bundle
          </Button>
        </div>
      </div>

      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Running tests...</span>
                <span className="font-mono font-semibold">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {completedTests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wide font-medium">Overall Health</span>
                </div>
                <div className="text-3xl font-bold font-mono tabular-nums">
                  {overallHealth.toFixed(0)}%
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wide font-medium">Passed</span>
                </div>
                <div className="text-3xl font-bold font-mono tabular-nums text-success">
                  {passedTests.length}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-warning">
                  <WarningCircle className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wide font-medium">Warnings</span>
                </div>
                <div className="text-3xl font-bold font-mono tabular-nums text-warning">
                  {warningTests.length}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-danger">
                  <XCircle className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wide font-medium">Failed</span>
                </div>
                <div className="text-3xl font-bold font-mono tabular-nums text-danger">
                  {failedTests.length}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {failedTests.length > 0 && (
        <Alert className="border-danger bg-danger/5">
          <XCircle className="h-5 w-5 text-danger" />
          <AlertDescription className="ml-2">
            <span className="font-semibold">{failedTests.length} critical issue(s) detected.</span>
            {' '}Review failed tests below and follow recommendations.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(category.id)}
                    <div>
                      <CardTitle className="text-lg uppercase tracking-wide">
                        {category.name}
                      </CardTitle>
                      <CardDescription className="font-mono text-xs mt-1">
                        {category.tests.filter(t => t.status === 'passed').length} / {category.tests.length} passed
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold font-mono tabular-nums">
                      {category.health.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {category.tests.map((test) => (
                  <div key={test.id}>
                    <div className="flex items-start gap-3 p-4 rounded-lg border bg-card/50">
                      <div className="mt-0.5">
                        {getStatusIcon(test.status)}
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="font-medium">{test.name}</div>
                            {test.duration !== undefined && (
                              <div className="text-xs text-muted-foreground font-mono mt-1">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {test.duration.toFixed(2)}ms
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {getStatusBadge(test.status)}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => runSingleTest(test.id)}
                              disabled={isRunning || runningTests.has(test.id)}
                              className="h-7 w-7 p-0"
                              title="Re-run this test"
                            >
                              <ArrowClockwise 
                                className={`h-4 w-4 ${runningTests.has(test.id) ? 'animate-spin' : ''}`} 
                              />
                            </Button>
                          </div>
                        </div>
                        
                        {test.error && (
                          <div className="text-sm text-danger font-mono bg-danger/5 px-3 py-2 rounded border border-danger/20">
                            {test.error}
                          </div>
                        )}
                        
                        {test.recommendation && (
                          <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded border">
                            <span className="font-semibold">Recommendation:</span> {test.recommendation}
                          </div>
                        )}
                        
                        {test.details && Object.keys(test.details).length > 0 && (
                          <div className="text-xs font-mono bg-muted/30 px-3 py-2 rounded border">
                            <div className="space-y-1">
                              {Object.entries(test.details).map(([key, value]) => (
                                <div key={key} className="flex gap-2">
                                  <span className="text-muted-foreground">{key}:</span>
                                  <span className="font-semibold">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-3">
                <Play className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <div className="font-semibold text-lg">No tests run yet</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click "Run All Tests" to start comprehensive system diagnostics
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
