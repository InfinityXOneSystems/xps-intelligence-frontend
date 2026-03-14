# XPS Intelligence — Architecture Contract

> **Status**: Active  
> **Version**: 2.0  
> **Enforced By**: CI/CD + Code Review  
> **Last Updated**: 2025-01-XX

---

## Purpose

This document defines the **non-negotiable architectural rules** for the XPS Intelligence dual-repository system. All code changes MUST comply with this contract. Violations will be rejected by CI or code review.

---

## 1. Repository Boundaries

### Frontend Repository (XPS-INTELLIGENCE-FRONTEND)
**Role**: Control Plane UI + Connector Endpoints  
**Deployment**: Vercel  
**Responsibilities**:
- User interface (React/Vite SPA)
- Serverless connector endpoints (`pages/api/*`)
- Client-side state management
- Real-time UI updates via WebSocket

**Forbidden**:
- ❌ Direct database access
- ❌ Long-running computations
- ❌ Agent execution (delegate to backend)
- ❌ Storing secrets in client bundle
- ❌ Hardcoded URLs/ports

### Backend Repository (XPS_INTELLIGENCE_SYSTEM)
**Role**: Execution Plane + Runtime Controller  
**Deployment**: Railway  
**Responsibilities**:
- Express gateway (Node.js)
- Python agent runtime (FastAPI)
- Task queue (BullMQ + Redis)
- Database (PostgreSQL)
- Agent execution + sandbox

**Forbidden**:
- ❌ Direct UI rendering (use frontend repo)
- ❌ Public endpoints without auth
- ❌ Storing secrets in code
- ❌ Hardcoded frontend URLs

---

## 2. Communication Protocol

### Frontend → Backend

**Rule**: All backend communication MUST go through environment-configured URLs.

```typescript
// ✅ CORRECT
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
fetch(`${apiUrl}/leads`)

// ❌ WRONG
fetch('http://localhost:5000/leads')
fetch('https://xpsintelligencesystem-production.up.railway.app/leads') // hardcoded
```

### Backend → Frontend

**Rule**: Backend MAY NOT initiate requests to frontend. Use WebSocket for real-time updates.

```typescript
// ✅ CORRECT
wsClient.send({ type: 'scraper_progress', data: { progress: 75 } })

// ❌ WRONG
fetch('https://xps-intelligence.vercel.app/api/update', ...) // backend calling frontend
```

---

## 3. Agent Execution Architecture

### Mandatory Flow

```
User Command (Frontend)
  ↓
POST /api/agents/execute (Frontend Serverless)
  ↓
POST ${BACKEND_URL}/api/runtime/command (Backend Gateway)
  ↓
Runtime Controller (validates, enqueues)
  ↓
Task Queue (Redis/BullMQ)
  ↓
Worker Process
  ↓
Sandbox Execution (isolated container)
  ↓
Result Stored + WebSocket Notification
  ↓
Frontend receives update
```

**Violations**:
- ❌ Frontend directly calling agent classes
- ❌ Frontend simulating agent execution
- ❌ Backend executing code without sandbox
- ❌ Skipping the runtime controller

### Simulation Mode

**Rule**: Simulation is ONLY allowed as a fallback when backend is unreachable.

```typescript
// ✅ CORRECT
try {
  const result = await fetch(`${apiUrl}/api/runtime/command`, ...)
  if (!result.ok) throw new Error('Backend unavailable')
  return await result.json()
} catch (err) {
  console.warn('Backend unavailable, using simulation')
  return simulateExecution(task) // FALLBACK ONLY
}

// ❌ WRONG
return simulateExecution(task) // always simulating
```

---

## 4. Secret Management

### Storage Rules

| Secret Type | Storage Location | Access Method |
|-------------|------------------|---------------|
| **Frontend Build Time** | Vercel env vars (VITE_ prefix) | `import.meta.env.VITE_*` |
| **Frontend Server-Side** | Vercel env vars (NO VITE_ prefix) | `process.env.*` in `pages/api/*` |
| **User Integration Tokens** | Supabase Vault (server-side) | API call to vault endpoint |
| **Backend Secrets** | Railway env vars | `process.env.*` |

**Violations**:
- ❌ Storing secrets in `localStorage`
- ❌ Storing secrets in client-side code
- ❌ Prefixing secrets with `VITE_` (exposes to client bundle)
- ❌ Committing secrets to git

### Example: Correct Secret Handling

```typescript
// ❌ WRONG — Client-side storage
localStorage.setItem('github_token', token)

// ✅ CORRECT — Server-side storage
await fetch('/api/integrations/github/connect', {
  method: 'POST',
  body: JSON.stringify({ token }),
  headers: { 'Content-Type': 'application/json' }
})
// Backend stores in Supabase Vault, not localStorage
```

---

## 5. API Endpoint Standards

### All API endpoints MUST include:

1. **Method Validation**
```typescript
if (req.method !== 'POST') {
  return res.status(405).json({ error: 'Method not allowed' })
}
```

2. **Input Validation (Zod)**
```typescript
import { z } from 'zod'

const schema = z.object({
  message: z.string().min(1).max(10000),
})

const parsed = schema.safeParse(req.body)
if (!parsed.success) {
  return res.status(400).json({ error: 'Invalid input', details: parsed.error })
}
```

3. **Timeout Handling**
```typescript
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 30000) // 30s

try {
  const result = await fetch(url, { signal: controller.signal })
  // ...
} finally {
  clearTimeout(timeout)
}
```

4. **Consistent Error Response**
```typescript
// ✅ CORRECT
return res.status(500).json({
  ok: false,
  error: {
    code: 'LLM_REQUEST_FAILED',
    message: 'LLM request failed',
    hint: 'Check AI_GROQ_API_KEY is valid',
    details: err.message
  },
  traceId: generateTraceId()
})

// ❌ WRONG
return res.status(500).send('Error') // not JSON
return res.status(500).json({ error: err.message }) // inconsistent shape
```

5. **Logging**
```typescript
try {
  // ...
} catch (err) {
  console.error('[API /chat]', err) // prefix with endpoint name
  // ...
}
```

---

## 6. Connector Architecture

### Universal Connector Interface

All connectors MUST implement:

```typescript
interface IConnector {
  name: string
  version: string
  
  // Establish connection with credentials
  connect(credentials: Record<string, string>): Promise<ConnectResult>
  
  // Test connection health
  test(): Promise<TestResult>
  
  // Get current connection status
  status(): Promise<StatusResult>
  
  // Disconnect and cleanup
  disconnect(): Promise<void>
  
  // List available actions
  actions(): ActionDefinition[]
}

interface ConnectResult {
  ok: boolean
  message?: string
  error?: ErrorDetail
}

interface TestResult {
  ok: boolean
  latency?: number
  message?: string
  error?: ErrorDetail
}

interface StatusResult {
  connected: boolean
  lastTest?: Date
  lastError?: ErrorDetail
}

interface ErrorDetail {
  code: string
  message: string
  hint?: string
  details?: any
}
```

### Required Connectors

1. **GitHub** (`src/lib/connectors/github.ts`)
   - connect, test, listRepos, listWorkflows, dispatchWorkflow, createIssue

2. **Supabase** (`src/lib/connectors/supabase.ts`)
   - connect, test, listTables, previewRows, vaultTest

3. **Vercel** (`src/lib/connectors/vercel.ts`)
   - connect, test, listProjects, listDeployments, triggerRedeploy

4. **Railway** (`src/lib/connectors/railway.ts`)
   - connect, test, getServiceStatus, getRecentLogs

5. **Groq** (`src/lib/connectors/groq.ts`)
   - connect, test, chat

---

## 7. Diagnostics System

### Self-Test Requirements

Every connector MUST provide a self-test that:
1. Returns within 10 seconds
2. Does NOT modify any data
3. Returns a standardized result

```typescript
interface SelfTestResult {
  connector: string
  status: 'PASS' | 'FAIL' | 'WARN'
  latency: number // milliseconds
  message?: string
  error?: ErrorDetail
  timestamp: Date
}
```

### Support Bundle

The diagnostics system MUST be able to export a support bundle containing:
- System status
- All connector test results
- Environment variable presence (NOT values)
- Recent error logs (sanitized)
- Build info (commit SHA, build time)

---

## 8. Authentication & Authorization

### Phase 1 (Current): No Auth
- Acceptable for development/MVP
- All endpoints publicly accessible

### Phase 2 (Production): Supabase Auth
- Login required for all integration management
- Admin role required for:
  - Connector credential management
  - Scraper triggers
  - Agent execution
  - System settings

```typescript
// Future auth middleware
async function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  
  const { data: user, error } = await supabase.auth.getUser(token)
  if (error || !user) return res.status(401).json({ error: 'Invalid token' })
  
  const { data: admin } = await supabase
    .from('xps_admins')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  if (!admin) return res.status(403).json({ error: 'Forbidden' })
  
  req.user = user
  next()
}
```

---

## 9. Testing Requirements

### Unit Tests
- All connector classes MUST have unit tests
- All API endpoints MUST have integration tests
- All validators MUST have test coverage

### Integration Tests
- Full connector test suite MUST run in CI
- Mock external APIs in tests (use nock or MSW)
- Test both success and error paths

### CI Requirements
```yaml
# .github/workflows/comprehensive-validation.yml
- name: Type Check
  run: npm run type-check
  
- name: Lint
  run: npm run lint
  
- name: Build
  run: npm run build
  
- name: Test
  run: npm test
  
- name: Security Audit
  run: npm audit --audit-level=high
```

---

## 10. Performance Requirements

### Bundle Size
- Total JavaScript: < 500 KB (currently 1,447 KB ❌)
- Total CSS: < 80 KB gzip (currently 71 KB ✅)
- Code splitting REQUIRED for production

### API Response Time
- Health checks: < 100ms
- Connector tests: < 10s
- LLM requests: < 30s
- Scraper triggers: async (return taskId immediately)

### Database Queries
- All queries MUST use connection pooling
- All queries MUST have timeouts
- All queries MUST use parameterized queries (no string interpolation)

---

## 11. Deployment Requirements

### Frontend (Vercel)
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "https://xpsintelligencesystem-production.up.railway.app/api",
    "VITE_WS_URL": "wss://xpsintelligencesystem-production.up.railway.app"
  }
}
```

**Required Secrets** (Vercel Dashboard):
- AI_GROQ_API_KEY
- BACKEND_URL
- GITHUB_TOKEN (optional)
- VERCEL_TOKEN (optional)
- RAILWAY_TOKEN (optional)
- SUPABASE_URL (optional)
- SUPABASE_SERVICE_ROLE_KEY (optional)

### Backend (Railway)
```json
// railway.json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "npm run db:migrate && node api/gateway.js",
    "healthcheckPath": "/api/health",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

**Required Environment Variables**:
- DATABASE_URL (auto-provided by Railway)
- REDIS_URL (auto-provided by Railway)
- JWT_SECRET
- AI_GROQ_API_KEY
- XPS_API_TOKEN

---

## 12. Prohibited Patterns

### ❌ NEVER DO THIS

```typescript
// 1. Hardcoded URLs
fetch('http://localhost:5000/api/leads')
fetch('https://xpsintelligencesystem-production.up.railway.app/api/leads')

// 2. Secrets in localStorage
localStorage.setItem('api_key', key)

// 3. Secrets with VITE_ prefix
// .env
VITE_GITHUB_TOKEN=ghp_... // WRONG! Exposed to client bundle

// 4. No error handling
const result = await fetch(url) // might throw
const data = await result.json() // might fail
return data

// 5. Simulating when backend is available
if (import.meta.env.DEV) {
  return simulateExecution(task) // WRONG! Use real backend even in dev
}

// 6. Direct agent class instantiation in frontend
const agent = new BuilderAgent()
await agent.execute(task) // WRONG! Must go through runtime controller

// 7. String concatenation in SQL
db.query(`SELECT * FROM leads WHERE id = ${userId}`) // SQL injection!

// 8. No timeout
await fetch(url) // might hang forever
```

---

## 13. Enforcement

### CI Checks
- ✅ TypeScript compilation must pass
- ✅ ESLint must pass (zero errors)
- ✅ npm audit must pass (high+ vulnerabilities)
- ✅ Build must complete
- ✅ Tests must pass

### Code Review Checklist
- [ ] No hardcoded URLs
- [ ] No secrets in code
- [ ] All API endpoints have error handling
- [ ] All API endpoints have zod validation
- [ ] All API endpoints have timeout handling
- [ ] Connector implements full IConnector interface
- [ ] Agent execution goes through runtime controller
- [ ] No simulation when backend is available
- [ ] Tests added for new functionality

---

## 14. Architecture Decision Records (ADRs)

### ADR-001: Dual Repository Architecture
**Decision**: Split frontend (control plane) and backend (execution plane) into separate repos.  
**Rationale**: Clear separation of concerns, independent deployment cycles, Vercel + Railway optimized hosting.  
**Status**: Active

### ADR-002: Supabase Vault for Secret Storage
**Decision**: Use Supabase Vault (server-side) for all user integration tokens.  
**Rationale**: Secure, auditable, encrypted at rest, better than localStorage.  
**Status**: Planned (P2)

### ADR-003: Runtime Controller Mandatory Path
**Decision**: All agent execution MUST go through backend runtime controller.  
**Rationale**: Centralized execution, resource limits, audit trail, sandbox isolation.  
**Status**: Active (enforcement in progress)

### ADR-004: Connector Interface Standardization
**Decision**: All connectors implement IConnector interface.  
**Rationale**: Consistent API, testability, discoverability, plugin architecture.  
**Status**: Active (implementation in progress)

---

## 15. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-XX | Initial architecture contract |
| 2.0 | 2025-01-XX | Added connector interface, diagnostics requirements, enforcement rules |

---

## 16. Contact & Governance

**Architecture Owner**: Overseer-Prime  
**Review Cadence**: Quarterly or on major changes  
**Amendment Process**: Create PR to this file, requires approval from 2+ maintainers  
**Violation Reporting**: Open GitHub issue with label `architecture-violation`

---

*This contract is enforced by CI/CD and code review. All violations must be fixed before merging.*
