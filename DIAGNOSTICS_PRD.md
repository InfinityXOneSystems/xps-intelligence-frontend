# Diagnostics Dashboard - System Health & Support Export

A comprehensive diagnostics interface for monitoring system health, running automated tests, and exporting support bundles for debugging.

**Experience Qualities**:
1. **Transparent** - Complete visibility into system status with clear pass/fail indicators
2. **Actionable** - One-click testing and bundle export with immediate results
3. **Technical** - Data-rich interface that respects technical users' need for detail

**Complexity Level**: Light Application (multiple features with basic state)
A diagnostic tool with automated testing suite, real-time system checks, and comprehensive data export functionality designed for debugging and support workflows.

## Essential Features

### System Health Dashboard
- **Functionality**: Real-time display of critical system checks across multiple categories
- **Purpose**: Provide instant overview of application health status
- **Trigger**: Landing on diagnostics page or clicking "Refresh Tests"
- **Progression**: Load page → Execute all tests → Display results grouped by category → Show pass/fail counts
- **Success criteria**: All tests execute within 3 seconds, results are clearly categorized, failure details are actionable

### Automated Test Suite
- **Functionality**: One-click execution of comprehensive system tests covering persistence, API connectivity, browser capabilities, and data integrity
- **Purpose**: Enable rapid troubleshooting and health verification
- **Trigger**: Clicking "Run All Tests" button or automatic on page load
- **Progression**: Click test → Execute checks in parallel → Update UI with progress → Display results with timing → Show recommendations for failures
- **Success criteria**: Tests complete within 5 seconds, all categories covered, clear pass/fail indication with actionable error messages

### Support Bundle Export
- **Functionality**: Generate and download comprehensive diagnostic data package in JSON format
- **Purpose**: Enable users to share system state with support teams for debugging
- **Trigger**: Clicking "Export Support Bundle" button
- **Progression**: Click export → Gather system info → Collect test results → Sanitize sensitive data → Generate JSON → Download file
- **Success criteria**: Bundle generates within 2 seconds, includes all relevant data, sensitive info is redacted, file is properly named with timestamp

### Test Categories
- **Functionality**: Organize tests into logical groups (Storage, Network, Performance, Data Integrity, Browser Features)
- **Purpose**: Enable quick identification of problematic areas
- **Trigger**: Automatic grouping on test execution
- **Progression**: Execute tests → Group by category → Calculate category health → Display with visual indicators
- **Success criteria**: Categories are intuitive, health percentage is accurate, failures are highlighted

### Individual Test Details
- **Functionality**: Expandable test cards showing execution time, error messages, and recommendations
- **Purpose**: Provide detailed debugging information for failures
- **Trigger**: Test execution or clicking test card for more details
- **Progression**: View test result → See status icon → Read error message → Review recommendation → Take corrective action
- **Success criteria**: Details are comprehensive, recommendations are helpful, timing data aids performance troubleshooting

## Edge Case Handling

- **All Tests Failing**: Display prominent "Critical System Issues" warning with top-level recommendations
- **Slow Test Execution**: Show progress indicators, allow cancellation, warn if tests exceed 5s threshold
- **Export with No Test Results**: Warn user to run tests first, include partial data
- **Large Bundle Size**: Compress data, show file size before download, warn if >5MB
- **Browser Compatibility Issues**: Detect missing features, show specific browser upgrade recommendations
- **Storage Quota Exceeded**: Include quota information in bundle, show clear error messages
- **Network Offline**: Skip API tests gracefully, mark as "skipped" rather than "failed"
- **Sensitive Data in Bundle**: Automatically redact API keys, tokens, emails, and personal information

## Design Direction

The design should feel **technical and data-dense** - like a developer tools panel or system monitoring dashboard. The interface prioritizes information density and clarity over decorative elements. Monospace fonts for technical data, clear status indicators (green/red/yellow), and a structured layout that technical users can scan quickly. Think Chrome DevTools meets system monitoring dashboards - professional, precise, and information-rich.

## Color Selection

The color scheme uses semantic status colors with a technical, monitoring aesthetic.

- **Primary Color**: Electric Gold `oklch(0.905 0.182 98.111)` - Action buttons and primary interactions
- **Success Color**: Vibrant Green `oklch(0.70 0.22 145)` - Passing tests and healthy systems
- **Warning Color**: Amber `oklch(0.75 0.18 85)` - Degraded performance or warnings
- **Error Color**: Alert Red `oklch(0.62 0.18 35)` - Failed tests and critical issues
- **Background**: Inherits from theme (Deep Black for dark, Pure White for light)
- **Foreground**: Inherits from theme

**Foreground/Background Pairings**:
- Success Green `oklch(0.70 0.22 145)`: White text `#FFFFFF` - Ratio 5.2:1 ✓
- Warning Amber `oklch(0.75 0.18 85)`: Black text `#000000` - Ratio 8.1:1 ✓
- Error Red `oklch(0.62 0.18 35)`: White text `#FFFFFF` - Ratio 4.8:1 ✓
- Background: Inherits theme ratios (21:1 dark, 12:1 light) ✓

## Font Selection

Typography should convey **precision and technical clarity** with monospace fonts for data and clear sans-serif for labels.

- **Typographic Hierarchy**:
  - Page Title: Space Grotesk SemiBold / 28px / -0.01em / tight leading
  - Category Headers: Inter SemiBold / 16px / normal spacing / 1.4 line height / uppercase
  - Test Names: Inter Medium / 14px / normal spacing / 1.5 line height
  - Status Labels: JetBrains Mono Bold / 13px / 0.02em / uppercase
  - Timing Data: JetBrains Mono Regular / 12px / normal spacing / tabular numbers
  - Error Messages: JetBrains Mono Regular / 13px / normal spacing / 1.5 line height
  - Metric Values: JetBrains Mono SemiBold / 18px / -0.01em / tabular numbers

## Animations

Animations should be **minimal and functional** - primarily for feedback rather than decoration. Test execution shows pulse animations on active cards (1s ease-in-out). Success/failure transitions snap quickly (150ms) with color changes. Export button shows brief success state (300ms green flash) before triggering download. Loading states use subtle pulse rather than spinners. Progress bars fill smoothly with easing. Everything communicates system activity without distracting from data.

## Component Selection

- **Components**:
  - Card: shadcn Card for test result containers and summary metrics
  - Button: shadcn Button for "Run Tests" and "Export Bundle" actions
  - Badge: shadcn Badge for test status indicators (Pass/Fail/Warning/Running)
  - Progress: shadcn Progress for test execution progress bar
  - Separator: shadcn Separator for dividing test categories
  - ScrollArea: shadcn ScrollArea for scrollable test lists
  - Alert: shadcn Alert for critical system warnings
  - Collapsible: shadcn Collapsible for expandable test details

- **Customizations**:
  - Status badge variants with semantic colors (success-green, warning-amber, error-red)
  - Metric card with large numeric display and icon
  - Test result card with expandable details section
  - Export button with download icon and success animation

- **States**:
  - Test Cards: Idle (muted), Running (pulse animation), Success (green border), Failure (red border), Warning (amber border)
  - Buttons: Default, Hover (glow), Active (pressed), Disabled (running), Success (brief green flash)
  - Progress Bar: Empty, Filling (animated), Complete
  - Category Sections: Collapsed, Expanded, All Pass (green accent), Has Failures (red accent)

- **Icon Selection**:
  - CheckCircle (passed tests)
  - XCircle (failed tests)
  - WarningCircle (warnings)
  - ArrowClockwise (refresh/rerun)
  - DownloadSimple (export bundle)
  - Play (run tests)
  - Clock (timing information)
  - Info (details/recommendations)
  - Database (storage tests)
  - Globe (network tests)
  - Gauge (performance tests)
  - BrowsersCheck (browser feature tests)

- **Spacing**:
  - Page padding: p-6 md:p-12
  - Card padding: p-6
  - Section gaps: gap-6
  - Test list gaps: gap-3
  - Metric card gaps: gap-8 md:gap-12
  - Button padding: px-6 py-3

- **Mobile**:
  - Metric cards stack vertically
  - Test categories remain expandable
  - Export button becomes full-width
  - Reduced padding (p-4 instead of p-6)
  - Status badges stack on narrow screens
  - Timing data wraps gracefully
