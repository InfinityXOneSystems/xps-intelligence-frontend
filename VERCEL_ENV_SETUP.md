# Vercel Environment Variables Configuration

## Step-by-Step Instructions

### 1. Access Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project: **xps-intelligence** (or your project name)
3. Click **Settings** in the top navigation
4. Click **Environment Variables** in the left sidebar

---

## 2. Add Each Variable Below

For each variable, click **Add New** and fill in:
- **Key**: The variable name (e.g., `SUPABASE_URL`)
- **Value**: The actual value (see below)
- **Environment**: Select all that apply (Production, Preview, Development)
- **Sensitive**: Check if marked ✅ below

---

## Required Variables (MUST ADD)

### Variable 1: SUPABASE_URL

```
Key: SUPABASE_URL
Value: https://YOUR-PROJECT-ID.supabase.co
Environment: ✅ Production  ✅ Preview  ✅ Development
Sensitive: ☐ No
```

**How to get this value:**
1. Go to https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the **Project URL**

---

### Variable 2: SUPABASE_SERVICE_ROLE_KEY

```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: ✅ Production  ✅ Preview  ✅ Development
Sensitive: ✅ YES - CHECK THIS BOX!
```

**How to get this value:**
1. In Supabase Dashboard → **Settings** → **API**
2. Scroll to **Project API keys**
3. Copy the **service_role** key (NOT the anon key!)
4. ⚠️ **IMPORTANT**: Mark this as "Sensitive" in Vercel

---

### Variable 3: AI_GROQ_API_KEY

```
Key: AI_GROQ_API_KEY
Value: gsk_...
Environment: ✅ Production  ✅ Preview  ✅ Development
Sensitive: ✅ YES - CHECK THIS BOX!
```

**How to get this value:**
1. Go to https://console.groq.com
2. Sign up or log in
3. Go to **API Keys**
4. Click **Create API Key**
5. Copy the key (starts with `gsk_`)
6. ⚠️ **IMPORTANT**: Mark this as "Sensitive" in Vercel

---

## Optional Variables (Recommended)

### Variable 4: BACKEND_URL

```
Key: BACKEND_URL
Value: https://xpsintelligencesystem-production.up.railway.app
Environment: ✅ Production  ✅ Preview  ✅ Development
Sensitive: ☐ No
```

**Purpose:** Allows serverless functions to communicate with Railway backend

---

### Variable 5: GITHUB_TOKEN (Optional)

```
Key: GITHUB_TOKEN
Value: ghp_...
Environment: ✅ Production  ☐ Preview  ☐ Development
Sensitive: ✅ YES - CHECK THIS BOX!
```

**How to get this value:**
1. Go to https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Select scopes: `repo`, `workflow`, `read:org`
4. Click **Generate token**
5. Copy the token (starts with `ghp_`)

**Purpose:** Enables GitHub integration features (optional - users can connect their own)

---

### Variable 6: VERCEL_TOKEN (Optional)

```
Key: VERCEL_TOKEN
Value: (your Vercel token)
Environment: ✅ Production  ☐ Preview  ☐ Development
Sensitive: ✅ YES - CHECK THIS BOX!
```

**How to get this value:**
1. Go to https://vercel.com/account/tokens
2. Click **Create Token**
3. Name it "XPS Intelligence API"
4. Select scope: **Full Account**
5. Click **Create**
6. Copy the token

**Purpose:** Enables deployment management features in the app

---

### Variable 7: RAILWAY_TOKEN (Optional)

```
Key: RAILWAY_TOKEN
Value: (your Railway token)
Environment: ✅ Production  ☐ Preview  ☐ Development
Sensitive: ✅ YES - CHECK THIS BOX!
```

**How to get this value:**
1. Go to https://railway.app/account/tokens
2. Click **Create Token**
3. Name it "XPS Intelligence API"
4. Copy the token

**Purpose:** Enables backend service management features

---

## 3. Variables Already Configured in vercel.json

These variables are automatically set by `vercel.json` and **DO NOT need to be added manually**:

- ✅ `VITE_API_URL` - Already set to: `https://xpsintelligencesystem-production.up.railway.app/api`
- ✅ `VITE_WS_URL` - Already set to: `wss://xpsintelligencesystem-production.up.railway.app`
- ✅ `VITE_APP_NAME` - Already set to: `XPS Intelligence`
- ✅ `VITE_APP_VERSION` - Already set to: `1.0.0`

---

## 4. After Adding All Variables

### Trigger a New Deployment

**Option A: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **•••** menu
4. Click **Redeploy**
5. Confirm

**Option B: Via Git Push**
1. Make any small change to your code (e.g., update README)
2. Commit and push to GitHub
3. Vercel will automatically deploy

---

## 5. Verify the Deployment

### Check Build Logs
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Check that build completed successfully
4. Look for any environment variable errors

### Test the Application
1. Visit your deployed site: https://xps-intelligence.vercel.app
2. Sign in with GitHub OAuth
3. Go to **Settings** → **Integrations**
4. Click **Test** on Supabase integration - should show "Connected"
5. Try the AI Chat - should respond
6. Go to **Settings** → **Diagnostics**
7. Click **Run All Tests** - should show which services are configured

---

## 6. Add Your Email as Admin

After the first deployment, you need to authorize yourself as an admin:

1. Sign in to your deployed app
2. Note your email address
3. Go to Supabase Dashboard → **SQL Editor**
4. Run this query (replace with your email):

```sql
INSERT INTO xps_admins (email)
VALUES ('your-email@example.com')
ON CONFLICT (email) DO NOTHING;
```

5. Refresh your app - you should now have access to all admin features

---

## Troubleshooting

### "Missing environment variable" errors during build

**Problem:** Build fails with `VITE_API_URL is not defined`

**Solution:** This is normal - these variables are set in `vercel.json`. Just redeploy.

---

### "Unauthorized" errors in the app

**Problem:** Serverless functions return 401/403 errors

**Solution:** 
1. Check that `SUPABASE_SERVICE_ROLE_KEY` is set correctly
2. Make sure there are no extra spaces or line breaks
3. Verify the key in Supabase Dashboard → Settings → API
4. Redeploy after fixing

---

### AI Chat not responding

**Problem:** Chat shows "Error: Failed to get response"

**Solution:**
1. Verify `AI_GROQ_API_KEY` is set in Vercel
2. Check the key is valid at https://console.groq.com/keys
3. Ensure the key is marked as "Sensitive"
4. Redeploy

---

### Integration tests fail

**Problem:** Diagnostics shows "Not configured" for some services

**Solution:** This is expected if optional tokens aren't set:
- `GITHUB_TOKEN` - Add if you want GitHub integration
- `VERCEL_TOKEN` - Add if you want deployment management
- `RAILWAY_TOKEN` - Add if you want backend service management

Users can also connect their own accounts via the UI.

---

## Summary Checklist

Before deploying, ensure:

- [ ] ✅ `SUPABASE_URL` is set
- [ ] ✅ `SUPABASE_SERVICE_ROLE_KEY` is set and marked as sensitive
- [ ] ✅ `AI_GROQ_API_KEY` is set and marked as sensitive
- [ ] ✅ Supabase Vault extension is installed (`CREATE EXTENSION vault`)
- [ ] ✅ Supabase schema is applied (run `supabase-schema.sql`)
- [ ] ✅ Your email is added to `xps_admins` table
- [ ] 🔄 New deployment triggered after adding variables
- [ ] 🧪 App tested: Supabase connects, AI chat works, diagnostics run

Optional but recommended:
- [ ] 🔧 `BACKEND_URL` is set (for serverless proxy)
- [ ] 🔧 `GITHUB_TOKEN` is set (for GitHub features)
- [ ] 🔧 `VERCEL_TOKEN` is set (for deployment management)
- [ ] 🔧 `RAILWAY_TOKEN` is set (for backend monitoring)

---

## Quick Links

- 📊 **Vercel Dashboard**: https://vercel.com/dashboard
- 🗄️ **Supabase Dashboard**: https://supabase.com/dashboard
- 🤖 **Groq Console**: https://console.groq.com
- 🔑 **GitHub Tokens**: https://github.com/settings/tokens
- 🚂 **Railway Dashboard**: https://railway.app/dashboard

---

## Need Help?

1. Check deployment logs in Vercel Dashboard
2. Check browser console (F12) for errors
3. Run Diagnostics in the app
4. Review [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for detailed troubleshooting
