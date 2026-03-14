# Environment Variables Architecture

## Variable Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL DASHBOARD                              │
│                 (Environment Variables)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌──────────────────┐   ┌──────────────┐
│  Build Time   │   │   Runtime        │   │  vercel.json │
│  (VITE_*)     │   │   (Serverless)   │   │  (Static)    │
└───────────────┘   └──────────────────┘   └──────────────┘
        │                     │                     │
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌──────────────────┐   ┌──────────────┐
│ Frontend      │   │ pages/api/*      │   │ Frontend     │
│ Bundle        │   │ Functions        │   │ Config       │
│               │   │                  │   │              │
│ - VITE_API_   │   │ - SUPABASE_*     │   │ - VITE_API_  │
│   URL         │   │ - AI_GROQ_*      │   │   URL        │
│ - VITE_WS_    │   │ - GITHUB_TOKEN   │   │ - VITE_WS_   │
│   URL         │   │ - VERCEL_TOKEN   │   │   URL        │
│ - VITE_APP_*  │   │ - RAILWAY_TOKEN  │   │ - VITE_APP_* │
│               │   │ - BACKEND_URL    │   │              │
└───────────────┘   └──────────────────┘   └──────────────┘
```

## Variable Categories

### 1. Build-Time Variables (VITE_*)

**How they work:**
- Set in Vercel Dashboard OR defined in `vercel.json`
- Embedded into the JavaScript bundle during `npm run build`
- Available in frontend code via `import.meta.env.VITE_*`
- **Cannot change** without rebuilding

**Variables:**
```javascript
VITE_API_URL      // Backend API base URL
VITE_WS_URL       // WebSocket URL
VITE_APP_NAME     // Application name
VITE_APP_VERSION  // Application version
```

**Usage in code:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

### 2. Runtime Variables (Serverless Functions)

**How they work:**
- Set in Vercel Dashboard only
- Available only in `pages/api/*` serverless functions
- Accessed via `process.env.*`
- **Never** exposed to frontend
- Can change without rebuilding (just redeploy)

**Variables:**
```javascript
SUPABASE_URL               // Supabase project URL
SUPABASE_SERVICE_ROLE_KEY  // Supabase admin key (SENSITIVE)
AI_GROQ_API_KEY            // Groq LLM API key (SENSITIVE)
BACKEND_URL                // Railway backend URL
GITHUB_TOKEN               // GitHub API token (SENSITIVE)
VERCEL_TOKEN               // Vercel API token (SENSITIVE)
RAILWAY_TOKEN              // Railway API token (SENSITIVE)
```

**Usage in serverless function:**
```typescript
// pages/api/example.ts
export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL
  const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  // ...
}
```

### 3. Static Config (vercel.json)

**How they work:**
- Defined directly in `vercel.json` file
- No need to set in Vercel Dashboard
- Used for variables that are the same across all environments
- Committed to Git (so no secrets!)

**Current configuration:**
```json
{
  "env": {
    "VITE_API_URL": "https://xpsintelligencesystem-production.up.railway.app/api",
    "VITE_WS_URL": "wss://xpsintelligencesystem-production.up.railway.app",
    "VITE_APP_NAME": "XPS Intelligence",
    "VITE_APP_VERSION": "1.0.0"
  }
}
```

## Security Model

### ✅ Safe (Frontend - Public)
```
VITE_API_URL          // Backend URL (public endpoint)
VITE_WS_URL           // WebSocket URL (public endpoint)
VITE_APP_NAME         // Application name (public)
VITE_APP_VERSION      // Version number (public)
```

### 🔐 Protected (Backend - Private)
```
SUPABASE_SERVICE_ROLE_KEY   // NEVER expose to frontend
AI_GROQ_API_KEY             // NEVER expose to frontend
GITHUB_TOKEN                // NEVER expose to frontend
VERCEL_TOKEN                // NEVER expose to frontend
RAILWAY_TOKEN               // NEVER expose to frontend
```

### ⚠️ Semi-Public (Depends on sensitivity)
```
SUPABASE_URL          // Project URL (could be public)
BACKEND_URL           // Backend URL (public endpoint)
```

## Data Flow Examples

### Example 1: AI Chat Request

```
┌─────────┐    1. User Message     ┌──────────┐
│ Browser │ ───────────────────────→│ Frontend │
└─────────┘                         └──────────┘
                                         │
                                         │ 2. POST /api/llm/chat
                                         ▼
                                   ┌──────────────┐
                                   │ Serverless   │
                                   │ Function     │
                                   └──────────────┘
                                         │
                                         │ 3. Use AI_GROQ_API_KEY
                                         │    from process.env
                                         ▼
                                   ┌──────────────┐
                                   │ Groq API     │
                                   └──────────────┘
                                         │
                                         │ 4. Response
                                         ▼
┌─────────┐    5. Display Reply    ┌──────────┐
│ Browser │ ←───────────────────────│ Frontend │
└─────────┘                         └──────────┘
```

**Key point:** API key never reaches the browser!

### Example 2: Supabase Integration Test

```
┌─────────┐    1. Click "Test"    ┌──────────┐
│ Browser │ ────────────────────→ │ Frontend │
└─────────┘                        └──────────┘
                                        │
                                        │ 2. POST /api/integrations/supabase/test
                                        ▼
                                  ┌──────────────┐
                                  │ Serverless   │
                                  │ Function     │
                                  └──────────────┘
                                        │
                                        │ 3. Use SUPABASE_URL + 
                                        │    SUPABASE_SERVICE_ROLE_KEY
                                        │    from process.env
                                        ▼
                                  ┌──────────────┐
                                  │ Supabase API │
                                  └──────────────┘
                                        │
                                        │ 4. Connection result
                                        ▼
┌─────────┐    5. Show status     ┌──────────┐
│ Browser │ ←─────────────────────│ Frontend │
└─────────┘                        └──────────┘
```

**Key point:** Service role key stays on the server!

## Common Pitfalls

### ❌ DON'T: Expose secrets in frontend

```typescript
// ❌ WRONG - Never do this!
const apiKey = import.meta.env.VITE_GROQ_API_KEY  // DON'T prefix secrets with VITE_
```

### ✅ DO: Keep secrets in serverless functions

```typescript
// ✅ CORRECT - In pages/api/llm/chat.ts
export default async function handler(req, res) {
  const apiKey = process.env.AI_GROQ_API_KEY  // Only accessible server-side
  // ...
}
```

### ❌ DON'T: Add VITE_ prefix to secrets

```bash
# ❌ WRONG - This would expose the secret in frontend bundle
VITE_GROQ_API_KEY=gsk_...
```

### ✅ DO: Use plain names for secrets

```bash
# ✅ CORRECT - Only accessible in serverless functions
AI_GROQ_API_KEY=gsk_...
```

### ❌ DON'T: Store user secrets in environment variables

```typescript
// ❌ WRONG - User tokens should be in Supabase Vault
const userGithubToken = process.env.USER_GITHUB_TOKEN
```

### ✅ DO: Store user secrets in Supabase Vault

```typescript
// ✅ CORRECT - User tokens in Vault
const userToken = await vault.get(userId, 'github_token')
```

## Environment Scopes in Vercel

### Production
- Used when deploying to `main` branch
- Most restrictive - only production tokens
- Example: Production API keys with rate limits

### Preview
- Used for pull request deployments
- Can use same tokens as Production OR separate preview tokens
- Example: Preview API keys with lower rate limits

### Development
- Used in local development
- Can use separate development/sandbox tokens
- Example: Development API keys or mock servers

## Validation Checklist

Before deploying, verify:

- [ ] All required variables are set in Vercel Dashboard
- [ ] Sensitive variables are marked as "Encrypted"
- [ ] No secrets have `VITE_` prefix
- [ ] `vercel.json` contains only non-sensitive values
- [ ] `.env` files are in `.gitignore`
- [ ] Serverless functions validate environment variables at startup
- [ ] Frontend code never accesses secrets directly
- [ ] User secrets go to Supabase Vault, not environment variables

## Related Documentation

- [VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md) - Step-by-step setup guide
- [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [SECURITY.md](./SECURITY.md) - Security best practices
