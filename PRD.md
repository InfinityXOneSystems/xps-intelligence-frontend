# XPS Intelligence Dashboard

A production-grade intelligence dashboard for managing and analyzing scored contractor leads with real-time data visualization, AI-powered insights, and comprehensive sales pipeline management.

**Experience Qualities**:
1. **Professional** - Enterprise-grade interface that instills confidence with polished interactions and precise data presentation
2. **Intelligent** - AI-assisted workflows that feel predictive and contextually aware, reducing cognitive load
3. **Commanding** - Powerful controls and shortcuts that make users feel efficient and in control of complex operations

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a multi-view enterprise dashboard with data visualization, AI integration, role-based access, real-time updates, and sophisticated state management across multiple interconnected features.

## Essential Features

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
- **Purpose**: Enable rapid navigation and actions via keyboard shortcuts
- **Trigger**: Keyboard shortcut (Cmd/Ctrl+K) or clicking command bar
- **Progression**: Open command palette → Type command → Show suggestions → Execute → Provide feedback → Close
- **Success criteria**: Opens within 100ms, commands execute reliably, suggestions are contextually relevant

### Role-Based Access Control
- **Functionality**: Filter leads and features based on user role (Admin vs Sales Rep)
- **Purpose**: Ensure sales reps only access their assigned leads while admins see all
- **Trigger**: User authentication on app load
- **Progression**: Check user role → Set permissions → Filter data queries → Hide/show UI elements → Enforce on actions
- **Success criteria**: Sales reps only see assigned leads, admins have full access, unauthorized actions are blocked

## Edge Case Handling

- **Empty Data States**: Display helpful empty states with CTA to run scraper or add first lead
- **API Failures**: Show toast notifications with retry option, gracefully degrade to cached data
- **Invalid Scraper Parameters**: Inline validation with helpful error messages, prevent submission
- **Malformed Lead Data**: Sanitize inputs, show fallback values (N/A), log errors for debugging
- **Concurrent Edits**: Last-write-wins with timestamp, show warning if data changed during edit
- **Network Offline**: Queue actions for retry, show offline indicator, use cached data
- **Large Datasets**: Implement virtual scrolling for tables, pagination for charts, lazy load profiles
- **Chat API Timeout**: Show timeout message with retry, allow canceling long-running requests

## Design Direction

The design should evoke a sense of **elite intelligence operations** - like a mission control center for sales teams. Users should feel they're working with cutting-edge technology that gives them an unfair advantage. The interface should be sleek, precise, and slightly futuristic, with subtle animations that suggest sophisticated AI working behind the scenes. Think high-end financial terminals meets modern SaaS elegance.

## Color Selection

The color scheme establishes a premium, intelligence-focused aesthetic with electric gold as the power accent against a deep black backdrop.

- **Primary Color**: Electric Gold `oklch(0.85 0.15 85)` - Represents high-value opportunities and intelligence insights, communicating premium quality and attention-commanding actions
- **Secondary Colors**: 
  - Deep Black `oklch(0.1 0 0)` - Primary background for maximum contrast and sophistication
  - Slate Gray `oklch(0.35 0.01 250)` - Secondary UI elements and muted content
  - Steel Blue `oklch(0.5 0.08 240)` - Informational accents and secondary actions
- **Accent Color**: Electric Gold `oklch(0.85 0.15 85)` - CTAs, highlights, active states, and premium features
- **Foreground/Background Pairings**:
  - Deep Black Background `oklch(0.1 0 0)`: White text `oklch(0.98 0 0)` - Ratio 16.8:1 ✓
  - Electric Gold `oklch(0.85 0.15 85)`: Deep Black text `oklch(0.1 0 0)` - Ratio 12.3:1 ✓
  - Slate Gray `oklch(0.35 0.01 250)`: White text `oklch(0.98 0 0)` - Ratio 8.2:1 ✓
  - Glass Cards `oklch(0.15 0 0 / 0.6)`: White text `oklch(0.98 0 0)` - Ratio 14.2:1 ✓

## Font Selection

Typography should convey **precision, modernity, and technological sophistication** - a blend of geometric clarity for data and refined elegance for branding.

- **Typographic Hierarchy**:
  - App Title/Logo: Space Grotesk Bold / 32px / -0.02em letter spacing
  - Page Headings (H1): Space Grotesk SemiBold / 24px / -0.01em letter spacing / 1.2 line height
  - Section Headings (H2): Space Grotesk Medium / 18px / normal letter spacing / 1.3 line height
  - Card Titles (H3): Inter SemiBold / 16px / normal letter spacing / 1.4 line height
  - Body Text: Inter Regular / 14px / normal letter spacing / 1.5 line height
  - Table Data: JetBrains Mono Regular / 13px / normal letter spacing / 1.4 line height
  - Captions/Labels: Inter Medium / 12px / 0.01em letter spacing / 1.4 line height / uppercase
  - Command Bar: JetBrains Mono Medium / 14px / normal letter spacing

## Animations

Animations should feel **precise and purposeful** - like sophisticated machinery engaging rather than playful bounces. Use animations to reinforce the intelligence theme: data flowing, insights emerging, and systems responding with precision timing. Micro-interactions should have snappy feedback (<150ms) while larger transitions (page changes, panel slides) can take 300-400ms with smooth easing. Glow effects should pulse subtly on high-value items. Charts should animate-in with staggered reveals. Avoid anything that feels casual or whimsical.

## Component Selection

- **Components**:
  - Sidebar: Custom component with collapsed/expanded states using framer-motion
  - Card: shadcn Card with custom glassmorphic styling via Tailwind backdrop-blur and borders
  - Table: shadcn Table with custom row hover states and virtual scrolling for performance
  - Dialog/Sheet: shadcn Sheet for lead profile panels with slide-in animations
  - Button: shadcn Button with custom gold gradient variant and glow hover effects
  - Input: shadcn Input with gold focus rings and dark styling
  - Select: shadcn Select with dark theme overrides
  - Badge: shadcn Badge for status indicators (A+, Assigned, etc.)
  - Tabs: shadcn Tabs for switching dashboard views
  - Command: shadcn Command (cmdk) for command bar interface
  - Toaster: sonner for notifications with dark theme
  - Charts: Recharts (BarChart, PieChart, AreaChart) with custom dark theme and gold accents
  
- **Customizations**:
  - Glassmorphic card component with backdrop-blur-xl and border-gold/20
  - Glow button variant with box-shadow animation on hover
  - Custom table component with striped rows and selection states
  - AI chat message components with streaming text animation
  - Metric card component with animated number counting
  - Command palette with fuzzy search and keyboard navigation
  
- **States**:
  - Buttons: Default (gold border), Hover (gold glow), Active (gold filled), Disabled (opacity-50)
  - Inputs: Default (border-slate), Focus (border-gold ring-gold), Error (border-red), Filled (bg-slate-900)
  - Table Rows: Default, Hover (bg-slate-900/50 gold-glow-left), Selected (bg-gold/10), Loading (skeleton)
  - Cards: Default (glass), Hover (border-gold glow), Active (lift-shadow), Loading (pulse)
  
- **Icon Selection**:
  - Dashboard: ChartBar (overview metrics)
  - Leads: Users (lead management)
  - Scraper: Gear/Robot (automation control)
  - Pipeline: FunnelSimple (sales stages)
  - Outreach: PaperPlaneTilt (communications)
  - Analytics: ChartLine (data insights)
  - Team: UserList (team management)
  - Settings: GearSix (configuration)
  - Actions: PencilSimple (edit), Trash (delete), UserPlus (assign), Envelope (email), Phone (call)
  - Command: Terminal (command bar trigger)
  - Search: MagnifyingGlass (filters)
  
- **Spacing**:
  - Page padding: p-6 (24px)
  - Card padding: p-6 (24px)
  - Section gaps: gap-6 (24px)
  - Component gaps: gap-4 (16px)
  - Button padding: px-6 py-2.5 (24px/10px)
  - Input padding: px-4 py-2 (16px/8px)
  - Table cell padding: px-4 py-3 (16px/12px)
  - Sidebar padding: p-4 (16px)
  
- **Mobile**:
  - Sidebar collapses to bottom navigation bar on mobile (<768px)
  - Right chat panel becomes modal/sheet on mobile
  - Table switches to card-based mobile view with stacked information
  - Charts resize responsively with adjusted dimensions
  - Command bar becomes full-screen modal on mobile
  - Metric cards stack vertically in single column
  - All touch targets minimum 44x44px
  - Reduced padding/gaps (p-4 instead of p-6)
