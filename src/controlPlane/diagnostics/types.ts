export type DiagnosticStatus = 'pass' | 'fail' | 'warn' | 'skip'

export interface DiagnosticCheck {
  id: string
  name: string
  status: DiagnosticStatus
  message: string
  latency_ms?: number
  details?: Record<string, unknown>
  fix_hint?: string
  timestamp: string
}

export interface DiagnosticReport {
  timestamp: string
  checks: DiagnosticCheck[]
  summary: {
    total: number
    passed: number
    failed: number
    warnings: number
    skipped: number
  }
}

export interface DiagnosticSupportBundle {
  report: DiagnosticReport
  environment: {
    userAgent: string
    timestamp: string
    url: string
  }
  integrations: Array<{
    provider: string
    status: string
    last_tested?: string
  }>
}
