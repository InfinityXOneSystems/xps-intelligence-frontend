# XPS Intelligence Admin Control Plane Implementation Guide

## Overview
This document describes the Admin Control Plane architecture implemented for XPS Intelligence. The control plane transforms the deployed site into a functional admin hub that can connect to and manage multiple cloud service accounts.

## Architecture

### 1. Frontend Structure
```
src/controlPlane/
├── integrations/
│   ├── types.ts          # TypeScript interfaces for integrations
│   ├── registry.ts       # Provider registry with actions
│   └── client.ts         # API client for integration endpoints
└── diagnostics/
    ├── types.ts          # Diagnostic report types
    └── runner.ts         # Test orchestration
```

### 2. Backend API Structure
```
pages/api/
├── _lib/
│   ├── utils.ts          # Shared utilities (traceId, logging, validation)
│   └── vault.ts          # Supabase vault adapter for secret storage
├── llm/
│   └── chat.ts           # Groq LLM chat endpoint
├── diagnostics/
│   ├── status.ts         # Health check endpoint
│   └── run.ts            # Run full diagnostic suite
└── integrations/
    ├── github/
    │   ├── connect.ts    # Store GitHub token
    │   ├── test.ts       # Test GitHub connection
    │   ├── repos.ts      # List repositories
    │   ├── workflows.ts  # List workflows for repo
    │   ├── workflow-dispatch.ts  # Trigger workflow
    │   └── issues-create.ts      # Create issue
    ├── supabase/
    │   ├── test.ts       # Test database connection
    │   ├── tables.ts     # List tables
    │   └── preview.ts    # Preview table data
    ├── vercel/
    │   ├── test.ts       # Test Vercel API
    │   ├── projects.ts   # List projects
    │   ├── deployments.ts # List deployments
    │   └── redeploy.ts    # Trigger redeploy
    └── railway/
        └── test.ts        # Health check backend
```

### 3. Database Schema (Supabase)

```sql
-- Admin allowlist
CREATE TABLE xps_admins (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integration metadata (NO secrets here)
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

-- Vault secrets (encrypted storage)
CREATE TABLE xps_vault_secrets (
  integration_id TEXT PRIMARY KEY,
  owner_user_id UUID NOT NULL,
  secret_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Implementation Status

### ✅ Completed
1. **Control Plane Framework**
   - TypeScript types for integrations and diagnostics
   - Integration registry with provider metadata
   - API client for making integration calls
   - Diagnostic test runner

2. **Shared API Infrastructure**
   - Utility functions for traceId generation, logging, validation
   - Vault adapter for secret storage/retrieval
   - Standardized API response format
   - Zod validation helpers

3. **LLM Chat Endpoint**
   - `/api/llm/chat` - Groq integration for chat
   - Proper error handling and timeouts
   - Environment variable validation

### 🚧 Requires Completion

The following components need to be created to complete the implementation:

#### 1. Authentication & Authorization
Create `pages/api/_lib/auth.ts`:
```typescript
// Middleware to verify Supabase session and check admin status
// Extract user from JWT, validate against xps_admins table
// Return 401/403 with helpful error messages
```

#### 2. GitHub Integration Endpoints
- `pages/api/integrations/github/connect.ts`
- `pages/api/integrations/github/test.ts`
- `pages/api/integrations/github/repos.ts`
- `pages/api/integrations/github/workflows.ts`
- `pages/api/integrations/github/workflow-dispatch.ts`
- `pages/api/integrations/github/issues-create.ts`

Pattern for each endpoint:
```typescript
import { Octokit } from 'octokit'
import { retrieveSecret } from '../../_lib/vault'
import { successResponse, errorResponse, validateMethod } from '../../_lib/utils'

export default async function handler(req: Request) {
  // 1. Validate method
  // 2. Authenticate user
  // 3. Retrieve token from vault
  // 4. Call GitHub API with timeout
  // 5. Return standardized response
}
```

#### 3. Supabase Integration Endpoints
- `pages/api/integrations/supabase/test.ts`
- `pages/api/integrations/supabase/tables.ts`
- `pages/api/integrations/supabase/preview.ts`

#### 4. Vercel Integration Endpoints
- `pages/api/integrations/vercel/test.ts`
- `pages/api/integrations/vercel/projects.ts`
- `pages/api/integrations/vercel/deployments.ts`
- `pages/api/integrations/vercel/redeploy.ts`

#### 5. Railway Integration Endpoint
- `pages/api/integrations/railway/test.ts`

#### 6. Diagnostics Endpoints
- `pages/api/diagnostics/status.ts` - Quick health check
- `pages/api/diagnostics/run.ts` - Run full test suite

#### 7. Frontend Integration Panel
Update `src/pages/SettingsPage.tsx` to add new "Control Plane" section:
```tsx
// Add integration management UI
// Each provider card shows:
// - Connection status badge
// - Connect/Disconnect buttons
// - Test button
// - Actions dropdown menu
// Use existing card styling to maintain aesthetics
```

#### 8. Diagnostics Page
Create `src/pages/DiagnosticsPage.tsx`:
```tsx
// Display test results from diagnostics runner
// Show PASS/FAIL status with latency
// "Run All Tests" button
// "Copy Report" and "Download Support Bundle" buttons
```

## Environment Variables

### Required
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
AI_GROQ_API_KEY=gsk_...
```

### Optional (for provider integrations)
```env
GITHUB_TOKEN=ghp_...          # Fallback if user doesn't connect
VERCEL_TOKEN=...              # For Vercel API
RAILWAY_TOKEN=...             # For Railway API
BACKEND_URL=https://...       # Railway backend health check URL
```

## API Response Standard

All endpoints return:
```typescript
{
  ok: boolean
  data?: T                    // On success
  error?: {
    code: string
    message: string
    details?: unknown
    hint?: string             // Remediation guidance
  }
  traceId: string             // For debugging
}
```

## Security Model

1. **No Secrets in Browser**
   - All tokens stored server-side in Supabase vault
   - Only metadata exposed to frontend

2. **Admin Allowlist**
   - Check user email against `xps_admins` table
   - Return 403 with clear error if not authorized

3. **Audit Logging**
   - All integration actions logged to `xps_audit_log`
   - Include user, action, timestamp, payload

4. **Timeout Protection**
   - All external API calls wrapped with 30s timeout
   - Prevent hanging requests

## Testing Strategy

### Unit Tests
Create `pages/api/_lib/utils.test.ts`:
- Test traceId generation
- Test response formatting
- Test validation helpers

### Smoke Tests
Create `scripts/smoke.ts`:
```typescript
// Test each endpoint with real or mock data
// Exit non-zero on failure
// Can run against deployed environment
```

### CI/CD Workflow
Create `.github/workflows/control_plane_ci.yml`:
```yaml
on: [pull_request, workflow_dispatch]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run build
      # - run: npm test  # When tests are implemented
```

## Next Steps

1. **Initialize Supabase Tables**
   - Run SQL schema in Supabase dashboard
   - Add your email to `xps_admins` table

2. **Complete API Endpoints**
   - Follow patterns in `pages/api/llm/chat.ts`
   - Use vault adapter for secret storage
   - Add proper error handling

3. **Build Integration UI**
   - Add "Control Plane" section to Settings
   - Reuse existing card styling
   - Wire up integration client

4. **Add Diagnostics Page**
   - Create new page with test runner
   - Show results in table format
   - Support bundle download

5. **Testing & Deployment**
   - Write unit tests
   - Create smoke test script
   - Deploy to Vercel
   - Test end-to-end flows

## Support

For issues or questions:
1. Check diagnostic report for hints
2. Review audit log for failed actions
3. Check Vercel logs for traceId
4. Verify environment variables are set

