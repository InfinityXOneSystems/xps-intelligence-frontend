# Docker — XPS Intelligence Frontend

End-to-end guide for building, running, and publishing the XPS Intelligence
Frontend Docker image. The image serves the pre-built Vite static bundle via
[`serve`](https://github.com/vercel/serve) on **port 3000**.

---

## Architecture overview

```
Browser → Vercel (static + pages/api/ serverless)
                │
                ├─ /api/chat       → Groq LLM  (AI_GROQ_API_KEY, server-side)
                ├─ /api/agent      → Railway backend proxy
                └─ /api/groq-test  → Groq connectivity test

Docker image  → same static files, port 3000
               (serverless /api/* only available via `vercel dev`)
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Docker | ≥ 24 |
| Docker Compose | ≥ v2 (bundled with Docker Desktop) |
| Node.js (local dev only) | 20 LTS |

---

## Environment variables

| Variable | Where set | Purpose |
|----------|-----------|---------|
| `VITE_API_URL` | Docker build arg | Railway API URL baked into bundle |
| `VITE_WS_URL` | Docker build arg | Railway WebSocket URL baked into bundle |
| `AI_GROQ_API_KEY` | Runtime env / Vercel dashboard | Groq API key (server-side only, **never** `VITE_` prefix) |
| `BACKEND_URL` | Runtime env / Vercel dashboard | Railway base URL for `/api/agent` proxy |

> **Important**: `VITE_*` vars are baked in at _build_ time by Vite — they
> cannot be changed at runtime without rebuilding the image. `AI_GROQ_API_KEY`
> and `BACKEND_URL` are runtime secrets used only by Vercel serverless
> functions; they are **not** needed inside the Docker image.

---

## Quick start (Docker Compose)

```bash
# 1. Copy the template and fill in your values
cp .env.docker .env
$EDITOR .env          # set VITE_API_URL and VITE_WS_URL at minimum

# 2. Build and start
docker compose up --build

# 3. Open the app
open http://localhost:3000
```

---

## Manual Docker build

```bash
# Build with Railway production URLs
docker build \
  --build-arg VITE_API_URL=https://xpsintelligencesystem-production.up.railway.app/api \
  --build-arg VITE_WS_URL=wss://xpsintelligencesystem-production.up.railway.app \
  -t xps-intelligence-frontend:latest .

# Run
docker run -p 3000:3000 xps-intelligence-frontend:latest

# Verify
curl http://localhost:3000
```

---

## GitHub Container Registry (GHCR)

Every push to `main` triggers `.github/workflows/docker-publish.yml` which:

1. Builds the image with Railway URLs from GitHub Actions variables
   (`VITE_API_URL`, `VITE_WS_URL`)
2. Pushes to `ghcr.io/infinityxonesystems/xps-intelligence-frontend:latest`

### Pull and run the published image

```bash
docker pull ghcr.io/infinityxonesystems/xps-intelligence-frontend:latest
docker run -p 3000:3000 ghcr.io/infinityxonesystems/xps-intelligence-frontend:latest
```

### Required GitHub Actions variables / secrets

Set these in **Repository → Settings → Secrets and variables → Actions**:

| Name | Type | Description |
|------|------|-------------|
| `VITE_API_URL` | Variable | Railway API URL (e.g. `https://…railway.app/api`) |
| `VITE_WS_URL` | Variable | Railway WebSocket URL (e.g. `wss://…railway.app`) |

---

## Vercel deployment

The Vercel deployment is fully independent of Docker. Vercel reads `vercel.json`
and builds/deploys automatically on every push to `main` (via
`.github/workflows/deploy.yml`).

Set the following in **Vercel → Project → Settings → Environment Variables**:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://xpsintelligencesystem-production.up.railway.app/api` |
| `VITE_WS_URL` | `wss://xpsintelligencesystem-production.up.railway.app` |
| `AI_GROQ_API_KEY` | `gsk_…` (your Groq key) |
| `BACKEND_URL` | `https://xpsintelligencesystem-production.up.railway.app` |

---

## Groq integration

The `/api/chat` and `/api/groq-test` Vercel serverless functions call the Groq
API using `AI_GROQ_API_KEY`. This key is **server-side only** and never exposed
to the browser.

Model used: `llama-3.3-70b-versatile`

To test locally with `vercel dev`:

```bash
# Install Vercel CLI
npm i -g vercel

# Link project (first time only)
vercel link

# Start local dev server with serverless functions
VERCEL_ENV=development AI_GROQ_API_KEY=gsk_... BACKEND_URL=https://... vercel dev

# Test Groq endpoint
curl -X POST http://localhost:3000/api/groq-test
```

---

## Railway backend connection

The frontend proxies agent requests to Railway via `pages/api/agent.ts`.
The `BACKEND_URL` env var controls the target. Default:

```
https://xpsintelligencesystem-production.up.railway.app
```

WebSocket real-time updates use `VITE_WS_URL` (baked into the bundle).

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| UI calls `localhost:3000/api` in production | `VITE_API_URL` not set at build time | Rebuild image with correct `--build-arg` |
| `/api/chat` returns 503 | `AI_GROQ_API_KEY` missing | Add key to Vercel env vars or `.env` for local dev |
| `/api/agent` returns 502 | Railway backend down or `BACKEND_URL` wrong | Check Railway dashboard; verify `BACKEND_URL` |
| Container exits immediately | `serve` not installed | Base image is `node:20-alpine`; `serve@14` is installed in Stage 2 |
