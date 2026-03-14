# Vercel Deployment Guide

## Environment Variables Setup

To deploy the XPS Intelligence Control Plane to Vercel, you need to configure the following environment variables in your Vercel project settings.

### How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add each variable below with the appropriate value
5. Select the environment scope (Production, Preview, Development)
6. Click **Save**

---

## Required Environment Variables

### 🔴 CRITICAL - Required for Core Functionality

#### `SUPABASE_URL`
- **Description**: Your Supabase project URL
- **Example**: `https://abcdefghijklmnop.supabase.co`
- **Where to find**: Supabase Dashboard → Project Settings → API
- **Scope**: Production, Preview, Development
- **Encrypted**: No

#### `SUPABASE_SERVICE_ROLE_KEY`
- **Description**: Supabase service role key (full access for serverless functions)
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to find**: Supabase Dashboard → Project Settings → API → service_role key
- **Scope**: Production, Preview, Development
- **Encrypted**: ✅ Yes (Mark as sensitive)
- **⚠️ WARNING**: Keep this secret! Never expose in frontend code.

#### `AI_GROQ_API_KEY`
- **Description**: Groq LLM API key for AI chat functionality
- **Example**: `gsk_...`
- **Where to find**: https://console.groq.com/keys
- **Scope**: Production, Preview, Development
- **Encrypted**: ✅ Yes (Mark as sensitive)

---

## Frontend Build-Time Variables

These variables are embedded into the frontend bundle at build time (prefixed with `VITE_`).

#### `VITE_API_URL`
- **Description**: Backend API base URL (Railway backend)
- **Value**: `https://xpsintelligencesystem-production.up.railway.app/api`
- **Scope**: Production, Preview, Development
- **Encrypted**: No
- **Note**: Already configured in `vercel.json`

#### `VITE_WS_URL`
- **Description**: WebSocket URL for real-time updates
- **Value**: `wss://xpsintelligencesystem-production.up.railway.app`
- **Scope**: Production, Preview, Development
- **Encrypted**: No
- **Note**: Already configured in `vercel.json`

#### `VITE_APP_NAME`
- **Description**: Application name
- **Value**: `XPS Intelligence`
- **Scope**: Production, Preview, Development
- **Encrypted**: No
- **Note**: Already configured in `vercel.json`

#### `VITE_APP_VERSION`
- **Description**: Application version
- **Value**: `1.0.0`
- **Scope**: Production, Preview, Development
- **Encrypted**: No
- **Note**: Already configured in `vercel.json`

---

## Optional Environment Variables

### Integration Testing & Advanced Features

#### `BACKEND_URL`
- **Description**: Railway backend URL (for serverless functions to proxy requests)
- **Value**: `https://xpsintelligencesystem-production.up.railway.app`
- **Scope**: Production, Preview, Development
- **Encrypted**: No
- **Note**: Used by serverless functions to communicate with Railway backend

#### `GITHUB_TOKEN`
- **Description**: GitHub personal access token for integration actions
- **Example**: `ghp_...`
- **Where to find**: GitHub → Settings → Developer settings → Personal access tokens
- **Scope**: Production, Preview (optional for Development)
- **Encrypted**: ✅ Yes (Mark as sensitive)
- **Required Scopes**: `repo`, `workflow`, `read:org`
- **Note**: Optional - users can connect their own GitHub accounts via UI

#### `VERCEL_TOKEN`
- **Description**: Vercel API token for deployment management
- **Example**: `...`
- **Where to find**: Vercel → Account Settings → Tokens
- **Scope**: Production, Preview (optional for Development)
- **Encrypted**: ✅ Yes (Mark as sensitive)
- **Note**: Optional - enables deployment management features

#### `RAILWAY_TOKEN`
- **Description**: Railway API token for backend service management
- **Example**: `...`
- **Where to find**: Railway → Account Settings → Tokens
- **Scope**: Production, Preview (optional for Development)
- **Encrypted**: ✅ Yes (Mark as sensitive)
- **Note**: Optional - enables backend service monitoring and management

---

## Environment Variable Summary Table

| Variable | Required | Encrypted | Scope | Default Value |
|----------|----------|-----------|-------|---------------|
| `SUPABASE_URL` | ✅ Yes | No | All | - |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Yes | ✅ Yes | All | - |
| `AI_GROQ_API_KEY` | ✅ Yes | ✅ Yes | All | - |
| `VITE_API_URL` | ✅ Yes | No | All | Configured in vercel.json |
| `VITE_WS_URL` | ✅ Yes | No | All | Configured in vercel.json |
| `VITE_APP_NAME` | No | No | All | XPS Intelligence |
| `VITE_APP_VERSION` | No | No | All | 1.0.0 |
| `BACKEND_URL` | No | No | All | - |
| `GITHUB_TOKEN` | No | ✅ Yes | Prod, Preview | - |
| `VERCEL_TOKEN` | No | ✅ Yes | Prod, Preview | - |
| `RAILWAY_TOKEN` | No | ✅ Yes | Prod, Preview | - |

---

## Quick Setup Checklist

### Step 1: Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Create a new project or select existing one
3. Wait for project to finish provisioning
4. Navigate to Project Settings → API
5. Copy `URL` and `service_role` key

### Step 2: Enable Supabase Vault
1. In Supabase SQL Editor, run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vault WITH SCHEMA vault;
   ```
2. Verify installation:
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'vault';
   ```

### Step 3: Create Required Tables
1. Run the SQL schema from `supabase-schema.sql` in Supabase SQL Editor
2. This creates:
   - `xps_admins` - Admin user allowlist
   - `xps_integrations` - Integration metadata
   - `xps_audit_log` - Audit trail

### Step 4: Add Admin User
1. Sign in to your app with GitHub OAuth
2. Note your email address
3. In Supabase SQL Editor, run:
   ```sql
   INSERT INTO xps_admins (email) VALUES ('your-email@example.com');
   ```

### Step 5: Get Groq API Key
1. Go to https://console.groq.com
2. Create account or sign in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (starts with `gsk_`)

### Step 6: Configure Vercel Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the required variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (mark as encrypted)
   - `AI_GROQ_API_KEY` (mark as encrypted)
3. Optionally add:
   - `BACKEND_URL`
   - `GITHUB_TOKEN` (mark as encrypted)
   - `VERCEL_TOKEN` (mark as encrypted)
   - `RAILWAY_TOKEN` (mark as encrypted)

### Step 7: Deploy
1. Push your code to GitHub
2. Vercel will automatically deploy
3. Or manually trigger deployment in Vercel dashboard

### Step 8: Verify Deployment
1. Visit your deployed site
2. Navigate to Settings → Integrations
3. Test Supabase connection
4. Test AI chat functionality
5. Run Diagnostics → Run All Tests

---

## Troubleshooting

### Build Fails with "VITE_API_URL is not defined"
- **Solution**: Variables prefixed with `VITE_` are already set in `vercel.json`. No action needed.

### "Unauthorized" errors in serverless functions
- **Cause**: Missing or invalid `SUPABASE_SERVICE_ROLE_KEY`
- **Solution**: 
  1. Verify the key is copied correctly from Supabase Dashboard
  2. Ensure no extra spaces or line breaks
  3. Redeploy after updating

### AI Chat not working
- **Cause**: Missing or invalid `AI_GROQ_API_KEY`
- **Solution**:
  1. Verify the key is valid at https://console.groq.com
  2. Check that the key has not been revoked
  3. Redeploy after updating

### "Vault not available" errors
- **Cause**: Supabase Vault extension not installed
- **Solution**:
  1. Run `CREATE EXTENSION IF NOT EXISTS vault WITH SCHEMA vault;` in Supabase SQL Editor
  2. Verify with `SELECT * FROM pg_extension WHERE extname = 'vault';`

### Integration tests fail in Diagnostics
- **Cause**: Optional integration tokens not configured
- **Solution**: This is expected. Add tokens if you want those integrations to work:
  - `GITHUB_TOKEN` for GitHub actions
  - `VERCEL_TOKEN` for Vercel deployment management
  - `RAILWAY_TOKEN` for Railway service management

---

## Security Best Practices

### ✅ DO
- Mark all tokens and keys as "Encrypted" in Vercel
- Use different tokens for Production vs Preview environments
- Rotate tokens regularly
- Use Supabase Vault for user-provided secrets
- Monitor Vercel deployment logs for errors

### ❌ DON'T
- Never commit `.env` files to Git
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code
- Never log sensitive tokens in serverless functions
- Don't use Production tokens in Development environment

---

## Support

If you encounter issues:

1. Check Vercel deployment logs: Vercel Dashboard → Deployments → [Your Deployment] → Logs
2. Check Supabase logs: Supabase Dashboard → Logs
3. Run Diagnostics in the app: Settings → Diagnostics → Run All Tests
4. Review error messages in browser console (F12)

---

## Related Documentation

- [Control Plane Implementation Guide](./CONTROL_PLANE_IMPLEMENTATION.md)
- [Control Plane README](./CONTROL_PLANE_README.md)
- [Backend Integration Guide](./BACKEND_INTEGRATION_GUIDE.md)
- [Security Documentation](./SECURITY.md)
