# XPS Intelligence - Admin Control Plane

[![Deployed on Vercel](https://img.shields.io/badge/deployed-vercel-black)](https://xps-intelligence.vercel.app/)
[![Powered by Spark](https://img.shields.io/badge/powered%20by-spark-orange)](https://github.com)

**Transform your deployed site into a fully functional Admin Control Hub.**

This repository contains XPS Intelligence with an integrated **Admin Control Plane** - a foundational architecture that enables you to connect and manage multiple cloud service integrations from a single admin dashboard.

## 🎯 What Is This?

An admin hub that:
- ✅ Tests connections to GitHub, Supabase, Vercel, Railway, and Groq
- ✅ Provides AI chat via Groq LLM API
- ✅ Runs comprehensive diagnostics with downloadable support bundles
- ⏳ Ready to expand with real integration actions (repos, workflows, deployments)

## 🚀 Quick Start

**Get up and running in 30 minutes:**

1. **Read the Quick Start Guide**: [QUICK_START.md](./QUICK_START.md)
2. Set up Supabase (5 minutes)
3. Get Groq API key (2 minutes)
4. Configure Vercel environment variables (3 minutes)
5. Deploy and test (2 minutes)

## 📚 Documentation

Start here: **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)**

### Key Documents
- **[QUICK_START.md](./QUICK_START.md)** - Setup guide (start here!)
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What's built and what's next
- **[CONTROL_PLANE_README.md](./CONTROL_PLANE_README.md)** - User guide and API docs
- **[CONTROL_PLANE_IMPLEMENTATION.md](./CONTROL_PLANE_IMPLEMENTATION.md)** - Technical guide for developers
- **[CHECKLIST.md](./CHECKLIST.md)** - Implementation progress tracker

### Configuration Files
- **[.env.control-plane.example](./.env.control-plane.example)** - Environment variables
- **[supabase-schema.sql](./supabase-schema.sql)** - Database schema

## ✨ What's Implemented

### ✅ Working Now
- Control plane framework (TypeScript types, registry, client)
- LLM chat API endpoint (`/api/llm/chat`)
- Integration test endpoints for all 5 providers
- Full diagnostics dashboard with test runner
- Support bundle generation and download
- Standardized API responses with error hints
- Database schema with Row Level Security
- Vault adapter for secret storage

### 🔜 Next Steps
1. Wire diagnostics into navigation (15 min)
2. Add authentication middleware (1-2 hours)
3. Implement GitHub actions (2-3 hours)
4. Build Control Plane UI in Settings (3-4 hours)

**Total remaining**: ~14-22 hours for complete MVP

See [CHECKLIST.md](./CHECKLIST.md) for detailed breakdown.

## 🏗️ Architecture

```
Frontend (React + TypeScript)
    ↓
Vercel Edge Functions (Serverless API)
    ↓
Supabase (Control Plane DB + Vault)
    ↓
External APIs (GitHub, Vercel, Railway, Groq)
```

## 🔑 Environment Variables

Required:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
AI_GROQ_API_KEY=gsk_...
```

Optional (for testing integrations):
```env
GITHUB_TOKEN=ghp_...
VERCEL_TOKEN=...
BACKEND_URL=https://your-backend.railway.app
```

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Vercel Edge Functions, Zod validation
- **Database**: Supabase (PostgreSQL + Vault)
- **APIs**: Groq (LLM), GitHub, Vercel, Railway
- **Deployment**: Vercel

## 🎨 Design Philosophy

- **No aesthetic changes** - Preserves existing XPS design language
- **Security first** - Secrets never exposed to browser
- **Developer friendly** - Clear error messages and hints
- **Extensible** - Easy to add new integrations

## 📦 Project Structure

```
src/
├── controlPlane/              # Frontend framework
│   ├── integrations/          # Integration types and registry
│   └── diagnostics/           # Test runner
├── pages/
│   └── DiagnosticsPage.tsx    # Full diagnostic dashboard
└── ...

pages/api/                     # Serverless backend
├── _lib/                      # Shared utilities
│   ├── utils.ts               # API helpers
│   └── vault.ts               # Secret storage
├── llm/
│   └── chat.ts                # Working chat endpoint
├── diagnostics/
│   └── status.ts              # Health check
└── integrations/
    └── */test.ts              # Provider test endpoints
```

## 🧪 Testing

### Test Chat API
```bash
curl -X POST https://your-app.vercel.app/api/llm/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'
```

### Test Diagnostics
1. Navigate to your site
2. Go to Diagnostics page
3. Click "Run All Tests"
4. Download support bundle

## 🤝 Contributing

When adding new endpoints:
1. Follow patterns in `pages/api/`
2. Use shared utilities from `_lib/`
3. Return standardized responses
4. Include error hints
5. Add timeout protection
6. Log with traceId

See [CONTROL_PLANE_IMPLEMENTATION.md](./CONTROL_PLANE_IMPLEMENTATION.md) for detailed patterns.

## 🐛 Troubleshooting

See [QUICK_START.md](./QUICK_START.md#troubleshooting) for common issues and solutions.

## 📈 Roadmap

- [x] Phase 0: Foundation ✅
- [ ] Phase 1: Deployment & Configuration
- [ ] Phase 2: UI Integration  
- [ ] Phase 3: Authentication
- [ ] Phase 4-7: Integration Actions
- [ ] Phase 8: Control Plane UI
- [ ] Phase 9-12: Testing & Production

See full roadmap in [CHECKLIST.md](./CHECKLIST.md).

## 📄 License

MIT License - See LICENSE file for details.

---

**Status**: Foundation Complete ✅  
**Next**: Follow [QUICK_START.md](./QUICK_START.md) to deploy  
**Questions**: Check [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

