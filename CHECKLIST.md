# Control Plane Implementation Checklist

Use this checklist to track your progress implementing the XPS Intelligence Admin Control Plane.

## Phase 0: Setup & Foundation ✅

- [x] Control plane framework created (`src/controlPlane/`)
- [x] API infrastructure created (`pages/api/_lib/`)
- [x] LLM chat endpoint working (`/api/llm/chat`)
- [x] Diagnostics page created (`DiagnosticsPage.tsx`)
- [x] Integration test endpoints created (GitHub, Supabase, Vercel, Railway, Groq)
- [x] Database schema defined (`supabase-schema.sql`)
- [x] Documentation written
- [x] Supabase package installed

## Phase 1: Deployment & Configuration

- [ ] Supabase project created
- [ ] Database schema executed in Supabase
- [ ] Admin email added to `xps_admins` table
- [ ] Groq API key obtained
- [ ] Vercel environment variables configured:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `AI_GROQ_API_KEY`
- [ ] Application deployed to Vercel
- [ ] Chat API endpoint tested
- [ ] Diagnostics tests run successfully

## Phase 2: UI Integration (Est. 15-30 min)

- [ ] Diagnostics page added to navigation
  - Choose one:
    - [ ] Added to Sidebar navigation
    - [ ] Added button in Settings page
- [ ] Navigation tested in deployed app
- [ ] Diagnostics page accessible to users

## Phase 3: Authentication & Authorization (Est. 1-2 hours)

- [ ] Auth middleware created (`pages/api/_lib/auth.ts`)
  - [ ] Extract user from Supabase session token
  - [ ] Verify JWT signature
  - [ ] Check user against `xps_admins` table
  - [ ] Return 401 if not authenticated
  - [ ] Return 403 if not admin
  - [ ] Include helpful error messages
- [ ] Auth middleware integrated into all protected endpoints
- [ ] Tested with valid admin user
- [ ] Tested with non-admin user (should be denied)
- [ ] Tested without authentication (should be denied)

## Phase 4: GitHub Integration (Est. 2-3 hours)

### Connect/Disconnect
- [ ] `POST /api/integrations/github/connect`
  - [ ] Accept GitHub token
  - [ ] Validate token with GitHub API
  - [ ] Store token in vault
  - [ ] Create integration metadata record
  - [ ] Log audit event
- [ ] `DELETE /api/integrations/github/disconnect`
  - [ ] Remove token from vault
  - [ ] Update integration status
  - [ ] Log audit event

### Actions
- [ ] `GET /api/integrations/github/repos`
  - [ ] Retrieve token from vault
  - [ ] Call GitHub API to list repos
  - [ ] Return formatted repo list
  - [ ] Handle pagination if needed
- [ ] `GET /api/integrations/github/workflows`
  - [ ] Accept repo owner/name as params
  - [ ] List workflows for specified repo
  - [ ] Return workflow metadata
- [ ] `POST /api/integrations/github/workflow-dispatch`
  - [ ] Accept repo, workflow ID, and inputs
  - [ ] Trigger workflow_dispatch event
  - [ ] Return dispatch confirmation
- [ ] `POST /api/integrations/github/issues-create`
  - [ ] Accept repo, title, body
  - [ ] Create GitHub issue
  - [ ] Return issue URL and number

### Testing
- [ ] All GitHub endpoints tested with valid token
- [ ] Error handling tested (invalid token, missing repo, etc.)
- [ ] Audit logs verified

## Phase 5: Supabase Integration (Est. 1-2 hours)

- [ ] `GET /api/integrations/supabase/tables`
  - [ ] Query information_schema
  - [ ] Return list of table names
  - [ ] Include row counts if possible
- [ ] `POST /api/integrations/supabase/preview`
  - [ ] Accept table name
  - [ ] Return first 10-20 rows
  - [ ] Include column names and types
  - [ ] Handle tables with no rows
- [ ] Vault readiness check
  - [ ] Demonstrate secret storage (without exposing value)
  - [ ] Show vault is operational

## Phase 6: Vercel Integration (Est. 1-2 hours)

### Connect
- [ ] `POST /api/integrations/vercel/connect`
  - [ ] Accept Vercel token
  - [ ] Validate with Vercel API
  - [ ] Store in vault

### Actions
- [ ] `GET /api/integrations/vercel/projects`
  - [ ] List all Vercel projects
  - [ ] Return project names and IDs
- [ ] `POST /api/integrations/vercel/deployments`
  - [ ] Accept project ID or name
  - [ ] List recent deployments
  - [ ] Return deployment URLs and status
- [ ] `POST /api/integrations/vercel/redeploy`
  - [ ] Accept deployment ID or project name
  - [ ] Trigger redeploy
  - [ ] Return deployment URL

## Phase 7: Railway Integration (Est. 30 min - 1 hour)

- [ ] Enhanced health check with more details
- [ ] Optional: Railway API integration if token provided
  - [ ] List services
  - [ ] Trigger redeploy
- [ ] Otherwise: Show link to Railway dashboard

## Phase 8: Control Plane UI in Settings (Est. 3-4 hours)

### UI Components
- [ ] New "Control Plane" section in Settings
- [ ] Integration provider cards created (reuse existing card styling)
- [ ] Each card shows:
  - [ ] Provider name and icon
  - [ ] Connection status badge
  - [ ] "Connect" button (if disconnected)
  - [ ] "Test" button
  - [ ] "Disconnect" button (if connected)
  - [ ] Actions dropdown menu
  - [ ] Last tested timestamp
  - [ ] Last error message (if any)

### Integration Cards
- [ ] GitHub card
  - [ ] Connect form (token input)
  - [ ] Actions: List Repos, List Workflows, Trigger Workflow, Create Issue
  - [ ] Modals/dialogs for actions with parameters
- [ ] Supabase card
  - [ ] Auto-configured (already have credentials)
  - [ ] Actions: List Tables, Preview Data
- [ ] Vercel card
  - [ ] Connect form (token input)
  - [ ] Actions: List Projects, List Deployments, Trigger Redeploy
- [ ] Railway card
  - [ ] Display backend URL
  - [ ] Health check action
- [ ] Groq card
  - [ ] Auto-configured
  - [ ] Test chat action

### Functionality
- [ ] Connect flow works (token → vault → update UI)
- [ ] Test button shows success/error toast
- [ ] Disconnect removes token and updates UI
- [ ] Actions open modals with appropriate forms
- [ ] Action results displayed (modal, toast, or inline)
- [ ] Status badges update after test
- [ ] Error messages shown clearly with hints

## Phase 9: Enhanced Diagnostics (Est. 1 hour)

- [ ] Server-side diagnostic runner
  - [ ] `POST /api/diagnostics/run`
  - [ ] Run all tests from backend
  - [ ] Use vault-stored credentials
  - [ ] Return comprehensive report
- [ ] Update Diagnostics page to use server-side runner
- [ ] Add individual test run buttons
- [ ] Add "Refresh" button to update statuses
- [ ] Store last diagnostic run timestamp

## Phase 10: Testing & Quality (Est. 2-3 hours)

### Unit Tests
- [ ] Test `_lib/utils.ts` functions
  - [ ] traceId generation
  - [ ] Response formatting
  - [ ] Validation helpers
  - [ ] Timeout wrapper
- [ ] Test Zod schemas
- [ ] Test vault adapter functions
- [ ] Test auth middleware

### Integration Tests
- [ ] Test chat endpoint end-to-end
- [ ] Test each integration test endpoint
- [ ] Test connect/disconnect flows
- [ ] Test action endpoints with mock/real APIs

### Smoke Tests
- [ ] Create `scripts/smoke.ts` or `scripts/smoke.mjs`
- [ ] Test against deployed environment
- [ ] Exit non-zero on failure
- [ ] Can be run in CI

### CI/CD
- [ ] Create `.github/workflows/control_plane_ci.yml`
- [ ] Run on pull requests
- [ ] Steps: install, typecheck, lint, build
- [ ] Optional: run unit tests
- [ ] Optional: workflow_dispatch to run smoke tests

## Phase 11: Documentation & Polish (Est. 1 hour)

- [ ] Update README with Control Plane features
- [ ] Add screenshots to documentation
- [ ] Create video walkthrough (optional)
- [ ] Update PRD if needed
- [ ] Add troubleshooting FAQ
- [ ] Create user guide for non-technical admins

## Phase 12: Production Readiness (Est. 1-2 hours)

- [ ] Review all environment variables
- [ ] Ensure secrets are not logged
- [ ] Review RLS policies in Supabase
- [ ] Test with multiple admin users
- [ ] Test with non-admin users
- [ ] Load test key endpoints
- [ ] Set up monitoring/alerting
- [ ] Configure rate limiting (if needed)
- [ ] Review Vercel logs for any leaked secrets
- [ ] Perform security audit

## Optional Enhancements

- [ ] OAuth flow for GitHub (instead of PAT)
- [ ] OAuth flow for Vercel
- [ ] Support for GitHub Apps (not just PATs)
- [ ] Webhook management UI
- [ ] Scheduled jobs (cron) management
- [ ] Cost tracking per integration
- [ ] Usage analytics dashboard
- [ ] Integration health history charts
- [ ] Bulk operations (e.g., trigger multiple workflows)
- [ ] Export/import integration configurations
- [ ] Team management (multiple admins)
- [ ] Audit log viewer in UI
- [ ] Notification preferences per integration
- [ ] Integration templates/presets

## Completion Criteria

All items in Phases 1-10 checked off means Control Plane MVP is complete and production-ready.

---

**Progress Tracking**:
- Total Phases: 12 (+ optional enhancements)
- Estimated Total Time: 14-22 hours
- Phase 0 Complete: ✅
- Ready to Begin: Phase 1 (Deployment & Configuration)

Update this checklist as you progress!

