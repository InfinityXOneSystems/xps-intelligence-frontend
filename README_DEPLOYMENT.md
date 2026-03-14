# XPS Intelligence - Admin Control Plane

AI-powered lead intelligence and management system with integrated control plane for managing GitHub, Supabase, Vercel, Railway, and LLM integrations.

## 🚀 Quick Links

- **Live Site**: https://xps-intelligence.vercel.app
- **Backend**: https://xpsintelligencesystem-production.up.railway.app

## 📚 Documentation

### Deployment & Configuration
- **[Vercel Environment Variables Setup](./VERCEL_ENV_SETUP.md)** ⭐ - Step-by-step guide to configure Vercel
- **[Vercel Deployment Guide](./VERCEL_DEPLOYMENT_GUIDE.md)** - Complete deployment documentation
- **[Quick Reference](./VERCEL_ENV_QUICK_REFERENCE.md)** - Quick copy-paste reference for env vars

### Control Plane
- **[Control Plane Implementation](./CONTROL_PLANE_IMPLEMENTATION.md)** - Technical implementation details
- **[Control Plane README](./CONTROL_PLANE_README.md)** - Overview and architecture
- **[Security Documentation](./SECURITY.md)** - Security best practices

### Integration & Backend
- **[Backend Integration Guide](./BACKEND_INTEGRATION_GUIDE.md)** - Railway backend integration
- **[API Integration](./API_INTEGRATION.md)** - API documentation

## 🔧 Environment Variables

### Required Variables (Must be set in Vercel)

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... (mark as sensitive)
AI_GROQ_API_KEY=gsk_... (mark as sensitive)
```

### Optional Variables

```bash
BACKEND_URL=https://xpsintelligencesystem-production.up.railway.app
GITHUB_TOKEN=ghp_... (mark as sensitive)
VERCEL_TOKEN=... (mark as sensitive)
RAILWAY_TOKEN=... (mark as sensitive)
```

See **[VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md)** for detailed instructions.

## 🏗️ Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## 📦 Deployment

### Deploy to Vercel

1. Follow the **[Vercel Environment Variables Setup](./VERCEL_ENV_SETUP.md)** guide
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy on push to `main`

Or deploy manually:

```bash
npm run build
vercel deploy --prod
```

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build

# Verify environment variables
./scripts/verify-vercel-env.sh
```

## 🔐 Security

- All secrets are stored server-side in Supabase Vault
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code
- Mark all tokens as "Sensitive" in Vercel dashboard
- See **[SECURITY.md](./SECURITY.md)** for complete security guidelines

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
