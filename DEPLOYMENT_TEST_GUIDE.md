# Deployment Test & Navigation Verification

## Status: ✅ READY FOR TESTING

This document provides a comprehensive guide for testing all page navigation and backend connections after deployment to Vercel/Railway.

---

## Quick Health Check

### Automated Health Check Page

We've added a **System Health** page that automatically tests:
- ✅ Frontend build status
- ✅ Environment configuration
- ✅ Backend API connectivity  
- ✅ WebSocket connection
- ✅ All 19 navigation routes
- ✅ Latency measurements

**Access it**: Navigate to **System Health** in the sidebar utility menu

---

## Manual Testing Checklist

### 1. Frontend Deployment (Vercel)

**URL**: https://xps-intelligence.vercel.app/

#### Visual Check
- [ ] Page loads (no white screen)
- [ ] Logo and branding visible
- [ ] Navigation sidebar renders
- [ ] Top bar with connection status visible

#### Console Check
Open browser DevTools (F12) and check Console tab:
- [ ] No critical errors (some warnings are OK)
- [ ] Config logged: `[XPS] Configuration loaded`
- [ ] API URL matches: `https://xpsintelligencesystem-production.up.railway.app/api`

---

### 2. Backend Connectivity (Railway)

**URL**: https://xpsintelligencesystem-production.up.railway.app

#### Health Endpoint Test
```bash
curl https://xpsintelligencesystem-production.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX...",
  "uptime": 12345
}
```

#### API Endpoint Test
```bash
curl https://xpsintelligencesystem-production.up.railway.app/api/leads
```

Expected: Either lead data or a 404/503 with JSON error structure

---

### 3. All Pages Navigation Test

Click through each page in the sidebar and verify it loads without errors:

#### Primary Menu (Business)
- [ ] **Home** - Dashboard with metrics cards
- [ ] **Leads** - Lead management table
- [ ] **Contractors** - Contractor directory
- [ ] **Prospects** - Prospect pipeline
- [ ] **Pipeline** - Sales funnel visualization
- [ ] **Leaderboard** - Performance rankings
- [ ] **Roadmap** - Product roadmap timeline
- [ ] **Reports** - Analytics and reports

#### Utility Menu (Tools)
- [ ] **Agent** - AI agent interface
- [ ] **System Health** ⭐ - Automated diagnostics
- [ ] **Task Queue** - Background job monitoring
- [ ] **Scraper** - Web scraping controls
- [ ] **Code Editor** - In-app code editing
- [ ] **Sandbox** - Execution sandbox
- [ ] **Canvas** - Visual workflow builder
- [ ] **Automation** - Workflow automation
- [ ] **System Logs** - Application logs
- [ ] **Docs** - Documentation viewer
- [ ] **Settings** - Configuration panel

---

### 4. Key Features Test

#### A. Connection Status Indicator
- [ ] Check top bar for connection badge
- [ ] Green = Backend connected
- [ ] Yellow/Red = Offline mode

#### B. Settings Page Integrations
Navigate to **Settings**, scroll to **Integrations** section:

- [ ] GitHub integration card visible
- [ ] Supabase integration card visible
- [ ] Railway integration card visible
- [ ] Vercel integration card visible
- [ ] Groq LLM integration card visible

**Test Connection Buttons**:
- [ ] Click "Test Connection" on any card
- [ ] Observe status change (loading → success/fail)
- [ ] Check error messages are clear

#### C. Diagnostics Page
Navigate to **Diagnostics**:

- [ ] Click "Run All Tests"
- [ ] Observe progress indicators
- [ ] Check PASS/FAIL badges update
- [ ] Review test history table
- [ ] Click "Download Support Bundle" - JSON downloads

#### D. Chat/Agent Interface
Navigate to **Agent** page:

- [ ] Chat input field visible
- [ ] Send a test message: "Hello"
- [ ] Observe loading state
- [ ] Response appears (or clear error if AI_GROQ_API_KEY not set)

---

### 5. Environment Variables Verification

Check that all required env vars are set in **Vercel Dashboard**:

#### Required
- `VITE_API_URL` = `https://xpsintelligencesystem-production.up.railway.app/api`
- `BACKEND_URL` = `https://xpsintelligencesystem-production.up.railway.app`

#### Optional (for full functionality)
- `AI_GROQ_API_KEY` - Groq API key for AI chat
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin key
- `GITHUB_TOKEN` - GitHub personal access token
- `VERCEL_TOKEN` - Vercel API token
- `RAILWAY_TOKEN` - Railway API token

**How to check**:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select project: `xps-intelligence`
3. Settings → Environment Variables
4. Verify values are set (don't share the actual secrets!)

---

### 6. Known Issues & Solutions

#### White Screen on Load

**Symptoms**: Browser shows blank white page, no content

**Causes**:
1. JavaScript runtime error (check Console)
2. Missing environment variable causing crash
3. Backend unreachable and no fallback data

**Solutions**:
```bash
# 1. Check browser console for errors
# Look for: TypeError, ReferenceError, Module not found

# 2. Verify env vars in Vercel
VITE_API_URL must be set

# 3. Redeploy with fresh build
git commit --allow-empty -m "Trigger rebuild"
git push
```

#### Backend Connection Failed

**Symptoms**: Red "Disconnected" badge, "Running in offline mode" toast

**Causes**:
1. Railway backend is down
2. CORS misconfiguration
3. Network timeout (slow connection)

**Solutions**:
```bash
# 1. Test backend directly
curl https://xpsintelligencesystem-production.up.railway.app/health

# 2. Check Railway logs
# Go to Railway dashboard → Service → Logs

# 3. Frontend will use demo data automatically
# This is expected behavior when backend is unavailable
```

#### Package Lock Sync Error

**Symptoms**: Build fails with "lock file not in sync"

**Cause**: package.json updated without updating package-lock.json

**Solution**:
```bash
# Run locally
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

---

### 7. Performance Benchmarks

Expected load times (from US East):

| Metric | Target | Acceptable |
|--------|--------|------------|
| Initial page load | < 2s | < 4s |
| Backend health check | < 500ms | < 2s |
| Page navigation | < 200ms | < 500ms |
| API data fetch | < 1s | < 3s |

**How to measure**:
- Open DevTools → Network tab
- Refresh page
- Check "DOMContentLoaded" and "Load" times

---

### 8. Automated Testing

#### A. Run System Health Check
1. Navigate to **System Health** page
2. Click **"Run All Tests"**
3. Wait for all checks to complete
4. Review summary: X passed, Y failed, Z warnings

#### B. Export Support Bundle
1. On Diagnostics page, click **"Download Support Bundle"**
2. JSON file downloads with:
   - All test results
   - Environment info (no secrets)
   - Timestamps and latencies
   - Browser/system info

#### C. CI/CD Pipeline
GitHub Actions runs on every push:
- ✅ Type checking (tsc)
- ✅ Linting (eslint)
- ✅ Build (vite build)
- ✅ Tests (if any)

Check status: [GitHub Actions](https://github.com/InfinityXOneSystems/XPS-INTELLIGENCE-FRONTEND/actions)

---

### 9. Common Test Scenarios

#### Scenario A: Fresh Deployment
```
1. Deploy to Vercel
2. Wait for build to complete
3. Open deployed URL
4. Navigate to System Health
5. Run all tests
6. Verify ≥ 80% pass rate
```

#### Scenario B: Environment Change
```
1. Update env var in Vercel dashboard
2. Redeploy (or wait for auto-redeploy)
3. Clear browser cache
4. Reload page
5. Check config in console log
6. Test affected integration
```

#### Scenario C: Backend Update
```
1. Deploy new backend to Railway
2. Wait for Railway deployment
3. Test backend health endpoint directly
4. Reload frontend
5. Check connection status
6. Test API-dependent pages (Leads, etc.)
```

---

### 10. Troubleshooting Commands

#### Check Frontend Build Locally
```bash
npm run build
npm run preview
# Open http://localhost:4173
```

#### Check Backend Health
```bash
# Health check
curl -i https://xpsintelligencesystem-production.up.railway.app/health

# With timeout
curl -i --max-time 5 https://xpsintelligencesystem-production.up.railway.app/api/leads
```

#### View Vercel Deployment Logs
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# List deployments
vercel ls

# View logs for latest deployment
vercel logs
```

#### View Railway Logs
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# View logs
railway logs
```

---

## Success Criteria

Deployment is considered successful when:

- ✅ **Frontend loads** without white screen
- ✅ **All 19 pages** navigate without errors
- ✅ **Backend health check** passes OR offline mode works
- ✅ **System Health page** shows ≥ 80% tests passing
- ✅ **No critical console errors** (warnings OK)
- ✅ **Settings integrations** show clear status (connected/disconnected/error)
- ✅ **Diagnostics** can run and export support bundle

---

## Next Steps After Verification

Once all tests pass:

1. **Document any failures** in GitHub Issues
2. **Share System Health results** with team
3. **Set up monitoring** (Sentry, LogRocket, etc.)
4. **Configure alerts** for backend downtime
5. **Schedule regular health checks** (cron job hitting System Health endpoint)

---

## Support

If you encounter issues during testing:

1. **Check System Health page** first - it shows most common issues
2. **Download support bundle** from Diagnostics
3. **Check browser console** for JavaScript errors
4. **Verify environment variables** in Vercel dashboard
5. **Test backend directly** with curl commands above
6. **Review Railway logs** if backend is suspect

**Contact**: Open issue in GitHub repo with:
- Support bundle JSON
- Browser console screenshot
- Steps to reproduce

---

## Appendix: Test Results Template

```markdown
# Test Results - [Date]

**Tester**: [Your name]
**Environment**: Production / Staging
**Frontend**: https://xps-intelligence.vercel.app/
**Backend**: https://xpsintelligencesystem-production.up.railway.app

## Summary
- Total tests: 
- Passed: 
- Failed: 
- Warnings: 

## Page Navigation
- [ ] All primary menu items load
- [ ] All utility menu items load
- [ ] No console errors during navigation

## Backend Connectivity
- [ ] Health endpoint responds
- [ ] API endpoints respond
- [ ] Latency < 2s

## Key Features
- [ ] Settings integrations show status
- [ ] Diagnostics runs successfully
- [ ] Chat/Agent functional (if AI key set)

## Issues Found
1. [Issue description]
   - Impact: High/Medium/Low
   - Steps to reproduce: ...
   - Error message: ...

## Notes
[Any additional observations]
```

---

**Last Updated**: [Current Date]
**Version**: 1.0.0
**Status**: Ready for Testing ✅
