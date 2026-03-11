# XPS Intelligence — Environment Variables: Single Source of Truth

> **This is the canonical reference for every environment variable used across the XPS
> Intelligence platform.** When adding or changing any variable, update this file first.

## Platform Stack

| Layer | Service | Account | Role |
|-------|---------|---------|------|
| **Frontend** | Vercel | [vercel.com](https://vercel.com) | React app + all secrets vault |
| **Backend** | Railway | [railway.app](https://railway.app) | API server (XPS_INTELLIGENCE_SYSTEM repo) |
| **Database** | Supabase | [supabase.com](https://supabase.com) | Postgres + auth (Vercel-native integration) |
| **Source of truth** | GitHub | [github.com/InfinityXOneSystems](https://github.com/InfinityXOneSystems) | Source code + CI/CD |
| **Local dev** | Docker | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop) | Local-only container stack |

> **AWS and GCP are NOT part of this system.** Supabase manages all Postgres.
> All secrets — including Groq API key and all Railway-related keys — are stored in Vercel.

---

## Platform-specific .env Files (copy the right one)

| File | Purpose |
|------|---------|
| `.env.vercel.example` | All Vercel project env vars + step-by-step setup |
| `.env.railway.example` | All Railway backend vars + setup (cross-reference only) |
| `.env.github.example` | All GitHub Actions secrets + variables |
| `.env.supabase.example` | Supabase connection info + Vercel integration guide |
| `.env.docker.example` | Docker local dev stack + all commands |
| `.env.local.example` | Local Vite dev server — `cp .env.local.example .env.local` |
| `.env.example` | Master cross-reference (this file's companion) |

---

## Quick Reference — "Where do I set X?"

| Variable | Vercel Env Vars | GitHub Secrets | GitHub Vars | Railway Vars | `.env.local` |
|----------|:--------------:|:--------------:|:-----------:|:------------:|:------------:|
| `API_URL` | ✅ build | — | ✅ CI | — | ✅ |
| `WS_URL` | ✅ build | — | ✅ CI | — | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | 🤖 auto | — | — | — | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 🤖 auto | — | — | — | ✅ |
| `BACKEND_URL` | ✅ server | — | — | — | ✅ |
| `AI_GROQ_API_KEY` | ✅ server | — | — | ✅ | ✅ |
| `VERCEL_DEPLOY_HOOK` | ✅ server | — | — | — | — |
| `VERCEL_TOKEN` | — | ✅ | — | — | — |
| `VERCEL_ORG_ID` | — | ✅ | — | — | — |
| `VERCEL_PROJECT_ID` | — | ✅ | — | — | — |
| `GITHUB_WEBHOOK_SECRET` | — | ✅ | — | — | ✅ |
| `DOCKER_WEBHOOK_URL` | — | — | ✅ | — | — |
| `DATABASE_URL` | — | — | — | ✅ (Supabase) | — |
| `JWT_SECRET` | — | — | — | ✅ | — |
| `GITHUB_TOKEN` (backend PAT) | — | — | — | ✅ | — |
| `LEADS_REPO_OWNER` | — | — | — | ✅ | — |
| `LEADS_REPO_NAME` | — | — | — | ✅ | — |
| `CORS_ORIGINS` | — | — | — | ✅ | — |
| `OPENAI_API_KEY` | ✅ (opt) | — | — | ✅ (opt) | ✅ (opt) |
| `ANTHROPIC_API_KEY` | ✅ (opt) | — | — | ✅ (opt) | ✅ (opt) |
| `GEMINI_API_KEY` | ✅ (opt) | — | — | ✅ (opt) | ✅ (opt) |
| `OLLAMA_ENDPOINT` | — | — | — | — | ✅ (opt) |

🤖 auto = set automatically by platform integration | build = baked into bundle | server = server-side only

---

## 1. Vercel — Complete Setup Guide

**Account:** [vercel.com/signup](https://vercel.com/signup)
**Team:** jays-projects-5febe7fa
**Project:** xps-intelligence-frontend
**Software:** `npm install -g vercel` → `vercel login` → `vercel link`

### 1a. Build-time Variables (baked into bundle — non-secret URLs only)

Navigate to: **Vercel → Project → Settings → Environment Variables**

Set for environments: Production ✅ Preview ✅ Development ✅

| Variable | Value | How to get |
|----------|-------|------------|
| `API_URL` | `https://xpsintelligencesystem-production.up.railway.app/api` | Railway → service → Settings → Domains |
| `WS_URL` | `wss://xpsintelligencesystem-production.up.railway.app` | Same domain, https→wss |

> **Mechanism:** `vite.config.ts` `define` block reads `process.env.API_URL` at build time
> and inlines it as `import.meta.env.API_URL`. No `VITE_` prefix needed. Set in Vercel as
> a plain environment variable and it works.

### 1b. Supabase Variables (set automatically by Supabase Vercel Integration)

Install once: **[vercel.com/integrations/supabase](https://vercel.com/integrations/supabase)**
→ Add Integration → Select team → Select project → Select Supabase project → Install

After installing, these are auto-populated in all environments:

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nxfbfbipjsfzoefpgrof.supabase.co` | Auto-synced |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Auto-synced, safe in bundle |

### 1c. Server-side Secrets (NOT in browser bundle)

Navigate to: **Vercel → Project → Settings → Environment Variables**
Set as: **Secret** (encrypted) | Environments: Production only (or all as needed)

| Variable | Description | Where to get |
|----------|-------------|--------------|
| `BACKEND_URL` | Railway service base URL (no trailing slash) | Railway → service → Settings → Domains |
| `AI_GROQ_API_KEY` | Groq API key — **Vercel-native** primary LLM | [console.groq.com/keys](https://console.groq.com/keys) |
| `VERCEL_DEPLOY_HOOK` | Deploy hook URL for autonomous Railway failure recovery | Vercel → Project → Settings → Git → Deploy Hooks |
| `OPENAI_API_KEY` | OpenAI (optional) | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `ANTHROPIC_API_KEY` | Anthropic (optional) | [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) |
| `GEMINI_API_KEY` | Google Gemini (optional) | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |

> **Full reference:** `.env.vercel.example`

---

## 2. Railway — Complete Setup Guide

**Account:** [railway.app](https://railway.app) — link with GitHub account
**Project:** XPS_INTELLIGENCE_SYSTEM (backend repo)
**Software:** `npm install -g @railway/cli` → `railway login` → `railway link`

> Railway manages the API server. **Railway does NOT manage the database** — Supabase does.

Navigate to: **Railway → Project → your service → Variables tab**
Use **Raw Editor** for bulk paste or **+ New Variable** for individual entry.

| Variable | Value/Format | How to get |
|----------|-------------|------------|
| `DATABASE_URL` | `postgresql://postgres.xxx:[pwd]@pooler.supabase.com:6543/postgres?pgbouncer=true` | Supabase → Settings → Database → Connection String → URI (pooled) |
| `JWT_SECRET` | 64-char hex | `openssl rand -hex 32` |
| `AI_GROQ_API_KEY` | `gsk_...` | [console.groq.com/keys](https://console.groq.com/keys) |
| `NODE_ENV` | `production` | Hardcode |
| `GITHUB_TOKEN` | `ghp_...` | GitHub → Settings → Developer settings → PATs → New classic token (repo + workflow scopes) |
| `LEADS_REPO_OWNER` | `InfinityXOneSystems` | Hardcode |
| `LEADS_REPO_NAME` | `LEADS` | Hardcode |
| `CORS_ORIGINS` | `https://xps-intelligence-frontend.vercel.app` | Your Vercel domain |
| `OPENAI_API_KEY` | `sk-proj-...` (optional) | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |

> **Redis (optional for BullMQ):** Railway → Project → New → Database → Add Redis
> Railway sets `REDIS_URL` automatically when provisioned.

### Railway Webhook Setup (notifies Vercel on deploy events)

Railway → Project → Settings → Webhooks → Add Webhook:
- **URL:** `https://<your-vercel-domain>/api/webhooks/railway`
- **Events:** `DEPLOY_FAILED` `BUILD_FAILED` `SERVICE_CRASH` `DEPLOY_SUCCEEDED` `VOLUME_FULL`

> **Full reference:** `.env.railway.example`

---

## 3. Supabase — Complete Setup Guide

**Account:** [supabase.com](https://supabase.com) — free tier: 2 projects, 500MB
**Project ref:** `nxfbfbipjsfzoefpgrof`
**Software:** `npm install -g supabase` → `supabase login` → `supabase link --project-ref nxfbfbipjsfzoefpgrof`

> Supabase manages ALL Postgres for this system (both frontend reads and backend writes).

### 3a. Client Variables (safe in browser bundle)

Navigate to: **Supabase → Project → Settings → API**

| Variable | Where found | Notes |
|----------|------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | "Project URL" field | Public, safe to bundle |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | "anon public" key | Public, RLS enforces access |

### 3b. Server Variables (Railway backend only)

| Variable | Where found | Notes |
|----------|------------|-------|
| `DATABASE_URL` | Settings → Database → Connection String → URI (port 6543, pgbouncer) | For Railway production |
| `DATABASE_URL_DIRECT` | Settings → Database → Connection String → URI (port 5432) | For migrations only |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → "service_role" key | **Secret** — bypasses RLS, backend only |

### 3c. Auth Configuration

Navigate to: **Supabase → Authentication → URL Configuration**

| Setting | Value |
|---------|-------|
| Site URL | `https://xps-intelligence-frontend.vercel.app` |
| Redirect URLs | `https://xps-intelligence-frontend.vercel.app/**` |
| | `http://localhost:5173/**` (local Vite) |
| | `http://localhost:3000/**` (local Docker) |

### 3d. Security (Row Level Security)

Enable RLS on ALL tables. Without RLS, the anon key allows public access to all data.

```sql
-- Run in Supabase SQL Editor for each table:
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrape_jobs ENABLE ROW LEVEL SECURITY;
```

> **Full reference:** `.env.supabase.example`

---

## 4. GitHub Actions — Complete Setup Guide

**Account:** [github.com/InfinityXOneSystems](https://github.com/InfinityXOneSystems)
**Repo:** `InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND`
**Software:** `gh auth login` (GitHub CLI)

### 4a. Repository Secrets (encrypted — never visible after saving)

Navigate to: **GitHub → Repo → Settings → Secrets and variables → Actions → Secrets tab**

| Secret | Description | How to get |
|--------|-------------|------------|
| `VERCEL_TOKEN` | Vercel PAT for CI deployments | Vercel → Account Settings → Tokens → Create Token |
| `VERCEL_ORG_ID` | Vercel team ID (`team_xxx`) | Vercel → Team → Settings → General → Team ID |
| `VERCEL_PROJECT_ID` | Vercel project ID (`prj_xxx`) | Vercel → Project → Settings → General → Project ID |
| `GITHUB_WEBHOOK_SECRET` | HMAC secret for webhook verification | `openssl rand -hex 32` |

> `GITHUB_TOKEN` is **automatically injected** by GitHub Actions — never set it manually.

### 4b. Repository Variables (plain-text — visible in logs — non-sensitive only)

Navigate to: **GitHub → Repo → Settings → Secrets and variables → Actions → Variables tab**

| Variable | Value | Notes |
|----------|-------|-------|
| `API_URL` | `https://xpsintelligencesystem-production.up.railway.app/api` | Passed to `npm run build` in CI |
| `WS_URL` | `wss://xpsintelligencesystem-production.up.railway.app` | Same build step |
| `DOCKER_WEBHOOK_URL` | Your Docker/Railway webhook URL | Used by `docker-sync.yml` |

### 4c. GitHub CLI Commands (bulk setup)

```bash
# Secrets
gh secret set VERCEL_TOKEN --repo InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND
gh secret set VERCEL_ORG_ID --repo InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND
gh secret set VERCEL_PROJECT_ID --repo InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND
gh secret set GITHUB_WEBHOOK_SECRET --repo InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND

# Variables
gh variable set API_URL \
  --body "https://xpsintelligencesystem-production.up.railway.app/api" \
  --repo InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND
gh variable set WS_URL \
  --body "wss://xpsintelligencesystem-production.up.railway.app" \
  --repo InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND

# Verify
gh secret list --repo InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND
gh variable list --repo InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND
```

> **Full reference:** `.env.github.example`

---

## 5. Docker — Complete Setup Guide

**Software:** [Docker Desktop](https://www.docker.com/products/docker-desktop) (includes Compose v2)
**Minimum version:** Docker 24.x, Compose v2.x
**Purpose:** Local development only — NOT used in production

### Services in docker-compose.yml

| Service | Port | Description |
|---------|------|-------------|
| `xps-frontend` | 3000 | React production build (nginx/serve) |
| `xps-webhook-receiver` | 3001 | GitHub webhook listener |

### Quick Start

```bash
# 1. Copy the Docker env example
cp .env.docker.example .env.local
# 2. Edit .env.local with your values
# 3. Build and start
docker compose up --build
# Frontend: http://localhost:3000
# Webhook:  http://localhost:3001
```

### Variables for Docker (in .env.local)

| Variable | Local value | Description |
|----------|------------|-------------|
| `API_URL` | `http://localhost:3000/api` | Points to local backend |
| `WS_URL` | `ws://localhost:3000` | Local WebSocket |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nxfbfbipjsfzoefpgrof.supabase.co` | Remote Supabase (or `http://localhost:54321` for local) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key | From Supabase dashboard |
| `BACKEND_URL` | `http://localhost:3000` | Local backend |
| `AI_GROQ_API_KEY` | `gsk_...` | From console.groq.com |
| `GITHUB_WEBHOOK_SECRET` | generated hex | Must match GitHub webhook secret |
| `GITHUB_REPO_OWNER` | `InfinityXOneSystems` | Hardcode |
| `GITHUB_REPO_NAME` | `XPS-INTELLIGENCE-FRONTEND` | Hardcode |

> **Full reference:** `.env.docker.example` (includes all Docker commands)

---

## 6. Security Rules (always enforce)

```
✅  API_URL                      — safe (public Railway URL, baked into bundle)
✅  WS_URL                       — safe (public Railway WebSocket URL)
✅  NEXT_PUBLIC_SUPABASE_URL      — safe (public project URL, no secrets)
✅  NEXT_PUBLIC_SUPABASE_ANON_KEY — safe (RLS enforces all data access)

❌  AI_GROQ_API_KEY in bundle vars — NEVER (server-side Vercel only)
❌  API keys in NEXT_PUBLIC_*      — NEVER (exposed in browser bundle)
❌  JWT_SECRET in any browser var  — NEVER
❌  VERCEL_TOKEN in any browser var — NEVER
❌  Secrets in vercel.json         — NEVER (file is committed to git)
❌  SUPABASE_SERVICE_ROLE_KEY in browser — NEVER (bypasses RLS entirely)
```

---

## 7. Architecture Data Flow (env var dependencies)

```
[Browser bundle — built by Vite]
  └── API_URL (vite.config.ts define → import.meta.env.API_URL)
        → fetch(API_BASE + '/...')        → Vercel Edge proxy (pages/api/)
                                          → Railway backend (BACKEND_URL)
  └── WS_URL (vite.config.ts define → import.meta.env.WS_URL)
        → WebSocket connection            → Railway backend
  └── NEXT_PUBLIC_SUPABASE_URL + ANON_KEY (envPrefix: NEXT_PUBLIC_)
        → supabase-js SDK                → Supabase Postgres (RLS-protected)

[Vercel Edge Functions (pages/api/)]
  └── BACKEND_URL                        → proxyToRailway() → Railway API
  └── AI_GROQ_API_KEY (Vercel-native)     → Groq completions API
  └── VERCEL_DEPLOY_HOOK                 → Vercel Deploy API (auto-recovery)
  └── NEXT_PUBLIC_SUPABASE_* (readable)  → webhook event logging → Supabase

[GitHub Actions CI (.github/workflows/deploy.yml)]
  └── API_URL (var) + WS_URL (var)        → npm run build (Vite define)
  └── VERCEL_TOKEN (secret)               → amondnet/vercel-action → Vercel deploy
  └── GITHUB_TOKEN (auto-injected)        → commit status, PR comments

[Railway Backend (XPS_INTELLIGENCE_SYSTEM)]
  └── DATABASE_URL → Supabase Postgres    → all data persistence
  └── JWT_SECRET                          → auth token signing/verification
  └── AI_GROQ_API_KEY                     → agent LLM execution
  └── GITHUB_TOKEN (PAT)                  → push scrape results → InfinityXOneSystems/LEADS

[Docker Local Stack]
  └── API_URL → http://localhost:3000/api → local or staging backend
  └── NEXT_PUBLIC_SUPABASE_* → same remote Supabase project (or local supabase start)
  └── GITHUB_WEBHOOK_SECRET → webhook-receiver → validates GitHub push events
```

---

## 8. First-Time Setup Checklist

Follow this order when setting up the system from scratch:

```
□ 1. Create Supabase project
       → https://supabase.com → New Project
       → Note: Project URL, anon key, service role key, DB password

□ 2. Create Vercel project
       → https://vercel.com → New Project → Import from GitHub
       → Connect: InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND

□ 3. Install Supabase Vercel Integration
       → https://vercel.com/integrations/supabase
       → Links Supabase ↔ Vercel → auto-sets NEXT_PUBLIC_* vars

□ 4. Set Vercel build env vars (§1a)
       → API_URL, WS_URL

□ 5. Set Vercel server-side secrets (§1c)
       → BACKEND_URL, AI_GROQ_API_KEY, VERCEL_DEPLOY_HOOK

□ 6. Create Railway project
       → https://railway.app → New Project → Deploy from GitHub
       → Connect: InfinityXOneSystems/XPS_INTELLIGENCE_SYSTEM

□ 7. Set Railway variables (§2)
       → DATABASE_URL (from Supabase), JWT_SECRET, AI_GROQ_API_KEY, GITHUB_TOKEN, etc.

□ 8. Set GitHub Actions secrets + variables (§4)
       → VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, GITHUB_WEBHOOK_SECRET
       → API_URL (var), WS_URL (var)

□ 9. Configure Supabase Auth URLs (§3c)
       → Set Site URL and Redirect URLs to your Vercel domain

□ 10. Enable RLS on all Supabase tables (§3d)
       → Run ALTER TABLE ... ENABLE ROW LEVEL SECURITY for each table

□ 11. Set up Railway → Vercel webhook (§2 webhook setup)
       → Enables autonomous failure recovery loop

□ 12. For local dev: cp .env.local.example .env.local
       → Fill in values → npm install → npm run dev
```


