# 🚀 Quick Start Guide - XPS Intelligence Control Plane

Welcome! This guide will help you get the Admin Control Plane up and running in under 30 minutes.

## What You're Getting

A foundational admin hub that can:
- ✅ Test connections to GitHub, Supabase, Vercel, Railway, and Groq
- ✅ Chat with Groq LLM via API endpoint
- ✅ Run diagnostic tests and download support bundles
- ⏳ Ready to expand with real integration actions (repos, workflows, deployments)

## Prerequisites

- A Supabase account (free tier is fine)
- A Groq API key (get one at https://console.groq.com)
- Vercel deployment of this project
- Optional: GitHub, Vercel, Railway tokens for testing integrations

## Step-by-Step Setup

### 1. Set Up Supabase (5 minutes)

**A. Create a Supabase Project**
1. Go to https://supabase.com
2. Click "Start your project"
3. Create a new project (choose any name)
4. Wait for project to initialize (~2 minutes)

**B. Run the Database Schema**
1. In your Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql` from this repo
4. **IMPORTANT**: Find this line in the SQL:
   ```sql
   INSERT INTO xps_admins (email) VALUES ('your-email@example.com')
   ```
   Replace `'your-email@example.com'` with your actual email address
5. Click "Run" to execute the schema
6. You should see "Success. No rows returned"

**C. Get Your Supabase Credentials**
1. Click "Settings" (gear icon) in the left sidebar
2. Click "API" under Project Settings
3. Copy two values:
   - `URL` (looks like: `https://abcdefgh.supabase.co`)
   - `service_role` key under "Project API keys" (click to reveal, looks like: `eyJhbGc...`)

### 2. Get a Groq API Key (2 minutes)

1. Go to https://console.groq.com
2. Sign up or log in
3. Click "API Keys" in the sidebar
4. Click "Create API Key"
5. Copy the key (looks like: `gsk_...`)

### 3. Configure Vercel Environment Variables (3 minutes)

1. Go to your Vercel dashboard
2. Select your XPS Intelligence project
3. Click "Settings" → "Environment Variables"
4. Add these three required variables:

| Name | Value | Environment |
|------|-------|-------------|
| `SUPABASE_URL` | Your Supabase URL from step 1C | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key from step 1C | Production, Preview, Development |
| `AI_GROQ_API_KEY` | Your Groq API key from step 2 | Production, Preview, Development |

**Optional**: Add these if you want to test integrations:
- `GITHUB_TOKEN` - Personal access token from GitHub
- `VERCEL_TOKEN` - API token from Vercel settings
- `BACKEND_URL` - Your Railway backend URL (e.g., `https://your-app.railway.app`)

### 4. Deploy (2 minutes)

```bash
# Install dependencies if you haven't yet
npm install

# Deploy to Vercel
vercel --prod
```

Or use the Vercel dashboard to redeploy from your GitHub repository.

### 5. Test It! (5 minutes)

**A. Test the Chat API**
```bash
curl -X POST https://your-app.vercel.app/api/llm/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

You should get a JSON response with a reply from Groq.

**B. Test Diagnostics**
1. Navigate to your deployed site
2. Go to Settings (click the gear icon or navigate to `/settings`)
3. Navigate to the Diagnostics page:
   - If not in navigation yet, manually go to your-site.com and change the page state to 'diagnostics'
   - OR add it to navigation following the guide below

4. Click "Run All Tests"
5. You should see:
   - ✅ Groq: Connected
   - ✅ Supabase: Connected
   - ⚠️ GitHub: Not configured (or connected if you added GITHUB_TOKEN)
   - ⚠️ Vercel: Not configured (or connected if you added VERCEL_TOKEN)
   - ⚠️ Railway: Not configured (or connected if you added BACKEND_URL)

**C. Download Support Bundle**
1. Click "Download Support Bundle" button
2. A JSON file will download with full diagnostic data
3. Open it to see detailed test results

## Adding Diagnostics to Navigation

The Diagnostics page exists but isn't in the navigation menu yet. Here's how to add it:

### Option 1: Add to Sidebar (Recommended)

Edit `src/components/Sidebar.tsx`. Find the navigation items array and add:

```typescript
{
  label: 'Diagnostics',
  page: 'diagnostics',
  icon: <Wrench size={18} />,
  category: 'System' // or whatever category fits
}
```

Make sure to import Wrench:
```typescript
import { Wrench } from '@phosphor-icons/react'
```

### Option 2: Add Button in Settings

Edit `src/pages/SettingsPage.tsx`. Add a new section with a button:

```typescript
<Button 
  onClick={() => onNavigate('diagnostics')}
  className="flex items-center gap-2"
>
  <Wrench size={16} />
  Open Diagnostics
</Button>
```

## What Works Right Now

### 1. LLM Chat API
**Endpoint**: `POST /api/llm/chat`

**Request**:
```json
{
  "message": "Your message here",
  "model": "llama-3.3-70b-versatile" // optional
}
```

**Response**:
```json
{
  "ok": true,
  "data": {
    "reply": "AI response here",
    "model": "llama-3.3-70b-versatile"
  },
  "traceId": "1234567890-abc123"
}
```

### 2. Integration Test Endpoints

All return the same format:
```json
{
  "ok": true,
  "data": {
    "status": "connected",
    // additional provider-specific info
  },
  "traceId": "..."
}
```

Available endpoints:
- `GET /api/integrations/groq/test`
- `GET /api/integrations/supabase/test`
- `GET /api/integrations/github/test`
- `GET /api/integrations/vercel/test`
- `GET /api/integrations/railway/test`

### 3. Diagnostics Dashboard

A full-featured UI that:
- Runs all integration tests in parallel
- Shows pass/fail status with visual indicators
- Displays latency metrics
- Provides error messages and fix hints
- Allows copying report JSON
- Downloads support bundles for troubleshooting

## Troubleshooting

### Error: "Groq API key not configured"
- Make sure `AI_GROQ_API_KEY` is set in Vercel environment variables
- Redeploy after adding the variable
- Check the key is valid at https://console.groq.com

### Error: "Supabase credentials not configured"
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Double-check you copied the correct values from Supabase settings
- Make sure you're using the service_role key, not the anon key

### Diagnostics page shows 404
- The page exists at `src/pages/DiagnosticsPage.tsx`
- It's registered in `App.tsx` under the `'diagnostics'` route
- You need to navigate to it programmatically with `onNavigate('diagnostics')`
- Follow "Adding Diagnostics to Navigation" above

### Tests fail with timeout errors
- Check your internet connection
- Verify the external APIs (GitHub, Vercel, etc.) are accessible from Vercel's edge network
- Some corporate networks block certain APIs

### "Permission denied" errors in Supabase
- Make sure Row Level Security (RLS) policies were created by the SQL schema
- Verify your email was added to the `xps_admins` table
- Check that the service role key is being used (not the anon key)

## Next Steps

Now that the foundation is working, you can:

1. **Add More Actions** - Implement GitHub repos, workflows, Vercel deployments
2. **Build UI** - Create integration cards in Settings page
3. **Add Auth** - Implement user authentication and admin checks
4. **Create Tests** - Write unit and integration tests
5. **Monitor Usage** - Check Vercel logs using traceIds

See `IMPLEMENTATION_SUMMARY.md` for detailed next steps and time estimates.

## Getting Help

- **Documentation**: Check `CONTROL_PLANE_README.md` for comprehensive guide
- **Technical Details**: See `CONTROL_PLANE_IMPLEMENTATION.md`
- **Database Schema**: Review `supabase-schema.sql`
- **Environment Variables**: Reference `.env.control-plane.example`

## Example API Calls

### Chat with AI
```bash
curl -X POST https://your-app.vercel.app/api/llm/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Write a haiku about programming"
  }'
```

### Check System Status
```bash
curl https://your-app.vercel.app/api/diagnostics/status
```

### Test GitHub Connection
```bash
curl https://your-app.vercel.app/api/integrations/github/test
```

## Success Checklist

- [ ] Supabase project created and schema run
- [ ] Admin email added to `xps_admins` table
- [ ] Environment variables set in Vercel
- [ ] Application deployed
- [ ] Chat API tested successfully
- [ ] Diagnostics page accessible
- [ ] All available integration tests passing (or showing expected "not configured")
- [ ] Support bundle can be downloaded

If you've checked all these, congratulations! Your Control Plane foundation is ready. 🎉

---

**Need help?** Open an issue or check the detailed documentation files in this repo.

**Ready to build?** Start with `IMPLEMENTATION_SUMMARY.md` to see what to implement next.

