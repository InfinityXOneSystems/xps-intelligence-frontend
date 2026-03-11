# XPS Intelligence — Environment Variables: Single Source of Truth

> **This is the canonical reference for every environment variable used across the XPS
> Intelligence platform.** When adding or changing any variable, update this file first.

---

## Quick Reference — "Where do I set X?"

| Variable | Vercel Env Vars | GitHub Secrets | GitHub Vars | Railway Vars | `.env.local` |
|----------|:--------------:|:--------------:|:-----------:|:------------:|:------------:|
| `VITE_API_URL` | ✅ | — | ✅ (CI build) | — | ✅ |
| `VITE_WS_URL` | ✅ | — | ✅ (CI build) | — | ✅ |
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
| `DATABASE_URL` | — | — | — | 🤖 auto | — |
| `REDIS_URL` | — | — | — | 🤖 auto | — |
| `JWT_SECRET` | — | — | — | ✅ | — |
| `GITHUB_TOKEN` (backend) | — | — | — | ✅ | — |
| `LEADS_REPO_OWNER` | — | — | — | ✅ | — |
| `LEADS_REPO_NAME` | — | — | — | ✅ | — |
| `OPENAI_API_KEY` | ✅ (opt) | — | — | ✅ (opt) | ✅ (opt) |
| `ANTHROPIC_API_KEY` | ✅ (opt) | — | — | ✅ (opt) | ✅ (opt) |
| `GEMINI_API_KEY` | ✅ (opt) | — | — | ✅ (opt) | ✅ (opt) |

🤖 auto = set automatically by the respective platform integration (no manual entry needed)

---

## 1. Frontend (Vercel) — Build-time Bundle Variables

These are baked into the Vite/React browser bundle at build time.
**Never put secrets or API keys here.**

### How to set in Vercel
Vercel Dashboard → Project `xps-intelligence-frontend` → Settings → Environment Variables

| Variable | Value | Env | Notes |
|----------|-------|-----|-------|
| `VITE_API_URL` | `https://xpsintelligencesystem-production.up.railway.app/api` | Production | Must end in `/api` |
| `VITE_WS_URL` | `wss://xpsintelligencesystem-production.up.railway.app` | Production | For real-time updates |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nxfbfbipjsfzoefpgrof.supabase.co` | All | Set by Supabase integration |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `<anon key>` | All | Set by Supabase integration |

> **Prefix rules:**
> - `VITE_*` → exposed in browser bundle (Vite build-time substitution)
> - `NEXT_PUBLIC_*` → also exposed in browser bundle (`vite.config.ts` sets `envPrefix: ['VITE_', 'NEXT_PUBLIC_']`)
> - Everything else → server-side only (Vercel Edge Functions / Railway)

---

## 2. Frontend (Vercel) — Server-side Only Variables

These are available only in Vercel Serverless/Edge Functions (`pages/api/`).
**Never prefix these with `VITE_` or `NEXT_PUBLIC_`.**

### How to set in Vercel
Vercel Dashboard → Project → Settings → Environment Variables

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `BACKEND_URL` | Railway backend base URL (no trailing slash) | Railway project → Settings → Domains |
| `AI_GROQ_API_KEY` | Groq API key for LLM completions | https://console.groq.com/keys |
| `VERCEL_DEPLOY_HOOK` | Vercel deploy hook URL for autonomous redeploy | Vercel → Project → Settings → Git → Deploy Hooks |
| `OPENAI_API_KEY` | OpenAI key (optional) | https://platform.openai.com/api-keys |
| `ANTHROPIC_API_KEY` | Anthropic key (optional) | https://console.anthropic.com/settings/keys |
| `GEMINI_API_KEY` | Google Gemini key (optional) | https://aistudio.google.com/app/apikey |

> `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are also available
> server-side in `pages/api/` (e.g. used by `webhooks/railway.js`).

---

## 3. GitHub Actions — Repository Secrets

Set at: GitHub → `InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND` → Settings →
Secrets and Variables → Actions → **Secrets** (encrypted, never visible in logs)

| Secret | Description | Where to get it |
|--------|-------------|-----------------|
| `VERCEL_TOKEN` | Vercel personal access token for CI deployments | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel team/org ID | Vercel → Team → Settings → General → Team ID |
| `VERCEL_PROJECT_ID` | Vercel project ID | Vercel → Project → Settings → General → Project ID |
| `GITHUB_WEBHOOK_SECRET` | HMAC secret for verifying webhook payloads to Docker stack | Generate: `openssl rand -hex 32` |

> `GITHUB_TOKEN` is automatically injected by GitHub Actions — **do not set it manually**.

---

## 4. GitHub Actions — Repository Variables

Set at: GitHub → `InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND` → Settings →
Secrets and Variables → Actions → **Variables** (visible in logs — non-sensitive only)

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_API_URL` | `https://xpsintelligencesystem-production.up.railway.app/api` | Used in CI build step |
| `VITE_WS_URL` | `wss://xpsintelligencesystem-production.up.railway.app` | Used in CI build step |
| `DOCKER_WEBHOOK_URL` | Railway Docker stack webhook URL | Used by `docker-sync.yml` |

---

## 5. Railway Backend (XPS_INTELLIGENCE_SYSTEM)

Set at: Railway → Project `XPS_INTELLIGENCE_SYSTEM` → Variables tab

| Variable | Description | How to get it |
|----------|-------------|---------------|
| `DATABASE_URL` | PostgreSQL connection string | Auto-set by Railway Postgres plugin |
| `REDIS_URL` | Redis connection string | Auto-set by Railway Redis plugin |
| `JWT_SECRET` | JWT signing secret | Generate: `openssl rand -hex 32` |
| `AI_GROQ_API_KEY` | Groq API key | https://console.groq.com/keys |
| `OPENAI_API_KEY` | OpenAI key (optional) | https://platform.openai.com/api-keys |
| `ANTHROPIC_API_KEY` | Anthropic key (optional) | https://console.anthropic.com/settings/keys |
| `NODE_ENV` | `production` | Hardcode |
| `GITHUB_TOKEN` | PAT with `repo` + `workflow` write | GitHub → Settings → Developer Settings → PATs |
| `LEADS_REPO_OWNER` | `InfinityXOneSystems` | Hardcode |
| `LEADS_REPO_NAME` | `LEADS` | Hardcode |

> `GITHUB_TOKEN` on Railway is a **personal access token** (not the Actions-injected one).
> It needs `repo` + `workflow` scopes to commit to `InfinityXOneSystems/LEADS`.

---

## 6. LEADS Repo (`InfinityXOneSystems/LEADS`) — GitHub Secrets

Set at: GitHub → `InfinityXOneSystems/LEADS` → Settings → Secrets and Variables → Actions

| Secret | Description | Where to get it |
|--------|-------------|-----------------|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | GCP service account JSON for Google Drive upload | GCP Console → IAM → Service Accounts → Keys |
| `GOOGLE_DRIVE_FOLDER_ID` | Google Drive folder ID to mirror LEADS into | Google Drive URL: `...folders/<ID>` |

---

## 7. Vercel OIDC — Keyless Auth (Recommended over static credentials)

Vercel automatically issues short-lived OIDC tokens for each deployment.
These allow **passwordless authentication** with AWS IAM and Google Cloud Workload Identity
without storing long-lived secrets.

### OIDC Token Claims (production environment)

```
iss  → https://oidc.vercel.com/jays-projects-5febe7fa
aud  → https://vercel.com/jays-projects-5febe7fa
sub  → owner:jays-projects-5febe7fa:project:xps-intelligence-frontend:environment:production
```

### Configure AWS OIDC (replaces `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY`)

1. Go to AWS IAM → Identity Providers → Add Provider
   - Provider type: OpenID Connect
   - Provider URL: `https://oidc.vercel.com/jays-projects-5febe7fa`
   - Audience: `https://vercel.com/jays-projects-5febe7fa`
2. Create an IAM role with the provider as trusted entity
   - Condition: `sub = owner:jays-projects-5febe7fa:project:xps-intelligence-frontend:environment:production`
3. In Vercel serverless functions, exchange the OIDC token for AWS credentials using STS `AssumeRoleWithWebIdentity`

### Configure GCP Workload Identity (replaces `GCP_SERVICE_ACCOUNT_KEY`)

1. GCP Console → IAM → Workload Identity Federation → Create Pool
   - Provider: OIDC
   - Issuer URL: `https://oidc.vercel.com/jays-projects-5febe7fa`
   - Allowed audiences: `https://vercel.com/jays-projects-5febe7fa`
2. Map `subject` attribute → `google.subject`
3. Grant the pool access to your service account
4. In Vercel functions, call the GCP token exchange endpoint with the OIDC token

> See Vercel docs: https://vercel.com/docs/security/secure-backend-access/oidc

---

## 8. Prefix Security Rules (always enforce)

```
✅  VITE_API_URL            — safe (public Railway URL)
✅  VITE_WS_URL             — safe (public Railway WebSocket URL)
✅  NEXT_PUBLIC_SUPABASE_URL — safe (public Supabase URL, no secrets)
✅  NEXT_PUBLIC_SUPABASE_ANON_KEY — safe (RLS protects data)

❌  VITE_AI_GROQ_API_KEY    — NEVER (secret key in browser bundle)
❌  VITE_OPENAI_API_KEY     — NEVER (secret key in browser bundle)
❌  VITE_JWT_SECRET         — NEVER (secret in browser bundle)
❌  VITE_VERCEL_TOKEN       — NEVER (secret in browser bundle)
❌  NEXT_PUBLIC_GITHUB_TOKEN — NEVER (secret in browser bundle)
```

---

## 9. Architecture Data Flow (env var dependencies)

```
[Browser]
  └── VITE_API_URL      → fetch(API_BASE + '/...')  → Railway backend
  └── VITE_WS_URL       → WebSocket connection      → Railway backend
  └── NEXT_PUBLIC_SUPABASE_URL + ANON_KEY → supabase-js → Supabase DB

[Vercel Edge (pages/api/)]
  └── BACKEND_URL       → proxyToRailway()          → Railway Control Plane
  └── AI_GROQ_API_KEY   → Groq completions          → Groq API
  └── VERCEL_DEPLOY_HOOK → autonomous redeploy      → Vercel Deploy API
  └── NEXT_PUBLIC_SUPABASE_URL + ANON_KEY → webhook logging → Supabase DB

[GitHub Actions CI]
  └── VITE_API_URL (var) → baked into Vite build
  └── VERCEL_TOKEN (secret) → amondnet/vercel-action deployment
  └── GITHUB_TOKEN (auto) → commit status, GitHub API calls

[Railway Backend]
  └── DATABASE_URL (auto) → PostgreSQL
  └── REDIS_URL (auto)    → Redis / BullMQ
  └── JWT_SECRET          → auth token signing
  └── AI_GROQ_API_KEY     → agent LLM calls
  └── GITHUB_TOKEN (PAT)  → commit to InfinityXOneSystems/LEADS
```
