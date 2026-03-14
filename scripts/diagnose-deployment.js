#!/usr/bin/env node

/**
 * Deployment Diagnostics Script
 * 
 * Runs automated checks for common deployment issues
 * Run: node scripts/diagnose-deployment.js
 */

import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const checks = [];

function check(name, fn) {
  checks.push({ name, fn });
}

function pass(message) {
  console.log(`✅ ${message}`);
}

function fail(message) {
  console.log(`❌ ${message}`);
}

function warn(message) {
  console.log(`⚠️  ${message}`);
}

function info(message) {
  console.log(`ℹ️  ${message}`);
}

// Check 1: package.json exists and valid
check('package.json', () => {
  const pkgPath = join(rootDir, 'package.json');
  if (!existsSync(pkgPath)) {
    fail('package.json not found');
    return false;
  }
  
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    pass(`package.json valid (v${pkg.version})`);
    return true;
  } catch (error) {
    fail(`package.json parse error: ${error.message}`);
    return false;
  }
});

// Check 2: Critical files exist
check('Critical files', () => {
  const criticalFiles = [
    'index.html',
    'src/App.tsx',
    'src/main.tsx',
    'src/main.css',
    'vite.config.ts',
  ];
  
  let allExist = true;
  for (const file of criticalFiles) {
    const path = join(rootDir, file);
    if (existsSync(path)) {
      pass(`${file} exists`);
    } else {
      fail(`${file} missing`);
      allExist = false;
    }
  }
  
  return allExist;
});

// Check 3: Environment configuration
check('Environment config', () => {
  const envExamplePath = join(rootDir, '.env.example');
  
  if (!existsSync(envExamplePath)) {
    warn('.env.example not found');
    return true; // Not critical
  }
  
  const envExample = readFileSync(envExamplePath, 'utf-8');
  const requiredVars = envExample
    .split('\n')
    .filter(line => line.includes('=') && !line.startsWith('#'))
    .map(line => line.split('=')[0].trim());
  
  info(`Found ${requiredVars.length} environment variables in example`);
  info('Remember to set these in Vercel dashboard:');
  requiredVars.forEach(v => console.log(`  - ${v}`));
  
  return true;
});

// Check 4: index.html structure
check('index.html structure', () => {
  const indexPath = join(rootDir, 'index.html');
  if (!existsSync(indexPath)) {
    fail('index.html not found');
    return false;
  }
  
  const content = readFileSync(indexPath, 'utf-8');
  
  const requiredElements = [
    { pattern: '<div id="root">', name: 'root div' },
    { pattern: 'src="/src/main.tsx"', name: 'main.tsx script' },
    { pattern: 'href="/src/main.css"', name: 'main.css link' },
  ];
  
  let allPresent = true;
  for (const { pattern, name } of requiredElements) {
    if (content.includes(pattern)) {
      pass(`${name} present`);
    } else {
      fail(`${name} missing`);
      allPresent = false;
    }
  }
  
  return allPresent;
});

// Check 5: TypeScript configuration
check('TypeScript config', () => {
  const tsconfigPath = join(rootDir, 'tsconfig.json');
  if (!existsSync(tsconfigPath)) {
    fail('tsconfig.json not found');
    return false;
  }
  
  try {
    JSON.parse(readFileSync(tsconfigPath, 'utf-8'));
    pass('tsconfig.json valid');
    return true;
  } catch (error) {
    fail(`tsconfig.json parse error: ${error.message}`);
    return false;
  }
});

// Check 6: Backend URL configuration
check('Backend URL config', () => {
  const configPath = join(rootDir, 'src/lib/config.ts');
  if (!existsSync(configPath)) {
    warn('config.ts not found');
    return true;
  }
  
  const content = readFileSync(configPath, 'utf-8');
  
  if (content.includes('import.meta.env.VITE_API_URL')) {
    pass('Uses VITE_API_URL env var');
  } else {
    warn('Does not use VITE_API_URL env var');
  }
  
  if (content.includes('xpsintelligencesystem-production.up.railway.app')) {
    pass('Railway backend URL configured as fallback');
  } else {
    warn('Railway backend URL not found in fallback');
  }
  
  return true;
});

// Check 7: Build script
check('Build script', () => {
  const pkgPath = join(rootDir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  
  if (pkg.scripts && pkg.scripts.build) {
    pass(`Build script: ${pkg.scripts.build}`);
    return true;
  } else {
    fail('No build script found');
    return false;
  }
});

// Check 8: Dependencies
check('Dependencies', () => {
  const pkgPath = join(rootDir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  
  const criticalDeps = [
    'react',
    'react-dom',
    'vite',
    '@vitejs/plugin-react-swc',
  ];
  
  let allPresent = true;
  for (const dep of criticalDeps) {
    if (pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]) {
      pass(`${dep} installed`);
    } else {
      fail(`${dep} missing`);
      allPresent = false;
    }
  }
  
  return allPresent;
});

// Run all checks
console.log('\n🔍 Running Deployment Diagnostics...\n');

let totalChecks = 0;
let passedChecks = 0;

for (const { name, fn } of checks) {
  console.log(`\n📋 ${name}`);
  console.log('─'.repeat(50));
  
  totalChecks++;
  const result = fn();
  if (result) passedChecks++;
}

console.log('\n' + '═'.repeat(50));
console.log(`\n📊 Results: ${passedChecks}/${totalChecks} checks passed\n`);

if (passedChecks === totalChecks) {
  console.log('✅ All checks passed! Deployment should work.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some checks failed. Review errors above.\n');
  console.log('Common fixes:');
  console.log('  1. Run: npm install');
  console.log('  2. Set environment variables in Vercel dashboard');
  console.log('  3. Verify all critical files exist');
  console.log('  4. Check Railway backend is running');
  console.log('');
  process.exit(1);
}
