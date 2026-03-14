const spark = window.spark

export interface DiagnosticTest {
  id: string
  name: string
  category: 'storage' | 'network' | 'performance' | 'data' | 'browser'
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning' | 'skipped'
  duration?: number
  error?: string
  recommendation?: string
  details?: Record<string, any>
}

export interface DiagnosticCategory {
  id: string
  name: string
  tests: DiagnosticTest[]
  health: number
}

export interface SystemInfo {
  userAgent: string
  platform: string
  language: string
  screenResolution: string
  viewport: string
  colorDepth: number
  pixelRatio: number
  timezone: string
  cookiesEnabled: boolean
  doNotTrack: string | null
  onlineStatus: boolean
  connectionType?: string
  memory?: {
    jsHeapSizeLimit?: number
    totalJSHeapSize?: number
    usedJSHeapSize?: number
  }
}

export interface SupportBundle {
  timestamp: string
  systemInfo: SystemInfo
  testResults: DiagnosticTest[]
  categories: Array<{ id: string; name: string; health: number }>
  environmentInfo: {
    appVersion: string
    sparkVersion: string
    reactVersion: string
  }
  storageInfo?: {
    quota?: number
    usage?: number
    available?: number
  }
  errors: Array<{
    message: string
    stack?: string
    timestamp: string
  }>
}

export async function getSystemInfo(): Promise<SystemInfo> {
  const nav = navigator as any
  
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    onlineStatus: navigator.onLine,
    connectionType: nav.connection?.effectiveType,
    memory: (performance as any).memory ? {
      jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
      usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
    } : undefined,
  }
}

export async function getStorageInfo() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate()
      return {
        quota: estimate.quota,
        usage: estimate.usage,
        available: estimate.quota && estimate.usage ? estimate.quota - estimate.usage : undefined,
      }
    } catch (err) {
      return undefined
    }
  }
  return undefined
}

async function testKVStorage(): Promise<Partial<DiagnosticTest>> {
  const testKey = '_diagnostic_test_key'
  const testValue = { test: true, timestamp: Date.now() }
  
  try {
    await spark.kv.set(testKey, testValue)
    const retrieved = await spark.kv.get(testKey)
    
    if (JSON.stringify(retrieved) !== JSON.stringify(testValue)) {
      return {
        status: 'failed',
        error: 'Data mismatch on retrieval',
        recommendation: 'Check browser storage settings and available quota',
      }
    }
    
    await spark.kv.delete(testKey)
    const deleted = await spark.kv.get(testKey)
    
    if (deleted !== undefined) {
      return {
        status: 'warning',
        error: 'Delete operation did not complete',
        recommendation: 'Storage may have retention issues',
      }
    }
    
    return { status: 'passed' }
  } catch (err) {
    return {
      status: 'failed',
      error: err instanceof Error ? err.message : 'Unknown error',
      recommendation: 'Ensure cookies and local storage are enabled in browser settings',
    }
  }
}

async function testKVKeys(): Promise<Partial<DiagnosticTest>> {
  try {
    const keys = await spark.kv.keys()
    return {
      status: 'passed',
      details: { keyCount: keys.length, keys: keys.slice(0, 10) },
    }
  } catch (err) {
    return {
      status: 'failed',
      error: err instanceof Error ? err.message : 'Failed to retrieve keys',
      recommendation: 'Storage API may be corrupted or inaccessible',
    }
  }
}

async function testPerformance(): Promise<Partial<DiagnosticTest>> {
  const start = performance.now()
  const iterations = 10000
  
  for (let i = 0; i < iterations; i++) {
    JSON.parse(JSON.stringify({ test: i }))
  }
  
  const duration = performance.now() - start
  
  if (duration > 100) {
    return {
      status: 'warning',
      details: { duration: `${duration.toFixed(2)}ms`, iterations },
      recommendation: 'Device performance may be degraded. Close other tabs or applications.',
    }
  }
  
  return {
    status: 'passed',
    details: { duration: `${duration.toFixed(2)}ms`, iterations },
  }
}

async function testMemory(): Promise<Partial<DiagnosticTest>> {
  if (!(performance as any).memory) {
    return {
      status: 'skipped',
      error: 'Memory API not available',
      recommendation: 'Use Chrome/Edge for detailed memory diagnostics',
    }
  }
  
  const mem = (performance as any).memory
  const usagePercent = (mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100
  
  if (usagePercent > 90) {
    return {
      status: 'warning',
      details: {
        used: `${(mem.usedJSHeapSize / 1048576).toFixed(2)} MB`,
        limit: `${(mem.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
        percentage: `${usagePercent.toFixed(1)}%`,
      },
      recommendation: 'High memory usage detected. Reload the page to free memory.',
    }
  }
  
  return {
    status: 'passed',
    details: {
      used: `${(mem.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      limit: `${(mem.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
      percentage: `${usagePercent.toFixed(1)}%`,
    },
  }
}

async function testNetworkConnectivity(): Promise<Partial<DiagnosticTest>> {
  if (!navigator.onLine) {
    return {
      status: 'warning',
      error: 'Browser reports offline status',
      recommendation: 'Check network connection',
    }
  }
  
  return { status: 'passed' }
}

async function testAPIEndpoint(): Promise<Partial<DiagnosticTest>> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch('https://api.github.com/zen', {
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      return {
        status: 'warning',
        error: `HTTP ${response.status}`,
        recommendation: 'External API connectivity may be degraded',
      }
    }
    
    return { status: 'passed' }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        status: 'warning',
        error: 'Request timeout (>5s)',
        recommendation: 'Network may be slow or firewalled',
      }
    }
    
    return {
      status: 'warning',
      error: err instanceof Error ? err.message : 'Network error',
      recommendation: 'Check internet connection and firewall settings',
    }
  }
}

async function testBrowserFeatures(): Promise<Partial<DiagnosticTest>> {
  const features = {
    localStorage: 'localStorage' in window,
    sessionStorage: 'sessionStorage' in window,
    indexedDB: 'indexedDB' in window,
    serviceWorker: 'serviceWorker' in navigator,
    webWorker: 'Worker' in window,
    webSocket: 'WebSocket' in window,
    fetch: 'fetch' in window,
    promises: 'Promise' in window,
    asyncAwait: true,
  }
  
  const missingFeatures = Object.entries(features)
    .filter(([_, supported]) => !supported)
    .map(([name]) => name)
  
  if (missingFeatures.length > 0) {
    return {
      status: 'warning',
      error: `Missing features: ${missingFeatures.join(', ')}`,
      details: features,
      recommendation: 'Update browser to latest version for full compatibility',
    }
  }
  
  return {
    status: 'passed',
    details: features,
  }
}

async function testLocalStorage(): Promise<Partial<DiagnosticTest>> {
  try {
    const testKey = '_diagnostic_test_ls'
    const testValue = 'test_data_' + Date.now()
    
    localStorage.setItem(testKey, testValue)
    const retrieved = localStorage.getItem(testKey)
    localStorage.removeItem(testKey)
    
    if (retrieved !== testValue) {
      return {
        status: 'failed',
        error: 'LocalStorage read/write mismatch',
        recommendation: 'Enable browser storage in privacy settings',
      }
    }
    
    return { status: 'passed' }
  } catch (err) {
    return {
      status: 'failed',
      error: err instanceof Error ? err.message : 'LocalStorage access denied',
      recommendation: 'Check browser privacy settings and storage quota',
    }
  }
}

async function testDataIntegrity(): Promise<Partial<DiagnosticTest>> {
  try {
    const keys = await spark.kv.keys()
    let corruptedKeys = 0
    let checkedKeys = 0
    
    for (const key of keys.slice(0, 20)) {
      try {
        checkedKeys++
        await spark.kv.get(key)
      } catch {
        corruptedKeys++
      }
    }
    
    if (corruptedKeys > 0) {
      return {
        status: 'warning',
        error: `${corruptedKeys} of ${checkedKeys} keys have corrupted data`,
        recommendation: 'Consider clearing application data and reloading',
      }
    }
    
    return {
      status: 'passed',
      details: { checkedKeys, corruptedKeys },
    }
  } catch (err) {
    return {
      status: 'failed',
      error: err instanceof Error ? err.message : 'Unable to verify data integrity',
      recommendation: 'Storage may be corrupted. Clear browser data and reload.',
    }
  }
}

async function testSparkUser(): Promise<Partial<DiagnosticTest>> {
  try {
    const user = await spark.user()
    if (!user) {
      return {
        status: 'warning',
        error: 'User API returned null',
        recommendation: 'Authentication may be required',
      }
    }
    return {
      status: 'passed',
      details: {
        authenticated: !!user.login,
        isOwner: user.isOwner,
        login: user.login || 'anonymous',
      },
    }
  } catch (err) {
    return {
      status: 'warning',
      error: err instanceof Error ? err.message : 'User API error',
      recommendation: 'Authentication may be required for full functionality',
    }
  }
}

export async function runDiagnosticTest(test: DiagnosticTest): Promise<DiagnosticTest> {
  const startTime = performance.now()
  
  let result: Partial<DiagnosticTest> = {}
  
  try {
    switch (test.id) {
      case 'kv-storage':
        result = await testKVStorage()
        break
      case 'kv-keys':
        result = await testKVKeys()
        break
      case 'localStorage':
        result = await testLocalStorage()
        break
      case 'performance':
        result = await testPerformance()
        break
      case 'memory':
        result = await testMemory()
        break
      case 'network-connectivity':
        result = await testNetworkConnectivity()
        break
      case 'api-endpoint':
        result = await testAPIEndpoint()
        break
      case 'browser-features':
        result = await testBrowserFeatures()
        break
      case 'data-integrity':
        result = await testDataIntegrity()
        break
      case 'spark-user':
        result = await testSparkUser()
        break
      default:
        result = { status: 'skipped', error: 'Unknown test' }
    }
  } catch (err) {
    result = {
      status: 'failed',
      error: err instanceof Error ? err.message : 'Test execution failed',
      recommendation: 'Contact support if this error persists',
    }
  }
  
  const duration = performance.now() - startTime
  
  return {
    ...test,
    ...result,
    duration,
  }
}

export function getDefaultTests(): DiagnosticTest[] {
  return [
    {
      id: 'kv-storage',
      name: 'KV Storage Read/Write',
      category: 'storage',
      status: 'pending',
    },
    {
      id: 'kv-keys',
      name: 'KV Keys Retrieval',
      category: 'storage',
      status: 'pending',
    },
    {
      id: 'localStorage',
      name: 'Local Storage Access',
      category: 'storage',
      status: 'pending',
    },
    {
      id: 'data-integrity',
      name: 'Data Integrity Check',
      category: 'data',
      status: 'pending',
    },
    {
      id: 'network-connectivity',
      name: 'Network Status',
      category: 'network',
      status: 'pending',
    },
    {
      id: 'api-endpoint',
      name: 'External API Connectivity',
      category: 'network',
      status: 'pending',
    },
    {
      id: 'performance',
      name: 'JavaScript Performance',
      category: 'performance',
      status: 'pending',
    },
    {
      id: 'memory',
      name: 'Memory Usage',
      category: 'performance',
      status: 'pending',
    },
    {
      id: 'browser-features',
      name: 'Browser Feature Support',
      category: 'browser',
      status: 'pending',
    },
    {
      id: 'spark-user',
      name: 'Spark User API',
      category: 'browser',
      status: 'pending',
    },
  ]
}

export function categorizTests(tests: DiagnosticTest[]): DiagnosticCategory[] {
  const categories: Record<string, DiagnosticCategory> = {
    storage: { id: 'storage', name: 'Storage', tests: [], health: 0 },
    network: { id: 'network', name: 'Network', tests: [], health: 0 },
    performance: { id: 'performance', name: 'Performance', tests: [], health: 0 },
    data: { id: 'data', name: 'Data Integrity', tests: [], health: 0 },
    browser: { id: 'browser', name: 'Browser Features', tests: [], health: 0 },
  }
  
  tests.forEach((test) => {
    if (categories[test.category]) {
      categories[test.category].tests.push(test)
    }
  })
  
  Object.values(categories).forEach((category) => {
    const completed = category.tests.filter((t) => 
      t.status === 'passed' || t.status === 'failed' || t.status === 'warning' || t.status === 'skipped'
    )
    const passed = category.tests.filter((t) => t.status === 'passed')
    
    if (completed.length === 0) {
      category.health = 0
    } else {
      category.health = (passed.length / completed.length) * 100
    }
  })
  
  return Object.values(categories).filter((cat) => cat.tests.length > 0)
}

export async function generateSupportBundle(tests: DiagnosticTest[]): Promise<SupportBundle> {
  const systemInfo = await getSystemInfo()
  const storageInfo = await getStorageInfo()
  const categories = categorizTests(tests)
  
  const sanitizedTests = tests.map((test) => ({
    ...test,
    details: test.details ? sanitizeDetails(test.details) : undefined,
  }))
  
  return {
    timestamp: new Date().toISOString(),
    systemInfo,
    testResults: sanitizedTests,
    categories: categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      health: cat.health,
    })),
    environmentInfo: {
      appVersion: '1.0.0',
      sparkVersion: 'latest',
      reactVersion: '19.2.4',
    },
    storageInfo,
    errors: [],
  }
}

function sanitizeDetails(details: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(details)) {
    if (typeof value === 'string') {
      if (key.toLowerCase().includes('token') || 
          key.toLowerCase().includes('key') || 
          key.toLowerCase().includes('password') ||
          key.toLowerCase().includes('secret')) {
        sanitized[key] = '[REDACTED]'
      } else {
        sanitized[key] = value
      }
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}

export function downloadSupportBundle(bundle: SupportBundle) {
  const json = JSON.stringify(bundle, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `diagnostics-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
