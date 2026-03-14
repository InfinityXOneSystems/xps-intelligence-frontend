# Diagnostics Page - User Guide

## Overview

The System Diagnostics page provides comprehensive health monitoring and troubleshooting capabilities for the XPS Intelligence application. It includes automated tests across multiple categories and the ability to export detailed support bundles for debugging.

## Features

### 1. Automated Test Suite

Run comprehensive system checks with a single click:

- **Storage Tests**: Verify KV storage read/write operations, key retrieval, and local storage access
- **Network Tests**: Check connectivity status and external API reachability
- **Performance Tests**: Measure JavaScript execution performance and memory usage
- **Data Integrity**: Validate stored data and check for corruption
- **Browser Features**: Verify support for required browser APIs

### 2. Real-Time Status Monitoring

- Overall health percentage across all categories
- Pass/fail/warning counts at a glance
- Per-category health percentages
- Individual test execution times
- Detailed error messages and recommendations

### 3. Support Bundle Export

Export comprehensive diagnostic data for troubleshooting:

**Included in Bundle:**
- Complete test results with timing data
- System information (browser, OS, screen resolution, etc.)
- Memory usage statistics (Chrome/Edge only)
- Storage quota and usage
- Environment information
- Sanitized configuration (sensitive data redacted)

**File Format:** JSON with timestamp
**File Naming:** `diagnostics-{timestamp}.json`

## Usage

### Running Tests

1. Navigate to the Diagnostics page
2. Click "Run All Tests" button
3. Wait for all tests to complete (typically 3-5 seconds)
4. Review results organized by category
5. Check recommendations for any failures or warnings

### Exporting Support Bundle

1. Run tests first (or use previously run tests)
2. Click "Export Bundle" button
3. File downloads automatically to your default downloads folder
4. Share the file with support team for troubleshooting

### Understanding Test Results

**Status Indicators:**
- ✓ **Passed** (Green): Test completed successfully
- ⚠ **Warning** (Yellow): Test passed with concerns or degraded performance
- ✗ **Failed** (Red): Test failed and requires attention
- ⏳ **Running** (Spinner): Test is currently executing
- ○ **Pending**: Test has not run yet
- ⊘ **Skipped**: Test was skipped (feature not available)

**Health Percentage:**
- 90-100%: Excellent health
- 70-89%: Good health with minor issues
- 50-69%: Degraded performance, attention needed
- Below 50%: Critical issues require immediate action

## Test Categories

### Storage
- **KV Storage Read/Write**: Validates Spark KV persistence layer
- **KV Keys Retrieval**: Ensures key enumeration works correctly
- **Local Storage Access**: Checks browser storage permissions

### Network
- **Network Status**: Verifies online/offline status
- **External API Connectivity**: Tests outbound HTTP requests

### Performance
- **JavaScript Performance**: Benchmarks JSON serialization speed
- **Memory Usage**: Reports heap usage (Chrome/Edge only)

### Data Integrity
- **Data Integrity Check**: Scans stored data for corruption

### Browser Features
- **Browser Feature Support**: Validates required API availability
- **Spark User API**: Tests user authentication integration

## Troubleshooting

### Common Issues

**All Tests Failing:**
- Check browser console for JavaScript errors
- Try refreshing the page
- Clear browser cache and reload

**Storage Tests Failing:**
- Ensure cookies are enabled
- Check available disk space
- Try incognito/private browsing mode
- Check browser privacy settings

**Network Tests Warning:**
- Verify internet connection
- Check firewall/proxy settings
- Try disabling browser extensions

**High Memory Usage:**
- Close unnecessary browser tabs
- Reload the application
- Clear application data

**Performance Degraded:**
- Close other applications
- Check for browser extensions impacting performance
- Try a different browser

## Privacy & Security

**Automatic Redaction:**
The support bundle export automatically redacts sensitive information including:
- API tokens and keys
- Passwords and secrets
- Personal email addresses (in some contexts)

**Safe to Share:**
Exported bundles are safe to share with support teams and contain only diagnostic information necessary for troubleshooting.

## Browser Compatibility

**Full Support:**
- Chrome/Chromium (all features including memory diagnostics)
- Edge (all features including memory diagnostics)

**Partial Support:**
- Firefox (memory diagnostics skipped)
- Safari (memory diagnostics skipped)

**Minimum Requirements:**
- Modern browser with ES6+ support
- LocalStorage enabled
- IndexedDB support
- Cookies enabled

## Tips

1. **Run diagnostics regularly** to catch issues early
2. **Export bundles before reporting issues** to speed up support
3. **Check recommendations** for actionable next steps
4. **Monitor health percentages** to track system stability over time
5. **Rerun individual categories** by refreshing and running full test suite

## API Reference

For developers integrating with the diagnostics system:

```typescript
import {
  runDiagnosticTest,
  getDefaultTests,
  generateSupportBundle,
  downloadSupportBundle,
} from '@/lib/diagnostics'

// Run all tests
const tests = getDefaultTests()
for (const test of tests) {
  const result = await runDiagnosticTest(test)
  console.log(result)
}

// Generate and download bundle
const bundle = await generateSupportBundle(tests)
downloadSupportBundle(bundle)
```

## Support

If diagnostics reveal critical issues that cannot be resolved:

1. Export support bundle
2. Document steps to reproduce the issue
3. Note browser version and operating system
4. Contact support with exported bundle attached
