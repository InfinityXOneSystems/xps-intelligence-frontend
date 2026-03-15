# Forensic Audit — Backend (XPS_INTELLIGENCE_SYSTEM)

**Date:** 2026-03-15  
**Auditor:** Copilot Agent  
**Repo:** `InfinityXOneSystems/XPS_INTELLIGENCE_SYSTEM`  
**Live URL:** https://xpsintelligencesystem-production.up.railway.app  

> **Note:** This document is authored from the FRONTEND repository as a companion audit.
> The backend repository should be audited directly for full coverage.
> Backend-specific fixes (Python SyntaxError, Dockerfile, etc.) must be applied in
> `InfinityXOneSystems/XPS_INTELLIGENCE_SYSTEM`.

---

## 1. Known P0 Failures

### B-P0-01: `infinity_library/__init__.py` SyntaxError

**Symptom:** Backend fails to start. `from __future__` statement at line ~14 is misplaced.  
**Root cause:** `from __future__ import annotations` must be the first non-docstring, non-comment statement in a Python module.  
**Fix:**
```python
# infinity_library/__init__.py  — first executable line must be:
from __future__ import annotations
```
Move the `from __future__` import to line 1 (before any other imports).

### B-P0-02: Docker CI — no Dockerfile in `./frontend` directory

**Symptom:** Docker Compose or CI step that references `./frontend/Dockerfile` fails.  
**Root cause:** The `frontend` service definition in `docker-compose.yml` or CI config points to a non-existent `./frontend/Dockerfile`.  
**Fix (option A):** Remove the frontend service from the backend's docker-compose (frontend is Vercel-only).  
**Fix (option B):** Add a minimal `./frontend/Dockerfile` that just serves a static notice.

---

## 2. Required Endpoints (consumed by Frontend)

The following endpoints are called by Vercel proxy functions in the frontend:

| Endpoint              | Method | Called by frontend           | Status      |
|-----------------------|--------|------------------------------|-------------|
| `/api/health`         | GET    | `pages/api/health.js`        | Must exist  |
| `/api/agents/status`  | GET    | `chatService.getAgentStatus`  | Must exist  |
| `/api/agents/:role/execute` | POST | `chatService.executeAgentCommand` | Must exist |
| `/api/leads`          | GET    | `pages/api/leads.js`         | Must exist  |
| `/api/run-agent`      | POST   | `pages/api/run-agent.js`     | Must exist  |
| `/api/run-scraper`    | POST   | `pages/api/run-scraper.js`   | Must exist  |
| `/github/webhook`     | POST   | GitHub webhook (direct)      | Must exist  |

### `/api/health` Response Contract

```json
{
  "status": "ok",
  "timestamp": "2026-03-15T01:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 3. GitHub Webhook Receiver

**Target URL:** `https://xpsintelligencesystem-production.up.railway.app/github/webhook`  
**GitHub App:** XPS Orchestrator (App ID: 3093714)

**Required behavior:**
1. Verify `X-Hub-Signature-256` HMAC-SHA256 signature using `GITHUB_WEBHOOK_SECRET`
2. Return `HTTP 200` with `{"received": true}` immediately (async processing)
3. Log event type, delivery ID, and repo name in structured JSON
4. Never return HTML — always return `Content-Type: application/json`

**Verification:**
```python
import hmac, hashlib

def verify_signature(secret: str, body: bytes, signature: str) -> bool:
    expected = 'sha256=' + hmac.new(
        secret.encode(), body, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
```

---

## 4. Environment Variables (Backend — Railway)

| Variable                    | Purpose                                      | Required   |
|-----------------------------|----------------------------------------------|------------|
| `GITHUB_WEBHOOK_SECRET`     | HMAC secret for webhook signature            | ✅ P0      |
| `AI_GROQ_API_KEY`           | Groq API key for agent LLM calls             | ✅ P0      |
| `DATABASE_URL`              | PostgreSQL connection string                 | ✅ P0      |
| `GITHUB_APP_PRIVATE_KEY_PEM`| GitHub App private key for installation tokens| ✅ P1     |
| `GITHUB_APP_ID`             | GitHub App ID (3093714)                      | ✅ P1      |
| `REDIS_URL`                 | Redis for BullMQ task queue                  | ⚪ P2      |

---

## 5. Verification Steps

```bash
# Health check
curl https://xpsintelligencesystem-production.up.railway.app/api/health

# GitHub webhook smoke test (replace SECRET)
curl -X POST https://xpsintelligencesystem-production.up.railway.app/github/webhook \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: ping" \
  -H "X-Hub-Signature-256: sha256=<computed>" \
  -d '{"zen":"Anything added dilutes everything else."}'
```
