# XPS Intelligence Admin Control Plane - MVP Implementation

## 🎯 Overview

This repository now includes the foundational architecture for an **Admin Control Plane** that transforms XPS Intelligence into a functional admin hub capable of connecting to and managing multiple cloud service integrations.

## ✅ What Has Been Implemented

### 1. Control Plane Framework (`src/controlPlane/`)
- **TypeScript types** for integrations, diagnostics, and API responses
- **Integration registry** defining providers (GitHub, Supabase, Vercel, Railway, Groq)
- **API client** for making integration calls from the frontend
- **Diagnostic test runner** for orchestrating health checks

### 2. Serverless API Infrastructure (`pages/api/`)
- **Shared utilities** (`_lib/utils.ts`):
  - TraceID generation for request tracking
  - Standardized success/error response formatting
  - Zod validation helpers
  - Timeout wrappers
  - Structured logging

- **Vault adapter** (`_lib/vault.ts`):
  - Supabase-based secret storage interface
  - Admin allowlist checking
  - Audit logging functions

### 3. Working API Endpoints

#### LLM Chat
- `POST /api/llm/chat` - Groq LLM integration for AI chat
  - Validates message input
  - Handles timeouts (30s)
  - Returns structured responses

#### Diagnostics
- `GET /api/diagnostics/status` - Quick health check
  - Shows API operational status
  - Checks environment variable configuration

#### Integration Test Endpoints
All endpoints follow the same pattern: validate method → check config → test connectivity → return standardized response

- `GET /api/integrations/groq/test` - Test Groq API connection
- `GET /api/integrations/supabase/test` - Test Supabase database connection
- `GET /api/integrations/github/test` - Test GitHub API with token
- `GET /api/integrations/vercel/test` - Test Vercel API connection
- `GET /api/integrations/railway/test` - Test backend health endpoint

### 4. Diagnostics UI (`src/pages/DiagnosticsPage.tsx`)
A fully functional diagnostics page that:
- Runs all integration tests in parallel
- Displays results with pass/fail status, latency, and error hints
- Shows summary statistics (total, passed, failed, warnings)
- Allows copying the report to clipboard
- Supports downloading a support bundle (JSON) with full diagnostic data
- **Preserves existing XPS aesthetic** - uses same card styling, colors, and UI patterns

### 5. Integration Registry
Defines all supported providers with:
- Provider metadata (name, description, icon)
- Available actions per provider
- API endpoint mapping
- Connection requirements

## 🏗️ Architecture

### Request/Response Standard
All API endpoints return:
```json
{
  "ok": true | false,
  "data": { ...},          // On success
  "error": {               // On failure
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {},         // Optional debug info
    "hint": "How to fix"   // Remediation guidance
  },
  "traceId": "timestamp-random"  // For debugging
}
```

### Security Model
- Secrets stored server-side only (via Supabase vault adapter)
- Admin allowlist via `xps_admins` table
- All API calls include traceId for audit trails
- Timeout protection on all external API calls

## 📋 Database Schema (Supabase)

Required tables:
```sql
-- Admin allowlist
CREATE TABLE xps_admins (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integration metadata (NO SECRETS)
CREATE TABLE xps_integrations (
  integration_id TEXT PRIMARY KEY,
  owner_user_id UUID NOT NULL,
  provider TEXT NOT NULL,
  status JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log
CREATE TABLE xps_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL,
  integration_id TEXT,
  event_type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vault secrets (encrypted)
CREATE TABLE xps_vault_secrets (
  integration_id TEXT PRIMARY KEY,
  owner_user_id UUID NOT NULL,
  secret_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🚀 Quick Start

### 1. Set Environment Variables
In Vercel dashboard, add:
```env
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
AI_GROQ_API_KEY=gsk_...

# Optional (for testing integrations)
GITHUB_TOKEN=ghp_...
VERCEL_TOKEN=...
RAILWAY_TOKEN=...
BACKEND_URL=https://your-backend.railway.app
```

### 2. Initialize Supabase Tables
Run the SQL schema above in your Supabase SQL Editor.

Add your email to the admin allowlist:
```sql
INSERT INTO xps_admins (email) VALUES ('your@email.com');
```

### 3. Access Diagnostics
Navigate to Settings → Advanced → Diagnostics (or directly navigate to `diagnostics` page).

Click "Run All Tests" to check all integrations.

## 🎨 UI Integration

The Diagnostics page has been added to the app router but needs to be wired into the navigation. To complete the UX:

### Option A: Add to Sidebar
Edit `src/components/Sidebar.tsx` to add a "Diagnostics" nav item.

### Option B: Add to Settings
Edit `src/pages/SettingsPage.tsx` to add a "Diagnostics" button that navigates to the diagnostics page (`onNavigate('diagnostics')`).

## 📦 What's Next (Not Yet Implemented)

### High Priority
1. **Authentication Middleware**
   - Create `pages/api/_lib/auth.ts`
   - Validate Supabase session tokens
   - Check admin allowlist
   - Return 401/403 with helpful errors

2. **GitHub Actions**
   - `POST /api/integrations/github/repos` - List repositories
   - `POST /api/integrations/github/workflows` - List workflows for repo
   - `POST /api/integrations/github/workflow-dispatch` - Trigger workflow
   - `POST /api/integrations/github/issues-create` - Create issue

3. **Supabase Actions**
   - `GET /api/integrations/supabase/tables` - List tables
   - `POST /api/integrations/supabase/preview` - Preview table data

4. **Vercel Actions**
   - `GET /api/integrations/vercel/projects` - List projects
   - `POST /api/integrations/vercel/deployments` - List deployments
   - `POST /api/integrations/vercel/redeploy` - Trigger redeploy

5. **Integration Management UI**
   - Add "Control Plane" section to Settings page
   - Provider cards with Connect/Test/Disconnect buttons
   - Status badges showing connection state
   - Actions dropdown menu per provider

### Medium Priority
6. **Connect/Disconnect Endpoints**
   - Store tokens in vault
   - Update integration metadata
   - Log audit events

7. **Diagnostics Enhancement**
   - Server-side diagnostic runner (`POST /api/diagnostics/run`)
   - Run tests from backend with vault-stored credentials
   - More detailed test coverage

### Lower Priority
8. **Unit Tests**
   - Test utility functions
   - Test Zod schemas
   - Mock API endpoints

9. **Smoke Test Script**
   - `scripts/smoke.ts` to test deployed endpoints
   - Can run against preview or production

10. **CI/CD Workflow**
    - `.github/workflows/control_plane_ci.yml`
    - Run type-check, lint, build on PRs
    - Optional smoke tests via workflow_dispatch

## 📝 Implementation Guide

See `CONTROL_PLANE_IMPLEMENTATION.md` for detailed implementation patterns and examples for completing the remaining endpoints.

### Example: Adding a New Integration Action

1. **Create endpoint** (`pages/api/integrations/{provider}/{action}.ts`):
```typescript
import { successResponse, errorResponse, generateTraceId, withTimeout } from '../../_lib/utils'
import { retrieveSecret } from '../../_lib/vault'

export const config = { runtime: 'edge' }

export default async function handler(req: Request) {
  const traceId = generateTraceId()
  
  // 1. Validate method
  if (req.method !== 'POST') {
    return new Response(JSON.stringify(errorResponse('METHOD_NOT_ALLOWED', 'Only POST allowed', undefined, undefined, traceId)), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // 2. Get user session (TODO: implement auth middleware)
  
  // 3. Retrieve credentials from vault
  const secret = await retrieveSecret('provider-id', 'user-id')
  if (!secret) {
    return new Response(JSON.stringify(errorResponse('NOT_CONNECTED', 'Provider not connected', undefined, 'Connect provider first', traceId)), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // 4. Call provider API with timeout
  try {
    const result = await withTimeout(
      fetch('https://api.provider.com/endpoint', {
        headers: { Authorization: `Bearer ${secret.token}` },
      }),
      30000
    )
    
    const data = await result.json()
    return new Response(JSON.stringify(successResponse(data, traceId)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify(errorResponse('API_ERROR', error.message, undefined, 'Check logs', traceId)), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
```

2. **Add to registry** (`src/controlPlane/integrations/registry.ts`):
```typescript
actions: [
  {
    id: 'new-action',
    label: 'New Action',
    description: 'Does something useful',
    requiresConnection: true,
    endpoint: '/api/integrations/provider/action',
    method: 'POST',
  },
]
```

3. **Wire up UI** in Settings or Diagnostics page:
```typescript
const handleAction = async () => {
  const result = await integrationClient.action('/api/integrations/provider/action', 'POST', { param: 'value' })
  if (result.ok) {
    toast.success('Action completed')
  } else {
    toast.error(result.error?.message || 'Action failed')
  }
}
```

## 🔍 Debugging

### Check TraceIDs
All API responses include a `traceId`. Use this to search Vercel logs:
```bash
vercel logs --follow | grep "traceId-value"
```

### Test Endpoints Directly
```bash
curl https://your-app.vercel.app/api/diagnostics/status
curl https://your-app.vercel.app/api/integrations/groq/test
```

### View Diagnostic Report
Run diagnostics in the UI, then click "Copy Report" to get the full JSON output.

## 🪝 Pre-Commit Hooks (Railway Build Protection)

### Problem
Railway builds fail when `package-lock.json` is out of sync with `package.json`:
```
npm ci can only install packages when your package.json and package-lock.json are in sync
```

### Solution: Automated Pre-Commit Validation
We've implemented Husky pre-commit hooks that automatically:
- ✅ Detect changes to `package.json` or `package-lock.json`
- ✅ Verify they're in sync before allowing commits
- ✅ Block commits with clear fix instructions if issues found
- ✅ Integrated into CI/CD pipeline

### Quick Setup
```bash
npm install
```

That's it! Husky hooks are auto-configured via the `prepare` script.

### Usage
```bash
# Add a package
npm install some-package

# Commit (hook automatically validates sync)
git add package.json package-lock.json
git commit -m "Add some-package"
```

### If You See an Error
```
❌ COMMIT BLOCKED: package-lock.json is out of sync
```

**Fix:**
```bash
npm install
git add package-lock.json
git commit
```

### Manual Check
```bash
npm run check-lockfile
```

### Documentation
- **Quick Start**: See [LOCKFILE_SYNC_QUICKSTART.md](./LOCKFILE_SYNC_QUICKSTART.md)
- **Full Guide**: See [PRE_COMMIT_HOOKS.md](./PRE_COMMIT_HOOKS.md)

## 📚 Resources

- [Supabase Vault Documentation](https://supabase.com/docs/guides/database/vault)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Groq API Reference](https://console.groq.com/docs)
- [GitHub REST API](https://docs.github.com/en/rest)

## 🤝 Contributing

When adding new endpoints:
1. Follow the existing pattern in `pages/api/`
2. Use shared utilities from `_lib/`
3. Return standardized responses
4. Add proper error handling and hints
5. Include timeout protection
6. Log with traceId

## 📄 License

See LICENSE file in repository root.

---

**Status**: MVP foundation complete. Ready for endpoint expansion and UI integration.

**Next Immediate Steps**:
1. Wire Diagnostics page into navigation
2. Implement auth middleware
3. Add GitHub actions endpoints
4. Build Control Plane UI in Settings

