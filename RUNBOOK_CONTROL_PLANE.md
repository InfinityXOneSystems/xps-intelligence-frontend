# XPS Intelligence Control Plane — Implementation Runbook

> **Repository**: XPS-INTELLIGENCE-FRONTEND  
> **Sprint**: Control Plane P1 Implementation  
> **Status**: 🟡 In Progress  
> **Updated**: 2025-01-XX

---

## Overview

This runbook documents the step-by-step implementation of the **Universal Control Plane** for XPS Intelligence, transforming the frontend from a decorative UI into a fully operational admin control interface with real connector integrations, diagnostics, and auto-heal capabilities.

---

## Phase 0: Forensic Analysis ✅ COMPLETE

### Completed Artifacts
- ✅ `PHASE_0_FORENSIC_AUDIT.md` — Comprehensive analysis of wired vs decorative components
- ✅ `SYSTEM_STATUS.md` — System health dashboard
- ✅ `ARCHITECTURE_CONTRACT.md` — Non-negotiable architectural rules
- ✅ Remediation plan prioritized as P0/P1/P2/P3

### Key Findings
- **Current State**: 60% complete — UI exists, backend integration incomplete
- **Primary Gap**: Agent system simulated, connectors incomplete, no production secret management
- **Recommendation**: Proceed with P1 implementation

---

## Phase 1: Universal Connector System (IN PROGRESS)

### P1-CP-01: Connector Framework ⏳ IN PROGRESS

**Objective**: Create a standardized connector interface for all integrations.

#### Step 1: Define Connector Interface ✅ DONE
```
Created: src/lib/connectors/types.ts
- IConnector interface
- ConnectResult, TestResult, StatusResult types
- ActionDefinition type
- ErrorDetail type
```

#### Step 2: Implement Groq Connector ✅ DONE
```
Created: src/lib/connectors/groq.ts
- GroqConnector class
- connect(), test(), status(), disconnect(), actions()
- Integration with existing /api/integrations/groq/* endpoints
```

#### Step 3: Implement GitHub Connector ⏳ NEXT
```
TODO: src/lib/connectors/github.ts
- GitHubConnector class
- Actions: listRepos, listWorkflows, dispatchWorkflow, createIssue
- Integration with GitHub REST API
```

#### Step 4: Implement Vercel Connector ⏳ PENDING
```
TODO: src/lib/connectors/vercel.ts
- VercelConnector class
- Actions: listProjects, listDeployments, triggerRedeploy
- Integration with Vercel API
```

#### Step 5: Implement Railway Connector ⏳ PENDING
```
TODO: src/lib/connectors/railway.ts
- RailwayConnector class
- Actions: getServiceStatus, getRecentLogs
- Integration with Railway backend
```

#### Step 6: Implement Supabase Connector ⏳ PENDING
```
TODO: src/lib/connectors/supabase.ts
- SupabaseConnector class
- Actions: listTables, previewRows, vaultTest
- Integration with Supabase API
```

#### Step 7: Create Connector Registry ⏳ PENDING
```
TODO: src/lib/connectors/registry.ts
- ConnectorRegistry class
- Register all connectors
- Get connector by name
- List all available connectors
```

---

### P1-CP-02: Complete API Endpoints ⏳ PENDING

**Objective**: Implement missing API endpoints with full error handling.

#### GitHub Endpoints

**Status**: Partial implementation exists

**Missing Endpoints**:
```typescript
// TODO: pages/api/integrations/github/repos.ts
GET /api/integrations/github/repos
- List all repositories for authenticated user
- Requires: GITHUB_TOKEN (header or env)
- Returns: { ok: boolean, repos: Array<{name, full_name, url}>, traceId }

// TODO: pages/api/integrations/github/workflows.ts
GET /api/integrations/github/workflows?owner=X&repo=Y
- List workflows for a repository
- Requires: GITHUB_TOKEN
- Returns: { ok: boolean, workflows: Array<{id, name, path}>, traceId }

// TODO: pages/api/integrations/github/dispatch.ts
POST /api/integrations/github/dispatch
- Trigger workflow dispatch
- Body: { owner, repo, workflow_id, inputs }
- Requires: GITHUB_TOKEN
- Returns: { ok: boolean, message, traceId }

// TODO: pages/api/integrations/github/issues.ts
POST /api/integrations/github/issues
- Create an issue
- Body: { owner, repo, title, body }
- Requires: GITHUB_TOKEN
- Returns: { ok: boolean, issue: {number, url}, traceId }
```

#### Supabase Endpoints

**Status**: Not implemented

**Required Endpoints**:
```typescript
// TODO: pages/api/integrations/supabase/test.ts
POST /api/integrations/supabase/test
- Test Supabase connection
- Body: { supabaseUrl, serviceRoleKey }
- Returns: { ok: boolean, latency, message, traceId }

// TODO: pages/api/integrations/supabase/tables.ts
GET /api/integrations/supabase/tables
- List all tables (requires service role key)
- Returns: { ok: boolean, tables: Array<{name, schema}>, traceId }

// TODO: pages/api/integrations/supabase/preview.ts
GET /api/integrations/supabase/preview?table=X&limit=10
- Preview table rows (read-only)
- Returns: { ok: boolean, rows: Array<any>, count, traceId }

// TODO: pages/api/integrations/supabase/vault/test.ts
POST /api/integrations/supabase/vault/test
- Vault self-check (store/retrieve/delete test secret)
- Does NOT return the secret value
- Returns: { ok: boolean, message, traceId }
```

#### Vercel Endpoints

**Status**: Partial implementation

**Missing Endpoints**:
```typescript
// TODO: pages/api/integrations/vercel/projects.ts
GET /api/integrations/vercel/projects
- List all Vercel projects
- Requires: VERCEL_TOKEN (header or env)
- Returns: { ok: boolean, projects: Array<{id, name, url}>, traceId }

// TODO: pages/api/integrations/vercel/deployments.ts
GET /api/integrations/vercel/deployments?projectId=X&limit=10
- List recent deployments for a project
- Returns: { ok: boolean, deployments: Array<{uid, state, url}>, traceId }

// TODO: pages/api/integrations/vercel/redeploy.ts
POST /api/integrations/vercel/redeploy
- Trigger a redeploy of the latest deployment
- Body: { deploymentId }
- Returns: { ok: boolean, deployment: {uid, state}, traceId }
```

#### Railway Endpoints

**Status**: Basic health check exists

**Missing Endpoints**:
```typescript
// TODO: pages/api/integrations/railway/status.ts
GET /api/integrations/railway/status
- Get service status from Railway backend
- Returns: { ok: boolean, status, uptime, traceId }

// TODO: pages/api/integrations/railway/logs.ts
GET /api/integrations/railway/logs?limit=100
- Get recent logs from Railway backend
- Returns: { ok: boolean, logs: Array<{timestamp, message}>, traceId }
```

#### LLM Unified Endpoint

**Status**: Exists but needs unification

```typescript
// TODO: Verify /api/llm/chat matches /api/chat
// May need to consolidate these endpoints
```

---

### P1-CP-03: Diagnostics System ⏳ PENDING

**Objective**: Implement comprehensive diagnostics with self-tests.

#### Step 1: Create Diagnostics Runner ⏳ PENDING
```
TODO: pages/api/diagnostics/run-all.ts
GET /api/diagnostics/run-all
- Run all connector self-tests in parallel
- Timeout: 30s per test
- Returns: {
    timestamp,
    tests: {
      groq: { status: 'PASS'|'FAIL', latency, error? },
      github: { ... },
      vercel: { ... },
      railway: { ... },
      supabase: { ... }
    },
    summary: { total, passed, failed, warnings }
  }
```

#### Step 2: Create Support Bundle Export ⏳ PENDING
```
TODO: pages/api/diagnostics/export.ts
GET /api/diagnostics/export
- Export support bundle as JSON
- Include: system status, test results, env var presence, build info
- Sanitize: NO secret values, only presence checks
- Returns: downloadable JSON file
```

#### Step 3: Wire Diagnostics to Settings UI ⏳ PENDING
```
TODO: Update src/pages/SettingsPage.tsx or DiagnosticsPage.tsx
- Add "Run Diagnostics" button
- Call /api/diagnostics/run-all on click
- Display results in a table with PASS/FAIL indicators
- Add "Export Support Bundle" button
- Download support bundle JSON
```

---

### P1-CP-04: Wire Settings UI ⏳ PENDING

**Objective**: Connect Settings page integrations to real endpoints.

#### Current State
- SettingsPage.tsx exists with comprehensive UI
- ControlPlanePanel component exists
- Integration sections defined but may use mock data

#### Required Changes
```
TODO: Update src/pages/SettingsPage.tsx
1. Remove any mock/simulated data
2. Wire each integration section to real connector
3. Show real connection status from connector.status()
4. Call real test endpoints when "Test Connection" clicked
5. Display real error messages from connectors
6. Save credentials via connector.connect() (with server-side vault in P2)
```

#### Integration Sections to Wire
- ✅ Groq (already has real endpoints)
- ❌ GitHub (needs wiring to new connector)
- ❌ Vercel (needs wiring to new connector)
- ❌ Railway (needs wiring to new connector)
- ❌ Supabase (needs connector + wiring)

---

### P1-CP-05: LLM Chat Self-Test ⏳ PENDING

**Objective**: Add LLM self-test capability.

#### Step 1: Create LLM Test Endpoint ⏳ PENDING
```
TODO: pages/api/llm/test.ts
POST /api/llm/test
- Send a test message to Groq LLM
- Verify API key is valid
- Return: { ok: boolean, latency, message?, error?, traceId }
```

#### Step 2: Add Self-Test Button to UI ⏳ PENDING
```
TODO: Update Settings/Diagnostics UI
- Add "Run Chat Self-Test" button in LLM section
- Call /api/llm/test on click
- Display: "✅ LLM operational (234ms)" or "❌ LLM test failed: [error]"
```

---

## Phase 2: Backend Verification (PARALLEL TRACK)

### P1-BE-VERIFY-01: Confirm Backend Endpoints ⏳ PENDING

**Objective**: Document and verify backend API contract.

#### Required Actions
```
TODO: Create BACKEND_API_CONTRACT.md
Document all required backend endpoints:
1. GET /api/health
2. POST /api/runtime/command (agent execution)
3. GET /api/runtime/status/:taskId
4. POST /api/runtime/task/:id
5. GET /api/leads (various filters)
6. POST /api/scraper/trigger
7. WebSocket /ws (real-time updates)

For each endpoint, document:
- Method, path, query params, body schema
- Required headers (auth token?)
- Success response schema
- Error response schema
- Example curl command
```

#### Verification Steps
```bash
# TODO: Test backend health
curl https://xpsintelligencesystem-production.up.railway.app/api/health

# TODO: Test agent execution endpoint
curl -X POST https://xpsintelligencesystem-production.up.railway.app/api/runtime/command \
  -H "Content-Type: application/json" \
  -d '{"command":"test","agent":"BuilderAgent"}'

# TODO: Document if endpoints are missing
# If missing, create GitHub issues in XPS_INTELLIGENCE_SYSTEM repo
```

### P1-BE-VERIFY-02: Test CORS Configuration ⏳ PENDING

**Objective**: Verify backend allows Vercel domain.

#### Test From Deployed Frontend
```javascript
// TODO: Deploy frontend to Vercel
// TODO: Open browser console on deployed site
// TODO: Run:
fetch('https://xpsintelligencesystem-production.up.railway.app/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)

// If CORS error: Backend needs to add Vercel domain to CORS allowlist
// Document in BACKEND_API_CONTRACT.md
```

---

## How to Verify Implementation

### Verification Checklist

#### Connector Framework
- [ ] All connector classes implement IConnector interface
- [ ] Each connector has unit tests
- [ ] Connector registry can list all connectors
- [ ] Each connector test() method returns within 10s

#### API Endpoints
- [ ] All endpoints return consistent error shape: `{ ok, error: { code, message, hint, details }, traceId }`
- [ ] All endpoints have zod validation
- [ ] All endpoints have try/catch error handling
- [ ] All endpoints have timeout handling (30s max)
- [ ] All endpoints return 405 for wrong HTTP method

#### Diagnostics
- [ ] /api/diagnostics/run-all executes all tests
- [ ] Results show PASS/FAIL for each connector
- [ ] Support bundle export sanitizes secrets
- [ ] Settings UI displays real test results

#### Settings UI
- [ ] No mock/simulated data in Settings page
- [ ] Each integration shows real connection status
- [ ] Test buttons call real endpoints
- [ ] Errors display with hint/details from connector

---

## Manual Testing Guide

### Test 1: Groq Connector
```bash
# 1. Set AI_GROQ_API_KEY in Vercel dashboard

# 2. Deploy frontend

# 3. Open Settings → AI Models → Groq

# 4. Click "Test Connection"
# Expected: ✅ Connected (XXXms)

# 5. Open Chat panel

# 6. Send a message
# Expected: Receives LLM reply
```

### Test 2: GitHub Connector
```bash
# 1. Set GITHUB_TOKEN in Vercel dashboard (optional)

# 2. Open Settings → GitHub

# 3. Enter GitHub token

# 4. Click "Test Connection"
# Expected: ✅ Connected

# 5. Click "List Repositories"
# Expected: Shows list of repos

# 6. Click "List Workflows" for a repo
# Expected: Shows workflows
```

### Test 3: Diagnostics Suite
```bash
# 1. Open Settings → Diagnostics (or create DiagnosticsPage)

# 2. Click "Run All Diagnostics"
# Expected: Shows progress spinner

# 3. Wait for results
# Expected: Table showing:
#   Groq: ✅ PASS (234ms)
#   GitHub: ✅ PASS (156ms)
#   Vercel: ✅ PASS (89ms)
#   Railway: ✅ PASS (67ms)
#   Supabase: ✅ PASS (123ms)

# 4. Click "Export Support Bundle"
# Expected: Downloads JSON file with system info
```

### Test 4: Backend Integration
```bash
# 1. Open Agent Dashboard

# 2. Create a test agent task

# 3. Click "Execute"
# Expected: Task is sent to backend runtime controller (not simulated)

# 4. Check Task Queue page
# Expected: Shows real task status from backend

# 5. Check System Logs
# Expected: Shows real execution logs
```

---

## Deployment Steps

### Step 1: Set Vercel Environment Variables
```bash
# Vercel Dashboard → Project → Settings → Environment Variables

# Build time (VITE_ prefix):
VITE_API_URL=https://xpsintelligencesystem-production.up.railway.app/api
VITE_WS_URL=wss://xpsintelligencesystem-production.up.railway.app

# Server-side (NO VITE_ prefix):
BACKEND_URL=https://xpsintelligencesystem-production.up.railway.app
AI_GROQ_API_KEY=gsk_...

# Optional:
GITHUB_TOKEN=ghp_...
VERCEL_TOKEN=...
RAILWAY_TOKEN=...
SUPABASE_URL=https://...supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Step 2: Set GitHub Secrets (for CI/CD)
```bash
# GitHub Repository → Settings → Secrets → Actions

VERCEL_TOKEN=...
VERCEL_ORG_ID=...
VERCEL_PROJECT_ID=...
```

### Step 3: Deploy
```bash
# Push to main branch
git push origin main

# GitHub Actions will:
# 1. Run comprehensive-validation.yml
# 2. Run deploy.yml (if secrets are set)
# 3. Deploy to Vercel

# OR manual deploy:
npm run build
vercel --prod
```

### Step 4: Verify Deployment
```bash
# Check frontend health
curl https://xps-intelligence.vercel.app/api/health

# Check backend health
curl https://xpsintelligencesystem-production.up.railway.app/api/health

# Check diagnostics
curl https://xps-intelligence.vercel.app/api/diagnostics/status
```

---

## Rollback Plan

### If Deployment Fails

#### Rollback Frontend
```bash
# Option 1: Revert commit
git revert <commit-sha>
git push origin main

# Option 2: Vercel dashboard rollback
# Vercel → Project → Deployments → Previous deployment → Promote to Production
```

#### Rollback Backend
```bash
# Railway dashboard:
# Project → Deployments → Previous deployment → Redeploy
```

### If Connectors Fail

#### Fallback to Simulation Mode
```typescript
// Emergency fallback: In orchestrator.ts
// Can temporarily enable simulation while connectors are fixed

// DO NOT commit this as permanent solution
if (EMERGENCY_FALLBACK) {
  return simulateExecution(task)
}
```

---

## Success Criteria

### Phase 1 Complete When:
- ✅ All P1-CP tasks complete
- ✅ All connectors implement IConnector
- ✅ All missing API endpoints implemented
- ✅ Diagnostics suite operational
- ✅ Settings UI wired to real endpoints
- ✅ LLM chat self-test works
- ✅ Backend endpoints documented
- ✅ CORS verified
- ✅ All tests pass in CI
- ✅ Deployed to Vercel
- ✅ Manual testing checklist complete

### Ready for Phase 2 (P2) When:
- All Phase 1 success criteria met
- No P1 blockers remain
- System status shows 80%+ green
- User can manage all integrations via UI

---

## Next Phase: P2 (Production Hardening)

### Upcoming Tasks:
1. **P2-CP-01**: Implement Supabase Vault integration (move secrets from localStorage)
2. **P2-CP-02**: Implement Auth Gate (Supabase Auth + admin allowlist)
3. **P2-CP-03**: Implement Auto-Heal system
4. **P2-CP-04**: Connect WebSocket (real-time updates)
5. **P2-FE-01**: Code splitting (reduce bundle size to <500 KB)

---

*This runbook is a living document. Update as implementation progresses.*
