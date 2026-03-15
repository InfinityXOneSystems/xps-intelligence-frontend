# Remediation Plan — XPS Intelligence Platform

**Created:** 2026-03-15  
**Repository:** `InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND`  
**Companion:** See `docs/FORENSIC_AUDIT_FRONTEND.md` for root-cause analysis.

---

## Priority Levels

| Level | Meaning                                                    |
|-------|------------------------------------------------------------|
| P0    | Blocks users entirely — site broken or authentication fails |
| P1    | Core feature broken — chat, integrations, diagnostics       |
| P2    | Degraded experience — fallback data, missing polish         |
| P3    | Enhancement — nice-to-have improvements                     |

---

## P0 — Critical Fixes (Site Broken)

### P0-FE-01: Stop 401 on `/manifest.json` ✅ Partially fixed

| Field    | Value |
|----------|-------|
| File     | `vercel.json` (code fix done) + Vercel project settings (operator action) |
| Status   | ⚠️ Code fix deployed; **operator must disable Vercel Deployment Protection** |
| Verification | `curl -I https://xps-intelligence.vercel.app/manifest.json` → must return 200 |

**Code fix applied:**
```json
// vercel.json — added:
{
  "source": "/manifest.json",
  "headers": [
    { "key": "Content-Type", "value": "application/manifest+json" },
    { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
  ]
}
```

**Operator action required:**
1. Vercel → Project → Settings → Security
2. Deployment Protection → Disable "Vercel Authentication" for previews
3. Or: test preview while logged into Vercel

---

### P0-FE-02: Chat broken — HTML-as-JSON crash ✅ Fixed

| Field    | Value |
|----------|-------|
| File     | `src/services/chatService.ts`, `src/lib/http/safeJson.ts` (new) |
| Status   | ✅ Fixed in this PR |
| Verification | Send a message in chat → must get a real reply, not `[Offline]` |

**Change:**
- `sendMessage()` now calls `/api/llm/chat` (same-origin Vercel edge) instead of Railway
- `safeJson.ts` created: content-type-aware fetch helper prevents HTML→JSON parse errors
- `sendStreamingMessage()` error handling fixed to use `res.text()` before parse

---

### P0-FE-03: GitHub App OAuth endpoints missing ✅ Fixed

| Field    | Value |
|----------|-------|
| Files    | `pages/api/auth/github/start.ts`, `callback.ts`, `logout.ts`, `session.ts` (all new) |
| Status   | ✅ Fixed in this PR |
| Env vars | `GITHUB_APP_CLIENT_ID`, `GITHUB_APP_CLIENT_SECRET`, `SESSION_SECRET`, `GITHUB_APP_STATE_SECRET` |
| Verification | Visit `/api/auth/github/start` → redirects to GitHub OAuth page |

**GitHub App details:**
- App name: XPS Orchestrator
- App ID: 3093714
- Client ID: `Iv23liAr5LHKydj0JwUh` (set as `GITHUB_APP_CLIENT_ID`)
- Callback URL: `https://xps-intelligence.vercel.app/api/auth/github/callback`

---

## P1 — Core Feature Fixes

### P1-FE-01: GitHub integration status endpoint missing ✅ Fixed

| Field    | Value |
|----------|-------|
| File     | `pages/api/integrations/github/status.ts` (new) |
| Status   | ✅ Fixed in this PR |
| Verification | `GET /api/integrations/github/status` → returns JSON with `status` field |

---

### P1-FE-02: Diagnostics `run` endpoint missing ✅ Fixed

| Field    | Value |
|----------|-------|
| File     | `pages/api/diagnostics/run.ts` (new) |
| Status   | ✅ Fixed in this PR |
| Verification | `POST /api/diagnostics/run` → returns `{ ok: true, data: { overall, checks[] } }` |

---

### P1-FE-03: `/_spark/*` calls in preview/prod

| Field    | Value |
|----------|-------|
| Status   | ⚪ No code changes needed (Spark SDK handles gracefully) |
| Note     | No `/_spark/*` calls found in current codebase. If they reappear after SDK updates, add a runtime environment guard. |

---

### P1-BE-01: Railway backend `/api/health` must return JSON ⚠️ Backend action

| Field    | Value |
|----------|-------|
| Repo     | `InfinityXOneSystems/XPS_INTELLIGENCE_SYSTEM` |
| Status   | ⚠️ Must be fixed in backend repo |
| Verification | `curl https://xpsintelligencesystem-production.up.railway.app/api/health` → `{"status":"ok"}` |

---

### P1-BE-02: `infinity_library/__init__.py` SyntaxError ⚠️ Backend action

| Field    | Value |
|----------|-------|
| Repo     | `InfinityXOneSystems/XPS_INTELLIGENCE_SYSTEM` |
| Status   | ⚠️ Must be fixed in backend repo |
| Fix      | Move `from __future__ import annotations` to line 1 of the file |

---

## P2 — Improvements

### P2-FE-01: Add tests for safeJson and session

| Field    | Value |
|----------|-------|
| Files    | `src/lib/http/__tests__/safeJson.test.ts`, `src/lib/__tests__/session.test.ts` |
| Status   | ✅ Added in this PR |

---

### P2-FE-02: Smoke test runner script

| Field    | Value |
|----------|-------|
| File     | `scripts/smoke-test.js` |
| Status   | ✅ Added in this PR |
| Usage    | `BASE_URL=https://xps-intelligence.vercel.app node scripts/smoke-test.js` |

---

### P2-FE-03: CI workflow for tests

| Field    | Value |
|----------|-------|
| File     | `.github/workflows/ci.yml` updated |
| Status   | ✅ Added `npm test` step |

---

## P3 — Enhancements (Backlog)

- [ ] Store GitHub installation token in Supabase Vault instead of session cookie
- [ ] Add `/api/integrations/github/repos` endpoint for repository list
- [ ] Add admin-gate UI wrapper component (AdminOnly) that checks session.role
- [ ] Add WebSocket reconnect logic with exponential backoff
- [ ] Replace mock agent status data with real Railway endpoint data
- [ ] Add rate limiting to `/api/llm/chat` and `/api/auth/github/*`

---

## Environment Variables Setup (Production)

Set the following in Vercel → Project → Settings → Environment Variables (Production + Preview):

```bash
# P0 — Required immediately
AI_GROQ_API_KEY=<your-groq-api-key>
GITHUB_APP_CLIENT_ID=Iv23liAr5LHKydj0JwUh
GITHUB_APP_CLIENT_SECRET=<from-github-app-settings>
GITHUB_APP_STATE_SECRET=<random-32-char-string>
SESSION_SECRET=<random-32-char-string>

# P1 — Required for full GitHub integration
GITHUB_TOKEN=<PAT-or-installation-token>
BACKEND_URL=https://xpsintelligencesystem-production.up.railway.app
GITHUB_ADMIN_ORG=Infinity-X-One-Systems

# P2 — Required for database features
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
```
