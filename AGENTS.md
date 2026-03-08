# XPS Intelligence — AI Operating System Architecture

This document defines the architecture of the XPS Intelligence autonomous AI platform. Every subsystem described here must be implemented, operational, and verifiable from the frontend chat interface.

---

## System Overview

XPS Intelligence is a full-stack autonomous AI operating system designed to exceed the capabilities of autonomous platforms like Manus in the following dimensions:

| Dimension | Target |
|---|---|
| Parallel execution | ≥ 4 concurrent agent tasks |
| Scraping capability | Multi-source, multi-city, shadow browsing |
| Memory persistence | Vector + task + knowledge layers |
| Task completion | Goal decomposition → parallel agents → validation |
| Developer productivity | Code generation, route scaffolding, UI building |
| System transparency | Full real-time log stream and pipeline visualization |
| Sandbox reliability | Isolated execution with retry and error recovery |
| UI control | Chat-driven frontend with full agent control plane |

---

## Agent Catalog

Twelve first-class agents form the core of the AI OS. Each agent is independently schedulable and can run in parallel with other agents.

| Agent | Role | Primary Tools |
|---|---|---|
| **PlannerAgent** | Decomposes goals into tasks, routes to agents | LLM planner, task queue |
| **ResearchAgent** | Searches web, retrieves documents, synthesizes information | HTTP crawler, search engine |
| **BuilderAgent** | Generates code, scaffolds components, edits files | Code gen, filesystem, shell exec |
| **ScraperAgent** | Collects leads, contacts, company data at scale | Playwright, crawler pool, email extractor |
| **MediaAgent** | Generates and edits images, video, audio | Image gen/edit, video tools, audio tools |
| **ValidatorAgent** | Runs lint, tests, type checks, and security scans | Shell exec, test runner, linter |
| **DevOpsAgent** | Deploys, monitors, triggers workflows | Vercel, GitHub Actions, Docker |
| **MonitoringAgent** | Watches system health, alerts on anomalies | Log aggregator, metrics, websocket |
| **KnowledgeAgent** | Stores and retrieves memory across sessions | Vector DB, Redis, knowledge graph |
| **BusinessAgent** | Runs lead discovery, outreach, analytics pipelines | Lead scraper, CRM export, outreach gen |
| **PredictionAgent** | Scores leads, forecasts pipeline, models behavior | ML scoring, trend analysis |
| **SimulationAgent** | Runs scenario simulations and what-if analysis | Sandbox runtime, data modeling |

---

## Orchestration Engine

The `Orchestrator` is the central controller that manages multi-agent execution.

### Responsibilities

1. **Goal decomposition** — Parse user commands into structured task graphs
2. **Agent routing** — Select the best agent for each task based on type and load
3. **Parallel execution** — Run independent tasks concurrently (up to `concurrencyLimit`)
4. **Retry logic** — Automatically retry failed tasks (up to `maxRetries`)
5. **Error recovery** — Isolate failed tasks and continue remaining work

### Task Lifecycle

```
PENDING → RUNNING → COMPLETED
                 ↘ FAILED → (retry) → COMPLETED
                                    ↘ FAILED (max retries)
```

### Execution Flow

```
User Command
    │
    ▼
PlannerAgent (goal decomposition)
    │
    ▼
Task Graph (parallel + sequential tasks)
    │
    ├─► ScraperAgent    ──┐
    ├─► ResearchAgent   ──┤
    ├─► BuilderAgent    ──┤ parallel
    └─► BusinessAgent  ──┘
              │
              ▼
        ValidatorAgent (quality gate)
              │
              ▼
        MonitoringAgent (log + alert)
```

---

## Frontend Architecture

The frontend is the **control plane** for the entire system. All agent capabilities must be accessible via the chat interface.

### Pages

| Page | Route Key | Purpose |
|---|---|---|
| Home | `home` | Priority leads summary and quick actions |
| Dashboard | `dashboard` | KPIs, charts, and analytics |
| Leads | `leads` | Lead table with search, filter, actions |
| Scraper | `scraper` | Manual scraper configuration and run |
| Canvas | `canvas` | Universal execution canvas (5 modes) |
| Agent | `agent` | Natural language command interface |
| Pipeline | `pipeline` | Task queue, parallel agent execution view |
| Logs | `logs` | Real-time system log stream |
| Settings | `settings` | Tool registry and agent configuration |
| Roadmap | `roadmap` | Product roadmap and milestones |
| Prospects | `prospects` | Lead discovery entry point |
| Leaderboard | `leaderboard` | Sales rep performance rankings |

### Canvas Modes

The execution canvas provides five specialized rendering surfaces:

| Mode | Purpose |
|---|---|
| `scraper` | Browser preview with URL navigation and console logs |
| `data` | Table, chart, and map visualization |
| `document` | Proposal, invoice, and contract rendering |
| `dev` | Code editor, diff viewer, terminal output |
| `media` | Image, video, and audio display |

---

## Memory System

Three-layer persistent memory architecture:

| Layer | Backend | Purpose |
|---|---|---|
| **Vector Memory** | Pgvector / ChromaDB | Semantic similarity search across all stored content |
| **Task Memory** | Redis | Short-term task context and session state |
| **Knowledge Memory** | Structured DB | Long-term facts, company data, lead intelligence |

---

## Tool Registry

All agent capabilities are modeled as tools and managed through the tool registry. Tools are grouped into 11 categories:

1. **AI Models** — LLM configuration, model selection, temperature
2. **Agent Runtime** — Planner, supervisor, worker orchestration
3. **Scraping** — Lead scraping, crawling, email extraction
4. **GitHub** — PR creation, workflow dispatch, file editing, issues
5. **Deployment** — Vercel, GitHub Actions, Docker
6. **Memory** — Vector search, Redis store, knowledge graph
7. **Developer** — Code generation, debugging, route scaffolding
8. **Frontend** — Page generation, component registry, layout editor
9. **Media** — Image/video/audio generation and editing
10. **Business** — Market lead collection, outreach, analytics, CRM
11. **Integrations** — External API calls, token vault

Tool state is persisted to `localStorage` under keys `xps_agent_settings` and `xps_tool_registry`.

---

## Scraping System

The scraping engine collects construction and business leads from multiple sources:

**Data collected:**
- Company name, address, phone, email
- Website URL and social profiles
- Category/industry classification
- Lead score and priority rating

**Sources:**
- Google Maps business listings
- Yelp directory
- Industry-specific directories
- Company website crawl

**Architecture:**
- Async concurrency with configurable pool size
- Playwright browser for JavaScript-rendered pages
- Shadow browsing for rate-limit evasion
- Deduplication via normalized phone/email keys
- Results normalized to `Lead` schema

---

## GitHub Compute

GitHub Actions provides serverless compute for long-running tasks:

| Workflow | Trigger | Purpose |
|---|---|---|
| `scrape.yml` | Manual / scheduled | Parallel lead scraping |
| `build.yml` | Push / manual | Build and type-check |
| `deploy.yml` | Tag / manual | Production deployment |
| `validate.yml` | PR | Lint, tests, security scan |

Agents trigger workflows via the `github_action` task type using the GitHub API.

---

## Self-Compiling Loop

A continuous improvement loop runs periodically to keep the system healthy:

```
analyze → plan → build → test → deploy → repeat
```

Steps:
1. **Analyze** — Audit repository for missing features, broken components
2. **Plan** — Generate improvement tasks using PlannerAgent
3. **Build** — BuilderAgent implements fixes and enhancements
4. **Test** — ValidatorAgent runs all checks
5. **Deploy** — DevOpsAgent deploys on success
6. **Monitor** — MonitoringAgent watches post-deploy health

---

## Security

- All API keys stored in environment variables or the token vault
- No secrets committed to source code
- Auth tokens use `auth_token` localStorage key
- Role-based access: Admin (all leads) vs Sales Rep (assigned leads only)
- Input sanitization on all user-facing forms

---

## Verification Checklist

Every implemented subsystem must pass:

- [ ] TypeScript compilation without errors
- [ ] ESLint checks (zero warnings in CI)
- [ ] Functional end-to-end from chat command to result
- [ ] All tool registry categories have at least one enabled tool
- [ ] Pipeline page shows real-time task execution
- [ ] Agent orchestrator runs tasks in parallel
- [ ] Memory layer persists across page reload
