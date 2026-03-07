# XPS Intelligence Dashboard - AI Operating System

A futuristic AI operating system interface for managing scored contractor leads with real-time visualization, intelligent agent assistance, and mission control-grade command execution.

**Experience Qualities**:
1. **Futuristic** - Cutting-edge interface with glassmorphic cards, animated gradients, and metallic effects that feel like mission control technology
2. **Powerful** - Command-driven workflows and AI assistance that makes users feel they have unfair advantages in lead generation
3. **Elite** - Premium aesthetic with gold accents, liquid silver highlights, and bronze secondary tones that communicate high-value intelligence operations

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is an enterprise-grade AI operating system with glassmorphic UI, animated system indicators, universal execution canvas, AI agent integration, multi-mode content rendering, and sophisticated real-time command processing across interconnected intelligence modules.

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

The design should evoke a sense of **futuristic AI mission control** - like an elite intelligence agency's command center. The interface must feel alive with animated gradients, pulsing indicators, and glassmorphic cards that suggest sophisticated AI working seamlessly. Deep black backgrounds (#000000) provide maximum contrast for electric gold accents and liquid silver highlights. Every interaction should feel precise and powerful, with glassmorphic blurred effects and glowing borders reinforcing the premium, cutting-edge aesthetic. Think high-tech military operations meets luxury automotive interfaces.

## Color Selection

The color scheme establishes a futuristic, elite intelligence aesthetic with animated electric gold gradients against deep black, accented by liquid silver and bronze metallics.

- **Primary Color**: Electric Gold `oklch(0.85 0.15 85)` - Animated gradient power accent representing high-value intelligence and mission-critical actions, communicates premium quality and attention-demanding operations
- **Secondary Colors**: 
  - Deep Black `oklch(0.02 0 0)` - Pure background (#050505) for maximum contrast and futuristic depth
  - Liquid Silver `oklch(0.65 0.08 220)` - Metallic accents for secondary UI elements and hover states
  - Bronze `oklch(0.65 0.12 50)` - Tertiary highlights for gradient complexity
- **Accent Color**: Electric Gold `oklch(0.85 0.15 85)` - Animated gradients, active states, glow effects, and mission control indicators
- **Foreground/Background Pairings**:
  - Deep Black Background `oklch(0.02 0 0)`: White text `oklch(0.98 0 0)` - Ratio 21:1 ✓
  - Electric Gold `oklch(0.85 0.15 85)`: Deep Black text `oklch(0.02 0 0)` - Ratio 15:1 ✓
  - Liquid Silver `oklch(0.65 0.08 220)`: White text `oklch(0.98 0 0)` - Ratio 9.5:1 ✓
  - Glassmorphic Cards `rgba(255, 255, 255, 0.03)` with 24px blur: White text `oklch(0.98 0 0)` - Ratio 18:1 ✓

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

Animations should feel **futuristic and alive** - like sophisticated AI systems engaging and responding. Use precise, purposeful motion that reinforces the intelligence theme: gradients shifting across borders (3s infinite), glow effects pulsing on high-value items (2s ease-in-out), system indicators breathing with activity. Micro-interactions snap instantly (<100ms) while larger state transitions flow smoothly (300-400ms) with easing that feels technological rather than organic. Logo sparkles should animate subtly. Charts reveal with staggered data point emergence. Hover states scale elements slightly (1.02x) with simultaneous glow intensification. Everything should feel mission-critical and responsive, never casual.

## Component Selection

- **Components**:
  - Sidebar: Custom component with collapsed/expanded states using framer-motion
  - Card: shadcn Card with glassmorphic styling (rgba(255, 255, 255, 0.03) background, 24px backdrop-blur, subtle borders)
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
  - Glassmorphic card component with 24px backdrop-blur and rgba(255, 255, 255, 0.03) background
  - Glow button variant with box-shadow animation on hover
  - Custom table component with striped rows and selection states
  - AI chat message components with streaming text animation
  - Metric card component with animated number counting and glassmorphic background
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
