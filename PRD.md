# XPS Intelligence Dashboard - AI Operating System

A futuristic AI operating system interface for managing scored contractor leads with real-time visualization, intelligent agent assistance, mission control-grade command execution, progressive web app capabilities, and adaptive light/dark theme support.

2. **Powerful** - Command

This is an enterprise-grade AI operating system with glassmorphic UI, animated system indicators, universal execution canvas, AI 
## Essential Features

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is an enterprise-grade AI operating system with glassmorphic UI, animated system indicators, universal execution canvas, AI agent integration, multi-mode content rendering, sophisticated real-time command processing across interconnected intelligence modules, PWA support for offline functionality, and adaptive theming for user preference.

## Essential Features

### Progressive Web App (PWA)
- **Functionality**: Installable web application with offline support and native-like experience
- **Purpose**: Enable users to install the dashboard on their devices and access it like a native app, with offline caching for key resources
- **Trigger**: Browser detects manifest.json and service worker, prompting installation
- **Progression**: User visits app → Browser shows install prompt → User installs → App opens in standalone mode → Service worker caches resources → Offline access enabled
- **Success criteria**: App is installable on all modern browsers, service worker caches critical assets, app functions offline for viewing cached data

### Theme Switching (Light/Dark Mode)
- **Functionality**: User-selectable theme toggle between light and dark modes with persistent preference storage
- **Purpose**: Allow users to customize visual appearance based on environment, preference, or time of day
- **Trigger**: Clicking theme toggle button in top bar
- **Progression**: Click toggle → Theme switches instantly with smooth transitions → Preference saved to KV storage → Theme persists across sessions
- **Success criteria**: Smooth transition animations (<300ms), preference persists, all components adapt correctly, WCAG contrast ratios maintained in both themes

### Lead Management System
- **Functionality**: Display, filter, search, and manage scored contractor leads with full CRUD operations
- **Purpose**: Central hub for sales teams to access and action qualified leads
- **Trigger**: Navigating to Leads page or clicking lead cards
- **Progression**: View leads table → Filter/search → Select lead → View full profile → Take action (assign/email/call/edit) → Confirm → Update persists
- **Success criteria**: All lead operations complete within 2 seconds, changes persist and sync across views

### Real-time Dashboard Metrics
- **Functionality**: Display key performance indicators with live updates from scored leads data
- **Purpose**: Provide at-a-glance business health and opportunity assessment
- **Trigger**: Landing on dashboard or periodic auto-refresh
- **Progression**: Load dashboard → Fetch leads data → Calculate metrics → Animate card transitions → Display with visual hierarchy
- **Success criteria**: Metrics accurately reflect lead data, update within 1 second of data changes

### Data Visualization Suite
- **Functionality**: Interactive charts showing score distribution, pipeline stages, and geographic distribution
- **Purpose**: Enable pattern recognition and strategic decision-making through visual analytics
- **Trigger**: Dashboard load or switching to Analytics view
- **Progression**: Render chart skeleton → Load data → Animate chart drawing → Enable hover interactions → Allow filtering
- **Success criteria**: Charts render smoothly, respond to hover within 100ms, accurately represent underlying data

### AI Lead Assistant (Lead Sniper)
- **Functionality**: Conversational AI interface for lead queries, email generation, and search
- **Purpose**: Accelerate sales workflows through intelligent automation and natural language interaction
- **Trigger**: Typing in chat panel or using command bar
- **Progression**: User inputs query → Parse intent → Execute function (search/generate/analyze) → Stream response → Display actionable results
- **Success criteria**: Response latency under 3 seconds, generated content is contextually relevant, commands execute correctly

### Scraper Control Interface
- **Functionality**: Manual trigger for lead scraping with configurable parameters
- **Purpose**: Enable on-demand lead generation from external sources
- **Trigger**: Navigate to Scraper Control, configure settings, click Run Scraper
- **Progression**: Set parameters (city/category/sources) → Validate inputs → Trigger scraper → Show progress → Display results/logs
- **Success criteria**: Scraper executes with valid parameters, provides real-time status, handles errors gracefully

### Lead Profile Detail View
- **Functionality**: Comprehensive lead information panel with editing and action capabilities
- **Purpose**: Provide full context for sales engagement decisions
- **Trigger**: Clicking lead name/row in table
- **Progression**: Click lead → Slide-in panel animation → Load full profile → Display sections → Edit mode → Save changes → Close panel
- **Success criteria**: Profile loads within 500ms, edits save successfully, all lead data visible and actionable

### Command Bar Interface
- **Functionality**: Terminal-style command input for power users
- **Purpose**: Enable admins to connect and manage cloud service integrat
- **Progression**: View provider cards → Click "Connect" → Enter API 

- **Functionality**: Filter leads and features based on user role (Admin vs Sales Rep)

- **Success criteria**: Sales rep
### Individual Test Re-run Capability
- **Purpose**: Enable quick debugging of specific issues and validation of fixes without waiting for all tests
- **Progression**: Click test re-run button → Update test s



- **Malformed Lead Data**: Sa
- **Network Offline**: Queue actions for retry, show offline indicator via PWA, use ca
- **Chat API Timeout**: Show timeout message with retry, allow canceling long-running 
- **Service Worker Registration Failure**: Gra
- **Browser PWA Support**: Detect capabilities and provide appropriate install prompts or fallback messaging
## Design Direction

## Color Selection
The color scheme establishes a futuristic, elite intelligence aesthetic with animated electri
**Dark Theme (Default):**
- **Background**: Deep Black `#000000` - Pure background for 
- **Secondary Colors**: 
  - Bronze `oklch(0.72 0.14 50)` - Tertiary highlights for gradient complexity

- **Primary Color**: 

  - Muted Gold `#C4A040` - Borders and accent elements
  - Card Background `rgba(255, 255, 255, 0.95)` - Elevated surfaces with subtle opacity
**Foreground/Background Pairings**:
- Dark Mode - Electric Gold `oklch(0.905 0.182 98.111)`: Black text `#000000` - Ratio 18:1 ✓
- Light Mode - Rich Gold `oklch(0.72 0.15 85)`: Charcoal text `#1a1a1a` - Ratio 6.5:1 ✓



  - App Title/Logo: Space Grotesk Bold / 32px / -0.02em letter spacing
  - Section Headings (H2): Space Grotesk Medium / 18px / normal letter spacing / 1.3 line height
  - Body Text: Inter Regular / 14px / normal letter spacing / 1.5 line height
  - Captions/Labels: Inter Medium / 12px / 0.01em letter spacing / 1.4 line height / uppercase





  - Table: shadcn 

  - Select: shadcn Select with dark theme overrides

  - Toaster: sonner for n
  
  - Glassmorphic card component with 24px backdrop-blur and rgba(255, 255, 255, 0.03) background
  - Custom table component with striped rows and selection states
  - Metric card componen
  
  - Buttons: Default (gold border), Hover (gold glow), Active (gold filled), D
  - Table Rows: Default, Hover (bg-slate-900/50 gold-glow-left), Selected (bg-

  - Dashboard: C
  - Scraper: Gear/Robot (automation control)
  - Outreach: PaperPlaneTilt (communications)
  - Team: UserList (team management)
  - Actions: PencilSimp
  - Search: MagnifyingGlass (filters)
- **Spacing**:
  - Card padding: p-8 md:p-10 (spacious internal spacing)

  - Input padding: px-5 py-3.5 (rel
  - Sidebar padding: p-6 (comfortable navigation)
- **Mobile**:
  - Right chat panel becomes modal/sheet on mobile
  - Charts resize responsively with adjusted dimensions
  - Metric cards stack vertically in single column

## Layout Philoso

2. **Visual Hierarchy**: Clear importance ranking through size, color, and spacing


- **Home**: Minimalist dashboard with 4 key metrics and quick actions 
- **Leads**: Spacious table with generous padding, clear visual hierarchy
- **All Pages**: Back button for clear navigation, generous spacing between all elements
## Backend Integration Architecture
**Current State:**
- Mock data structure in place for development

1. **REST API Integration** - Standard HTTP API with React Query for 

**API Layer S

- `src/hooks/useLeadsApi.ts` - React Query hooks wrapping API calls

- Scraper Control: POS

- Application wor
- Environment variables control API endpoints (development/production)

- `BACKEND_INTEGRATION_GUIDE.md` - Comprehensive integration patterns and examples
- `.env.example` - Template for API configuration









































































































