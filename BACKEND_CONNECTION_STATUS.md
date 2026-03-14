# Backend Connection Status

## Current Configuration

### Backend URL
- **Production Railway URL**: `https://xpsintelligencesystem-production.up.railway.app`
- **API Endpoint**: `https://xpsintelligencesystem-production.up.railway.app/api`
- **WebSocket URL**: `wss://xpsintelligencesystem-production.up.railway.app`

### Configuration Files
1. **`.env.production`** - Contains the production backend URL
2. **`src/lib/config.ts`** - Exports `API_CONFIG` with fallback values
3. **`src/lib/api.ts`** - API client with 10-second timeout

## How It Works

### Connection Flow
```
1. App loads → Reads VITE_API_URL from environment
2. API client initialized with backend URL
3. First API call made (e.g., GET /api/leads)
4. If successful → Real data displayed
5. If failed/timeout → Demo data displayed + Toast notification
```

### Failover Strategy
- **Primary**: Connect to Railway backend
- **Fallback**: Use `generateDemoLeads()` from `src/lib/mockData.ts`
- **Notification**: Toast warning shows backend status
- **Timeout**: 10 seconds before falling back

## Current Behavior

### ✅ White Screen Issue - RESOLVED
The app no longer shows a white screen because:
1. Request timeout prevents indefinite hanging
2. Demo data ensures something always displays
3. Error boundaries catch React errors
4. Type errors fixed in ErrorFallback component

### When Backend is Available
- Real lead data loads from Railway
- All CRUD operations work
- WebSocket provides real-time updates
- No toast notification shown

### When Backend is Unavailable
- Demo data displayed (10 contractor leads)
- Toast: "Backend unavailable — running in demo mode"
- All UI components still functional
- Metrics calculated from demo data

## Verifying Backend Connection

### Check in Browser Console
Look for one of these messages:
- `[XPS] Configuration loaded:` - Shows API URL being used
- `Backend unavailable, using demo data` - Backend not reachable
- `[XPS CONFIG] VITE_API_URL not set, using fallback` - Using hardcoded URL

### Network Tab
1. Open DevTools → Network
2. Filter by "Fetch/XHR"
3. Look for requests to `xpsintelligencesystem-production.up.railway.app`
4. Check status codes:
   - **200 OK** = Backend connected
   - **Failed/Timeout** = Backend unavailable

### Health Check Endpoint
Test the backend directly:
```bash
curl https://xpsintelligencesystem-production.up.railway.app/api/health
```

Expected response if backend is healthy:
```json
{
  "status": "ok",
  "timestamp": "2024-01-XX..."
}
```

## Environment Variables

### Required for Production
Set in Vercel dashboard → Project → Settings → Environment Variables:

```bash
VITE_API_URL=https://xpsintelligencesystem-production.up.railway.app/api
VITE_WS_URL=wss://xpsintelligencesystem-production.up.railway.app
```

### For Local Development
Create `.env.local` file:
```bash
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
```

## Next Steps

### If Backend is Down
1. Check Railway dashboard for deployment status
2. Check Railway logs for errors
3. Verify environment variables in Railway
4. Test health endpoint directly with curl

### If Frontend Can't Connect
1. Verify VITE_API_URL is set in Vercel
2. Check CORS headers on backend
3. Verify API routes exist on backend
4. Check browser console for specific errors

### If Demo Mode Persists
1. Backend may be timing out (>10 seconds)
2. API endpoint may not exist
3. CORS may be blocking requests
4. Backend may be rate limiting requests

## Demo Data Details

### Generated Leads
The app includes 10 realistic contractor leads:
- Companies: Elite Roofing, Apex Construction, etc.
- Cities: Phoenix, Austin, Dallas, Denver, etc.
- Categories: Roofing, HVAC, Electrical, Plumbing, etc.
- Ratings: A+ through C
- Statuses: new, contacted, qualified, proposal

### Demo Limitations
- No data persistence (resets on refresh)
- No real scraper functionality
- No actual email/phone integrations
- No real-time updates via WebSocket

## Support

### Check These Files
- `src/lib/api.ts` - API client configuration
- `src/lib/config.ts` - Environment variable loading
- `src/lib/leadsApi.ts` - API endpoints and fallback logic
- `src/lib/mockData.ts` - Demo data generation
- `.env.production` - Production environment variables

### Common Issues
1. **White screen** → Check ErrorFallback.tsx and React error boundary
2. **Infinite loading** → Check request timeout in api.ts
3. **No data** → Check mockData.ts fallback
4. **API errors** → Check backend URL and CORS configuration
