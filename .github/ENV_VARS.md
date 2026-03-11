# XPS Intelligence — Environment Variables: Single Source of Truth

> **This is the canonical reference for every environment variable used across the XPS
> Intelligence platform.** When adding or changing any variable, update this file first.

## Platform Stack

| Layer | Service | Role |
|-------|---------|------|
| **Frontend** | Vercel | React app + all secrets vault |
| **Backend** | Railway | API server (XPS_INTELLIGENCE_SYSTEM repo) |
| **Database** | Supabase | Postgres + auth (Vercel-native integration) |
| **Source of truth** | GitHub | Source code + CI/CD |
| **Local dev** | Docker | Local-only container stack |

> AWS and GCP are **not** part of this system. Supabase manages all Postgres.
> All secrets — including Groq API key and all Railway-related keys — are stored in Vercel.

---

## Quick Reference — "Where do I set X?"

| Variable | Vercel Env Vars | GitHub Secrets | GitHub Vars | Railway Vars | `.env.local` |
|----------|:--------------:|:--------------:|:-----------:|:------------:|:------------:|
| `API_URL` | ✅ | — | ✅ (CI build) | — | ✅ |
| `WS_URL` | ✅ | — | ✅ (CI build) | — | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | 🤖 auto | — | — | — | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 🤖 auto | — | — | — | ✅ |
| `BACKEND_URL` | ✅ | — | — | — | ✅ |
| `AI_GROQ_API_KEY` | ✅ | — | — | ✅ | ✅ |
| `VERCEL_DEPLOY_HOOK` | ✅ | — | — | — | — |
| `VERCEL_TOKEN` | — | ✅ | — | — | — |
| `VERCEL_ORG_ID` | — | ✅ | — | — | — |
| `VERCEL_PROJECT_ID` | — | ✅ | — | — | — |
| `GITHUB_WEBHOOK_SECRET` | — | ✅ | — | — | — |
| `DOCKER_WEBHOOK_URL` | — | — | ✅ | — | — |
| `DATABASE_URL` | — | — | — | 🤖 auto (Supabase) | — |
| `JWT_SECRET` | — | — | — | ✅ | — |
| `GITHUB_TOKEN` (backend) | — | — | — | ✅ | — |
| `LEADS_REPO_OWNER` | — | — | — | ✅ | — |
| `LEADS_REPO_NAME` | — | — | — | ✅ | — |
| `OPENAI_API_KEY` | ✅ (opt) | — | — | ✅ (opt) | ✅ (opt) |
| `ANTHROPIC_API_KEY` | ✅ (opt) | — | — | ✅ (opt) | ✅ (opt) |
| `GEMINI_API_KEY` | ✅ (opt) | — | — | ✅ (opt) | ✅ (opt) |

🤖 auto = set automatically by the platform integration (no manual entry needed)

---

## 1. Frontend (Vercel) — Build-time Bundle Variables

Injected into the Vite/React browser bundle at build time via `vite.config.ts` `define`.
Set in Vercel → Project `xps-intelligence-frontend` → Settings → Environment Variables.
**These are non-secret public URLs only.**

| Variable | Value | Notes |
|----------|-------|-------|
| `API_URL` | `https://xpsintelligencesystem-production.up.railway.app/api` | Must end in `/api` |
| `WS_URL` | `wss://xpsintelligencesystem-production.up.railway.app` | For real-time updates |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nxfbfbipjsfzoefpgrof.supabase.co` | Set by Supabase integration |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `<anon key>` | Set by Supabase integration |

> **How `API_URL` and `WS_URL` are injected:**
> `vite.config.ts` uses a `define` block to read `process.env.API_URL` at build time and
> inline it as `import.meta.env.API_URL` throughout the bundle. No `VITE_` prefix needed.
>
> `NEXT_PUBLIC_*` vars are exposed via `envPrefix: ['NEXT_PUBLIC_']` in `vite.config.ts`
> — the Supabase Vercel integration sets these automatically.

> **Security rule:** Never put API keys or secrets in `NEXT_PUBLIC_*` variables.
> `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe because Supabase Row Level Security
> controls all data access, not the key itself.

---

## 2. Frontend (Vercel) — Server-side Only Variables

Available only in Vercel Serverless/Edge Functions (`pages/api/`).
**Never add these to Vercel's build environment** — set them as server-side env vars only.

Set in: Vercel → Project → Settings → Environment Variables (uncheck "Client" / set to "Server")

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `BACKEND_URL` | Railway backend base URL (no trailing slash) | Railway → Project → Settings → Domains |
| `AI_GROQ_API_KEY` | Groq API key — **Vercel-native** primary LLM | https://console.groq.com/keys |
| `VERCEL_DEPLOY_HOOK` | Vercel deploy hook for autonomous redeploy on Railway failures | Vercel → Project → Settings → Git → Deploy Hooks |
| `OPENAI_API_KEY` | OpenAI key (optional) | https://platform.openai.com/api-keys |
| `ANTHROPIC_API_KEY` | Anthropic key (optional) | https://console.anthropic.com/settings/keys |
| `GEMINI_API_KEY` | Google Gemini key (optional) | https://aistudio.google.com/app/apikey |

> `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are also readable
> server-side in `pages/api/` (e.g. `webhooks/railway.js` logs events to Supabase).

---

## 3. GitHub Actions — Repository Secrets

Set at: GitHub → `InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND` → Settings →
Secrets and Variables → Actions → **Secrets** (encrypted, never visible in logs)

| Secret | Description | Where to get it |
|--------|-------------|-----------------|
| `VERCEL_TOKEN` | Vercel personal access token for CI deployments | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel team/org ID | Vercel → Team → Settings → General → Team ID |
| `VERCEL_PROJECT_ID` | Vercel project ID | Vercel → Project → Settings → General → Project ID |
| `GITHUB_WEBHOOK_SECRET` | HMAC secret for Docker stack webhook verification | Generate: `openssl rand -hex 32` |

> `GITHUB_TOKEN` is automatically injected by GitHub Actions — **do not set it manually**.

---

## 4. GitHub Actions — Repository Variables

Set at: GitHub → `InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND` → Settings →
Secrets and Variables → Actions → **Variables** (visible in logs — non-sensitive only)

| Variable | Value | Notes |
|----------|-------|-------|
| `API_URL` | `https://xpsintelligencesystem-production.up.railway.app/api` | Passed to `npm run build` in CI |
| `WS_URL` | `wss://xpsintelligencesystem-production.up.railway.app` | Passed to `npm run build` in CI |
| `DOCKER_WEBHOOK_URL` | Railway Docker stack webhook URL | Used by `docker-sync.yml` |

---

## 5. Railway Backend (XPS_INTELLIGENCE_SYSTEM)

Set at: Railway → Project `XPS_INTELLIGENCE_SYSTEM` → Variables tab

| Variable | Description | How to get it |
|----------|-------------|---------------|
| `DATABASE_URL` | Supabase Postgres connection string | Supabase → Project → Settings → Database → Connection String |
| `JWT_SECRET` | JWT signing secret | Generate: `openssl rand -hex 32` |
| `AI_GROQ_API_KEY` | Groq API key | https://console.groq.com/keys |
| `OPENAI_API_KEY` | OpenAI key (optional) | https://platform.openai.com/api-keys |
| `ANTHROPIC_API_KEY` | Anthropic key (optional) | https://console.anthropic.com/settings/keys |
| `NODE_ENV` | `production` | Hardcode |
| `GITHUB_TOKEN` | PAT with `repo` + `workflow` write | GitHub → Settings → Developer Settings → PATs |
| `LEADS_REPO_OWNER` | `InfinityXOneSystems` | Hardcode |
| `LEADS_REPO_NAME` | `LEADS` | Hardcode |

> **Supabase manages all Postgres.** `DATABASE_URL` points to Supabase, not a
> separate Railway Postgres instance. Railway's built-in Postgres plugin is not used.
>
> **Redis** — if used for BullMQ: Railway Redis plugin sets `REDIS_URL` automatically.

---

## 6. Vercel OIDC — Keyless Auth

Vercel automatically issues short-lived OIDC tokens for each deployment.
These are available in Vercel Edge Functions and can authenticate with any OIDC-capable
service (e.g., a future GitHub App or custom auth service) **without storing long-lived tokens**.

### OIDC Token Claims (production environment)

```
iss  → https://oidc.vercel.com/jays-projects-5febe7fa
aud  → https://vercel.com/jays-projects-5febe7fa
sub  → owner:jays-projects-5febe7fa:project:xps-intelligence-frontend:environment:production
exp  → 1 hour from issuance (short-lived — automatically rotated)
```

> The OIDC token is useful for authenticating Vercel Edge Functions to other services
> without static credentials. Since AWS and GCP are not part of this system, the primary
> use case is service-to-service auth within the Vercel ↔ Railway ↔ Supabase stack.
>
> See Vercel docs: https://vercel.com/docs/security/secure-backend-access/oidc

---

## 7. Security Rules (always enforce)

```
✅  API_URL              — safe (public Railway URL, injected at build time)
✅  WS_URL               — safe (public Railway WebSocket URL)
✅  NEXT_PUBLIC_SUPABASE_URL — safe (public Supabase URL, no secrets)
✅  NEXT_PUBLIC_SUPABASE_ANON_KEY — safe (RLS protects data)

❌  API keys in NEXT_PUBLIC_* — NEVER (exposed in browser bundle)
❌  AI_GROQ_API_KEY in build vars — NEVER (server-side Vercel only)
❌  JWT_SECRET in any browser var — NEVER
❌  VERCEL_TOKEN in any browser var — NEVER
❌  Secrets in vercel.json — NEVER (file is committed to git)
```

---

## 8. Architecture Data Flow (env var dependencies)

```
[Browser bundle — built by Vite]
  └── API_URL (injected by vite.config.ts define)
        → fetch(API_BASE + '/...')          → Vercel Edge proxy → Railway backend
  └── WS_URL (injected by vite.config.ts define)
        → WebSocket connection              → Railway backend
  └── NEXT_PUBLIC_SUPABASE_URL + ANON_KEY (via envPrefix: NEXT_PUBLIC_)
        → supabase-js                       → Supabase Postgres

[Vercel Edge Functions (pages/api/)]
  └── BACKEND_URL                           → proxyToRailway() → Railway Control Plane
  └── AI_GROQ_API_KEY (Vercel-native)        → Groq completions API
  └── VERCEL_DEPLOY_HOOK                    → Vercel Deploy API (autonomous redeploy)
  └── NEXT_PUBLIC_SUPABASE_URL + ANON_KEY   → webhook event logging → Supabase

[GitHub Actions CI]
  └── API_URL (var)                          → npm run build (Vite define)
  └── VERCEL_TOKEN (secret)                  → amondnet/vercel-action deployment
  └── GITHUB_TOKEN (auto)                    → commit status, GitHub API

[Railway Backend]
  └── DATABASE_URL (Supabase Postgres)       → all data persistence
  └── JWT_SECRET                             → auth token signing
  └── AI_GROQ_API_KEY                        → agent LLM calls
  └── GITHUB_TOKEN (PAT)                     → commit to InfinityXOneSystems/LEADS
```

