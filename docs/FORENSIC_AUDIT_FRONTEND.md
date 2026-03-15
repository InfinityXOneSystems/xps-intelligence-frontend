# Forensic Audit — Frontend (XPS-INTELLIGENCE-FRONTEND)

**Date:** 2026-03-15  
**Auditor:** Copilot Agent  
**Repo:** `InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND`  
**Production URL:** https://xps-intelligence.vercel.app  
**Preview URL (incident target):** https://xps-intelligence-frontend-lzvavy2ve-jays-projects-5febe7fa.vercel.app  

---

## 1. Architecture Overview

```
Browser
  │
  ▼
Vercel (dist/ static + pages/api/ edge/serverless functions)
  │
  ├── /api/llm/chat         → Groq (AI_GROQ_API_KEY, server-side only)
  ├── /api/auth/github/*    → GitHub OAuth (GitHub App)
  ├── /api/integrations/*   → Proxy/validate to third-party APIs
  ├── /api/diagnostics/*    → Health/self-test
  └── /api/*                → Proxy to Railway (BACKEND_URL)
         │
         ▼
       Railway Backend (xpsintelligencesystem-production.up.railway.app)
```

---

## 2. UI Routes → API Calls → Backend Endpoints

| UI Page             | UI Action                        | API Call                               | Backend / Provider     |
|---------------------|----------------------------------|----------------------------------------|------------------------|
| Chat / HomePage     | Send message                     | POST `/api/llm/chat`                   | Groq (edge function)   |
| Chat / HomePage     | Stream message                   | POST `/api/llm/chat` (stream=true)     | Groq (edge function)   |
| AgentPage           | Run agent                        | POST `/api/run-agent`                  | Railway proxy          |
| ScraperPage         | Start scraper                    | POST `/api/run-scraper`                | Railway proxy          |
| LeadsPage           | Fetch leads                      | GET `/api/leads`                       | Railway proxy / mock   |
| SettingsPage        | Connect GitHub                   | POST `/api/integrations/github/connect`| GitHub API             |
| SettingsPage        | Test GitHub                      | GET `/api/integrations/github/test`    | GitHub API             |
| SettingsPage        | GitHub Status                    | GET `/api/integrations/github/status`  | GitHub API             |
| SettingsPage        | Connect Groq                     | POST `/api/integrations/groq/connect`  | Groq API               |
| SettingsPage        | Connect Railway                  | POST `/api/integrations/railway/connect`| Railway API            |
| DiagnosticsPage     | Run all checks                   | POST `/api/diagnostics/run`            | Vercel self + probes   |
| DiagnosticsPage     | Get status                       | GET `/api/diagnostics/status`          | Vercel self            |
| *(any)*             | GitHub OAuth login               | GET `/api/auth/github/start`           | GitHub OAuth           |
| *(any)*             | GitHub OAuth callback            | GET `/api/auth/github/callback`        | GitHub OAuth           |
| *(any)*             | Logout                           | POST `/api/auth/logout`                | Vercel (cookie clear)  |
| *(any)*             | Session check                    | GET `/api/auth/session`                | Vercel (cookie read)   |
| *(any)*             | Railway health proxy             | GET `/api/health`                      | Railway + Vercel self  |

---

## 3. Environment Variables

### Client-side (VITE_ prefixed — embedded in JS bundle at build time)

| Variable          | Purpose                            | Default                                                  |
|-------------------|------------------------------------|----------------------------------------------------------|
| `VITE_API_URL`    | Railway backend base URL           | `https://xpsintelligencesystem-production.up.railway.app/api` |
| `VITE_WS_URL`     | WebSocket URL                      | `wss://xpsintelligencesystem-production.up.railway.app`  |
| `VITE_APP_NAME`   | App display name                   | `XPS Intelligence`                                       |
| `VITE_APP_VERSION`| App version                        | `1.0.0`                                                  |

### Server-side only (Vercel environment variables — NEVER use VITE_ prefix)

| Variable                   | Purpose                                        | Required   |
|----------------------------|------------------------------------------------|------------|
| `AI_GROQ_API_KEY`          | Groq LLM API key                               | ✅ P0      |
| `GITHUB_APP_CLIENT_ID`     | GitHub App OAuth client ID                     | ✅ P0      |
| `GITHUB_APP_CLIENT_SECRET` | GitHub App OAuth client secret                 | ✅ P0      |
| `GITHUB_APP_STATE_SECRET`  | Random secret for OAuth state CSRF protection  | ✅ P0      |
| `SESSION_SECRET`           | Random 32-char string for session cookie signing| ✅ P0     |
| `GITHUB_TOKEN`             | PAT or installation token (optional fallback)  | ⚪ P1      |
| `BACKEND_URL`              | Railway backend URL for proxy functions        | ⚠️ P1     |
| `SUPABASE_URL`             | Supabase project URL                           | ⚪ P2      |
| `SUPABASE_ANON_KEY`        | Supabase anon key                              | ⚪ P2      |
| `GITHUB_ADMIN_ORG`         | GitHub org whose members get admin role        | ⚪ P2      |

---

## 4. Observed Failures and Root Causes

### F1: `/manifest.json` returns 401

**Symptom:** `Manifest fetch failed, code 401` in browser console.  
**Root cause:** Vercel **Preview Deployment Protection** is enabled at the project level. This is a Vercel setting (not a code issue) that requires the viewer to be logged into Vercel to access preview deployments — including static assets.  
**Impact:** The app appears broken in preview; PWA install fails; browser shows security warning.  
**Fix (operator action required):**  
1. Vercel → Project → **Settings** → **Security** → **Deployment Protection**
2. Disable "Vercel Authentication" for previews (or set to "Only Preview Deployments from Team Members")
3. To test while protection is on, open the preview URL while logged in to Vercel.  
**Code mitigation (done in this PR):**
- Added explicit `Content-Type` and `Cache-Control` headers for `/manifest.json`, `/icon-*.svg`, `/sw.js`, `/robots.txt`, `/favicon.ico` in `vercel.json` — this ensures correct headers once protection is off.
- Added a `manifest_accessible` check in `/api/diagnostics/run` that will detect 401 and surface it in the Diagnostics page.

### F2: Calls to `/_spark/*` return 404

**Symptom:** `/_spark/kv/app-theme`, `/_spark/loaded`, `/_spark/llm` all return 404.  
**Root cause:** The `@github/spark` SDK makes runtime calls to Spark's internal API (`/_spark/*`). These only exist inside the Spark IDE environment. In preview/production (regular Vercel deployment), these paths don't exist.  
**Analysis:** No code in this repository's current state directly calls `/_spark/*` URLs. The SDK itself injects these calls at runtime when it detects it's running inside Spark. When deployed to Vercel, the SDK should gracefully degrade.  
**Impact:** Console noise; potential uncaught promise rejections if Spark SDK version is not Edge-safe.  
**Fix (done in this PR):** None required in code currently. If Spark SDK calls resurface, add a runtime guard:
```ts
// Guard Spark SDK calls
if (window.location.hostname.includes('spark') || window.__SPARK_ENV__) {
  // Spark runtime code here
}
```

### F3: `"Unexpected token 'T' … not valid JSON"` — Chat / Integration fetch crashes

**Symptom:** `SyntaxError: Unexpected token 'T', "The page c"... is not valid JSON` in console.  
**Root cause:** `sendMessage()` in `src/services/chatService.ts` called `${API_CONFIG.API_URL}/chat/send` — the Railway backend URL. When Railway is unreachable or protected, it returns an HTML error page. Calling `.json()` on that HTML throws a `SyntaxError`.  
**Fix (done in this PR):**
1. Created `src/lib/http/safeJson.ts` — a content-type-aware fetch helper that returns structured errors instead of throwing on HTML responses.
2. Rewired `sendMessage()` to call the same-origin Vercel endpoint `/api/llm/chat` instead of Railway directly.
3. Fixed unsafe `.json()` call in `sendStreamingMessage()` to use `res.text()` first.

### F4: `/api/integrations/github/connect` and `/api/integrations/groq/connect` return 404

**Symptom:** Integration "connect" buttons produce 404 network errors.  
**Root cause:** The API routes exist in the codebase (`pages/api/integrations/github/connect.ts`, `pages/api/integrations/groq/connect.ts`) but the Vercel `rewrites` configuration routes `/api/(.*)` to `pages/api/$1`. In Vercel's edge runtime, TypeScript files in `pages/api/` are compiled automatically. If the routes are actually returning 404, the most likely cause is either:
  - The files were not present in the deployed commit, or
  - Vercel's deployment protection was intercepting the API requests and returning 401/404.

**Status:** Routes confirmed present in current codebase. Deployment protection is the most likely cause of observed 404s on preview.

### F5: GitHub App OAuth endpoints missing

**Symptom:** Settings → GitHub "Login with GitHub" has no backend route.  
**Root cause:** `/api/auth/github/start`, `/api/auth/github/callback`, `/api/auth/logout`, `/api/auth/session` did not exist.  
**Fix (done in this PR):** All four endpoints created. See section 6.

---

## 5. Security Assessment

| Area                         | Risk    | Status       | Notes                                              |
|------------------------------|---------|--------------|----------------------------------------------------|
| Secrets in client bundle     | 🔴 HIGH  | ✅ Clean     | No VITE_-prefixed secrets found; AI_GROQ_API_KEY, GITHUB_APP_CLIENT_SECRET are server-side only |
| Session cookie security      | 🟡 MED  | ✅ Fixed      | New session cookie is httpOnly, Secure, SameSite=Lax |
| OAuth state CSRF             | 🟡 MED  | ✅ Fixed      | State verified against cookie in callback         |
| Open redirect in OAuth       | 🟡 MED  | ✅ Fixed      | `return_to` validated to be same-origin path only |
| Vercel deployment protection | 🔴 HIGH  | ⚠️ Operator  | Must be disabled in Vercel settings (not a code fix) |
| GitHub token stored in browser | 🔴 HIGH | ✅ Clean    | Tokens only in server-side env vars or httpOnly cookies |

---

## 6. New Endpoints Added (This PR)

| Endpoint                              | Method     | Purpose                                     |
|---------------------------------------|------------|---------------------------------------------|
| `/api/auth/github/start`              | GET        | Begin GitHub App OAuth flow                 |
| `/api/auth/github/callback`           | GET        | Complete OAuth; set httpOnly session cookie |
| `/api/auth/logout`                    | POST/GET   | Clear session cookie                        |
| `/api/auth/session`                   | GET        | Return current session for browser          |
| `/api/integrations/github/status`     | GET        | GitHub connection/token status              |
| `/api/diagnostics/run`                | POST/GET   | Run all diagnostic checks, return report    |

---

## 7. Files Changed (This PR)

| File                                          | Change          | Reason                                               |
|-----------------------------------------------|-----------------|------------------------------------------------------|
| `src/lib/http/safeJson.ts`                    | Created         | Safe JSON fetch helper                               |
| `src/lib/session.ts`                          | Created         | Browser session utility                              |
| `src/services/chatService.ts`                 | Modified        | Fix sendMessage to use same-origin; safe JSON parsing|
| `pages/api/auth/github/start.ts`              | Created         | GitHub App OAuth start                               |
| `pages/api/auth/github/callback.ts`           | Created         | GitHub App OAuth callback                            |
| `pages/api/auth/logout.ts`                    | Created         | Session logout                                       |
| `pages/api/auth/session.ts`                   | Created         | Session status endpoint                              |
| `pages/api/integrations/github/status.ts`     | Created         | GitHub status endpoint                               |
| `pages/api/diagnostics/run.ts`                | Created         | Full diagnostics run endpoint                        |
| `vercel.json`                                 | Modified        | Headers for public assets (manifest, icons, sw.js)   |
| `docs/FORENSIC_AUDIT_FRONTEND.md`             | Created         | This file                                            |
| `docs/FORENSIC_AUDIT_BACKEND.md`              | Created         | Backend audit companion                              |
| `docs/REMEDIATION_PLAN.md`                    | Created         | P0–P3 remediation plan                               |
| `docs/OPERATIONS_RUNBOOK.md`                  | Created         | Deployment and ops runbook                           |

---

## 8. Verification Checklist

Run these checks on each deployment to confirm health:

```bash
# 1. manifest.json must return 200 with correct content-type
curl -I https://xps-intelligence.vercel.app/manifest.json
# Expected: HTTP/2 200, content-type: application/manifest+json

# 2. Chat must return JSON
curl -s -X POST https://xps-intelligence.vercel.app/api/llm/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"ping","stream":false}' | head -c 200

# 3. Diagnostics must return JSON
curl -s https://xps-intelligence.vercel.app/api/diagnostics/status | head -c 200

# 4. Auth session endpoint
curl -s https://xps-intelligence.vercel.app/api/auth/session | head -c 200
```

See `scripts/smoke-test.js` for an automated smoke test runner.
