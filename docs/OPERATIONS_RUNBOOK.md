# Operations Runbook — XPS Intelligence Frontend

**Repository:** `InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND`  
**Platform:** Vercel (frontend) + Railway (backend)  
**Last Updated:** 2026-03-15

---

## Quick Reference

| Task | Command / URL |
|------|---------------|
| Deploy | Push to `main` → auto-deploys to production |
| Preview | Any PR or push to non-main branch → preview deployment |
| Production URL | https://xps-intelligence.vercel.app |
| Vercel Dashboard | https://vercel.com/jays-projects-5febe7fa/xps-intelligence-frontend |
| Railway Backend | https://xpsintelligencesystem-production.up.railway.app |
| GitHub App | https://github.com/apps/xps-orchestrator |

---

## 1. Environment Variables

### Setting Variables in Vercel

1. Go to Vercel → Project → **Settings** → **Environment Variables**
2. Select environment: **Production**, **Preview**, or **Development**
3. Add each variable below

### Required Variables (by priority)

#### P0 — Must set before first deploy

```
AI_GROQ_API_KEY              = <groq-api-key>
GITHUB_APP_CLIENT_ID         = Iv23liAr5LHKydj0JwUh
GITHUB_APP_CLIENT_SECRET     = <from github.com/settings/apps/xps-orchestrator>
GITHUB_APP_STATE_SECRET      = <random 32-char secret>
SESSION_SECRET               = <random 32-char secret>
```

#### P1 — Required for full functionality

```
BACKEND_URL                  = https://xpsintelligencesystem-production.up.railway.app
GITHUB_TOKEN                 = <optional PAT for GitHub API calls>
GITHUB_ADMIN_ORG             = Infinity-X-One-Systems
```

#### P2 — Required for database features

```
SUPABASE_URL                 = <your-supabase-project-url>
SUPABASE_ANON_KEY            = <your-supabase-anon-key>
```

### VITE_ Variables (injected at build time, visible in bundle — NO SECRETS)

```
VITE_API_URL                 = https://xpsintelligencesystem-production.up.railway.app/api
VITE_WS_URL                  = wss://xpsintelligencesystem-production.up.railway.app
VITE_APP_NAME                = XPS Intelligence
VITE_APP_VERSION             = 1.0.0
```

⚠️ **Never put API keys or secrets in VITE_ variables.** They are embedded in the JS bundle.

---

## 2. GitHub App Configuration

**App:** XPS Orchestrator  
**App ID:** 3093714  
**Client ID:** `Iv23liAr5LHKydj0JwUh`  
**Owner:** `Infinity-X-One-Systems`  
**App page:** https://github.com/apps/xps-orchestrator

### OAuth Settings (in GitHub App settings)

- **Callback URL:** `https://xps-intelligence.vercel.app/api/auth/github/callback`
- **Setup URL:** (optional)
- **Redirect on update:** No

### Webhook Settings

- **Webhook URL:** `https://xpsintelligencesystem-production.up.railway.app/github/webhook`
- **Webhook Secret:** set as `GITHUB_WEBHOOK_SECRET` on Railway (NOT on Vercel)
- **Content type:** `application/json`

### Permissions Required

| Permission         | Level       | Purpose                     |
|-------------------|-------------|-----------------------------|
| Contents          | Read        | Read repo files              |
| Metadata          | Read        | List repos                   |
| Actions           | Read/Write  | Trigger/monitor workflows    |
| Issues            | Read/Write  | Create issues                |
| Members           | Read        | Check org membership (admin gate) |

### Installing the App

1. Visit https://github.com/apps/xps-orchestrator
2. Click **Install**
3. Select organization: `Infinity-X-One-Systems`
4. Select repositories (or all)

---

## 3. Deployment Workflow

### Automatic (Recommended)

Push to `main` → GitHub Actions runs CI → Vercel auto-deploys.

### Manual Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Deploy preview
vercel
```

### CI Steps (`.github/workflows/ci.yml`)

1. `npm ci` — Install dependencies
2. `npm run check-lockfile` — Verify lockfile sync
3. `npm run lint` — ESLint (zero errors required)
4. `npm audit --audit-level=high` — Security audit
5. `npx tsc --noEmit` — TypeScript type check
6. `npm run build` — Vite production build
7. `npm test` — Unit tests (vitest)

---

## 4. Preview Deployment Protection Fix

If `/manifest.json` returns **401** on a preview deployment:

**Root cause:** Vercel "Deployment Protection" is enabled.

**Fix:**
1. Vercel → Project → **Settings** → **Security**
2. Find **Deployment Protection** (may also be called "Vercel Authentication")
3. Set to **Disabled** for previews, or set to "Only members of your team"
4. Click **Save**
5. Redeploy the preview

**Verify:**
```bash
curl -I https://<your-preview-url>/manifest.json
# Expected: HTTP/2 200
```

---

## 5. Smoke Test

Run the smoke test to verify a deployment is working:

```bash
# Test production
BASE_URL=https://xps-intelligence.vercel.app node scripts/smoke-test.js

# Test a preview
BASE_URL=https://xps-intelligence-frontend-<hash>.vercel.app node scripts/smoke-test.js
```

Expected output:
```
✅ manifest.json — 200 application/manifest+json
✅ /api/diagnostics/status — 200 {"ok":true,...}
✅ /api/llm/chat — 200 {"ok":true,...}
✅ /api/auth/session — 200 {"ok":true,...}
```

---

## 6. Troubleshooting Guide

### Chat returns `[Offline] Chat unavailable: ...`

1. Check `AI_GROQ_API_KEY` is set in Vercel env vars
2. Visit `/api/diagnostics/status` — should show `llm: "configured"`
3. Check Vercel function logs: Vercel → Project → Logs → filter by `/api/llm/chat`

### GitHub OAuth fails (error_description in URL)

1. Verify `GITHUB_APP_CLIENT_ID` and `GITHUB_APP_CLIENT_SECRET` are set in Vercel
2. Verify callback URL in GitHub App settings matches: `https://xps-intelligence.vercel.app/api/auth/github/callback`
3. Check `GITHUB_APP_STATE_SECRET` is set (prevents CSRF)

### `/manifest.json` returns 401

See section 4 — Preview Deployment Protection.

### Integration buttons show "Not configured"

1. Set `GITHUB_TOKEN` (PAT) or configure the GitHub App
2. Verify `GITHUB_APP_CLIENT_ID` and `GITHUB_APP_CLIENT_SECRET` are set for OAuth flow

### Railway backend unreachable

1. Check Railway dashboard: https://railway.app
2. Verify `BACKEND_URL` is set correctly in Vercel
3. Run `/api/health` directly: `curl https://xpsintelligencesystem-production.up.railway.app/api/health`

---

## 7. Preview Recovery Procedure

If a preview deployment is broken after Spark or automated changes:

1. Identify the last-good commit SHA from Vercel deployment history
2. Compare changes: `git diff <good-sha>..HEAD`
3. Revert problematic commits: `git revert <bad-sha>`
4. Push to a new branch and create a PR
5. Review the Vercel preview of the PR before merging

---

## 8. Log Access

| Source        | Access Method                                              |
|---------------|-----------------------------------------------------------|
| Vercel logs   | Vercel → Project → **Logs** → filter by function name    |
| Railway logs  | Railway → Service → **Logs**                             |
| GitHub Actions | GitHub → Actions tab                                    |

All API calls are logged in structured JSON format:
```json
{
  "type": "api_call",
  "method": "POST",
  "endpoint": "/api/llm/chat",
  "traceId": "1741999901-abc123",
  "timestamp": "2026-03-15T01:30:00.000Z"
}
```

Use `traceId` to correlate request logs across Vercel and Railway.
