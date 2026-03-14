# XPS Intelligence — Control Plane (Frontend)

> **AI Operating System for Lead Intelligence & Agent Orchestration**  
> **Repository**: XPS-INTELLIGENCE-FRONTEND  
> **Deployment**: Vercel  
> **Status**: 🟡 Control Plane Implementation In Progress

---

## 🎯 Quick Start

### For New Contributors
**Start here**: [CONTROL_PLANE_DOCS_INDEX.md](./CONTROL_PLANE_DOCS_INDEX.md)

### For Implementation
**Primary Guide**: [RUNBOOK_CONTROL_PLANE.md](./RUNBOOK_CONTROL_PLANE.md)

### Current Sprint Status
**Summary**: [CONTROL_PLANE_SPRINT_SUMMARY.md](./CONTROL_PLANE_SPRINT_SUMMARY.md)  
**Phase**: Phase 0 ✅ Complete | Phase 1 ⏳ 25% Complete

---

## 📚 Documentation

### 🔍 Analysis & Status
- [**PHASE_0_FORENSIC_AUDIT.md**](./PHASE_0_FORENSIC_AUDIT.md) — Comprehensive system analysis
- [**SYSTEM_STATUS.md**](./SYSTEM_STATUS.md) — Real-time system health dashboard
- [**CONTROL_PLANE_SPRINT_SUMMARY.md**](./CONTROL_PLANE_SPRINT_SUMMARY.md) — Sprint progress

### 📐 Architecture & Governance
- [**ARCHITECTURE_CONTRACT.md**](./ARCHITECTURE_CONTRACT.md) — Non-negotiable rules (enforced by CI)
- [**REVISED_ARCHITECTURE.md**](./REVISED_ARCHITECTURE.md) — System architecture
- [**AGENTS.md**](./AGENTS.md) — Agent system specification

### 🛠️ Implementation
- [**RUNBOOK_CONTROL_PLANE.md**](./RUNBOOK_CONTROL_PLANE.md) — Step-by-step implementation guide
- [**REMEDIATION_CHECKLIST.md**](./REMEDIATION_CHECKLIST.md) — Prioritized task list

### 📋 Complete Index
- [**CONTROL_PLANE_DOCS_INDEX.md**](./CONTROL_PLANE_DOCS_INDEX.md) — All documentation indexed

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

---

## 🏗️ Project Structure

```
src/
  ├── agents/              # 13 agent implementations
  ├── components/          # UI components (shadcn/ui)
  ├── lib/
  │   ├── connectors/      # Universal connector framework (NEW)
  │   ├── orchestrator.ts  # Agent orchestration
  │   ├── llm.ts          # LLM router
  │   └── api.ts          # API client
  ├── pages/              # 19 application pages
  └── types/              # TypeScript type definitions

pages/api/                # Vercel serverless functions
  ├── integrations/       # Connector API endpoints
  ├── diagnostics/        # System diagnostics
  └── llm/               # LLM endpoints
```

---

## 🔌 Connectors

**Status**: Universal Connector Framework implementation in progress

| Connector | Status | Endpoints |
|-----------|--------|-----------|
| **Groq** | ✅ Complete | test, chat |
| **GitHub** | ⏳ In Progress | repos, workflows, dispatch, issues |
| **Vercel** | 📅 Planned | projects, deployments, redeploy |
| **Railway** | 📅 Planned | health, status, logs |
| **Supabase** | 📅 Planned | test, tables, preview, vault |

---

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Type check
npm run type-check

# Lint
npm run lint

# Full verification
npm run verify
```

---

## 🚢 Deployment

### Vercel (Production)

**Required Environment Variables**:
```bash
# Build time (VITE_ prefix)
VITE_API_URL=https://xpsintelligencesystem-production.up.railway.app/api
VITE_WS_URL=wss://xpsintelligencesystem-production.up.railway.app

# Server-side (NO VITE_ prefix)
BACKEND_URL=https://xpsintelligencesystem-production.up.railway.app
AI_GROQ_API_KEY=gsk_...
GITHUB_TOKEN=ghp_... (optional)
VERCEL_TOKEN=... (optional)
RAILWAY_TOKEN=... (optional)
SUPABASE_URL=https://...supabase.co (optional)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (optional)
```

**GitHub Secrets** (for CI/CD):
```bash
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

**Deployment Steps**: See [RUNBOOK_CONTROL_PLANE.md](./RUNBOOK_CONTROL_PLANE.md#deployment-steps)

---

## 📊 Current Status

### Build Status
- ✅ TypeScript: Passing
- ✅ ESLint: Passing
- ✅ Build: Passing
- ⚠️ Bundle Size: 1,447 KB (target: <500 KB)

### Implementation Progress
- ✅ **Phase 0**: Forensic Analysis (100%)
- ⏳ **Phase 1**: Universal Connector System (25%)
  - ✅ Connector framework defined
  - ✅ Groq connector implemented
  - ⏳ GitHub connector (next)
  - ⏳ API endpoints (pending)
  - ⏳ Diagnostics system (pending)
- 📅 **Phase 2**: Production Hardening (planned)
- 📅 **Phase 3**: Advanced Features (planned)

---

## 🤝 Contributing

### Before You Start
1. Read [ARCHITECTURE_CONTRACT.md](./ARCHITECTURE_CONTRACT.md)
2. Review [RUNBOOK_CONTROL_PLANE.md](./RUNBOOK_CONTROL_PLANE.md)
3. Check [SYSTEM_STATUS.md](./SYSTEM_STATUS.md)

### Development Workflow
1. Create feature branch from `main`
2. Follow architecture contract (enforced by CI)
3. Add tests for new functionality
4. Ensure CI passes
5. Create pull request

### Coding Standards
- **TypeScript**: All code must be strongly typed
- **Error Handling**: All API endpoints must have try/catch + zod validation
- **Timeouts**: All fetch calls must have 30s timeout
- **Secrets**: NEVER store secrets in client-side code
- **No Hardcoded URLs**: Always use environment variables

See [ARCHITECTURE_CONTRACT.md § 12](./ARCHITECTURE_CONTRACT.md#12-prohibited-patterns) for prohibited patterns.

---

## 📞 Support

### For Questions
- **Architecture**: [ARCHITECTURE_CONTRACT.md](./ARCHITECTURE_CONTRACT.md)
- **Implementation**: [RUNBOOK_CONTROL_PLANE.md](./RUNBOOK_CONTROL_PLANE.md)
- **System Status**: [SYSTEM_STATUS.md](./SYSTEM_STATUS.md)
- **Documentation**: [CONTROL_PLANE_DOCS_INDEX.md](./CONTROL_PLANE_DOCS_INDEX.md)

### For Issues
- **CI/CD Failures**: See [SYSTEM_STATUS.md § Common Issues](./SYSTEM_STATUS.md)
- **Deployment**: See [RUNBOOK_CONTROL_PLANE.md § Rollback Plan](./RUNBOOK_CONTROL_PLANE.md)

---

## 🔗 Related Repositories

- **Backend (Execution Plane)**: [InfinityXOneSystems/XPS_INTELLIGENCE_SYSTEM](https://github.com/InfinityXOneSystems/XPS_INTELLIGENCE_SYSTEM)
- **Project Board**: [GitHub Projects](https://github.com/users/InfinityXOneSystems/projects/6)

---

## 📄 License

MIT License — See [LICENSE](./LICENSE) for details.

Spark Template files and resources from GitHub are licensed under the MIT license, Copyright GitHub, Inc.
