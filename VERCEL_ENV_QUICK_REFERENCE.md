# Vercel Environment Variables - Quick Reference

Copy and paste these into Vercel Dashboard → Settings → Environment Variables

---

## 🔴 REQUIRED (Must be set for app to work)

### SUPABASE_URL
```
https://YOUR-PROJECT.supabase.co
```
**Get from**: Supabase Dashboard → Settings → API → URL  
**Scope**: Production, Preview, Development  
**Encrypted**: No

---

### SUPABASE_SERVICE_ROLE_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IllPVVItUFJPSkVDVCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTU3NjAwMH0.YOUR-SIGNATURE
```
**Get from**: Supabase Dashboard → Settings → API → service_role key  
**Scope**: Production, Preview, Development  
**Encrypted**: ✅ YES - MARK AS SENSITIVE

---

### AI_GROQ_API_KEY
```
gsk_YOUR_KEY_HERE
```
**Get from**: https://console.groq.com/keys  
**Scope**: Production, Preview, Development  
**Encrypted**: ✅ YES - MARK AS SENSITIVE

---

## 🟢 OPTIONAL (Enables additional features)

### BACKEND_URL
```
https://xpsintelligencesystem-production.up.railway.app
```
**Purpose**: Serverless functions proxy to Railway backend  
**Scope**: Production, Preview, Development  
**Encrypted**: No

---

### GITHUB_TOKEN
```
ghp_YOUR_TOKEN_HERE
```
**Get from**: GitHub → Settings → Developer settings → Personal access tokens  
**Required Scopes**: repo, workflow, read:org  
**Scope**: Production, Preview  
**Encrypted**: ✅ YES - MARK AS SENSITIVE

---

### VERCEL_TOKEN
```
YOUR_VERCEL_TOKEN_HERE
```
**Get from**: Vercel → Account Settings → Tokens  
**Purpose**: Deployment management API access  
**Scope**: Production, Preview  
**Encrypted**: ✅ YES - MARK AS SENSITIVE

---

### RAILWAY_TOKEN
```
YOUR_RAILWAY_TOKEN_HERE
```
**Get from**: Railway → Account Settings → Tokens  
**Purpose**: Backend service management  
**Scope**: Production, Preview  
**Encrypted**: ✅ YES - MARK AS SENSITIVE

---

## 📋 Copy-Paste Template for Vercel

Use this format when adding variables:

```
Variable 1: SUPABASE_URL
Value: https://YOUR-PROJECT.supabase.co
Environment: Production, Preview, Development
Sensitive: No

Variable 2: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: Production, Preview, Development
Sensitive: YES ✅

Variable 3: AI_GROQ_API_KEY
Value: gsk_...
Environment: Production, Preview, Development
Sensitive: YES ✅

Variable 4: BACKEND_URL
Value: https://xpsintelligencesystem-production.up.railway.app
Environment: Production, Preview, Development
Sensitive: No

Variable 5: GITHUB_TOKEN (Optional)
Value: ghp_...
Environment: Production, Preview
Sensitive: YES ✅

Variable 6: VERCEL_TOKEN (Optional)
Value: ...
Environment: Production, Preview
Sensitive: YES ✅

Variable 7: RAILWAY_TOKEN (Optional)
Value: ...
Environment: Production, Preview
Sensitive: YES ✅
```

---

## 🚀 After Adding Variables

1. Save each variable
2. Trigger a new deployment:
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger automatic deployment

3. Verify deployment:
   - Visit your site
   - Check Settings → Integrations
   - Run Diagnostics → Run All Tests

---

## ⚠️ Important Notes

- Variables with `VITE_` prefix are already configured in `vercel.json`
- Don't add `VITE_API_URL` or `VITE_WS_URL` manually - they're auto-configured
- Always mark tokens/keys as "Sensitive" (encrypted)
- Variables are applied at build time for `VITE_*` and at runtime for others
- Changes to environment variables require a new deployment to take effect

---

## 🔗 Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Groq Console**: https://console.groq.com
- **GitHub Tokens**: https://github.com/settings/tokens
- **Railway Dashboard**: https://railway.app/dashboard

---

## ✅ Verification Checklist

After setting up environment variables:

- [ ] SUPABASE_URL is set
- [ ] SUPABASE_SERVICE_ROLE_KEY is set and marked as sensitive
- [ ] AI_GROQ_API_KEY is set and marked as sensitive
- [ ] Supabase Vault extension is installed
- [ ] Admin user is added to `xps_admins` table
- [ ] New deployment triggered after adding variables
- [ ] Site loads without errors
- [ ] Settings → Integrations shows Supabase as connected
- [ ] AI Chat responds to messages
- [ ] Diagnostics page shows passing tests for configured services

---

For detailed instructions, see [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
