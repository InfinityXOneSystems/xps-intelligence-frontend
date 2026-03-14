#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const packageJsonPath = resolve(process.cwd(), 'package.json');
const packageLockPath = resolve(process.cwd(), 'package-lock.json');

if (!existsSync(packageJsonPath)) {
  console.error('❌ package.json not found');
  process.exit(1);
}

if (!existsSync(packageLockPath)) {
  console.error('❌ package-lock.json not found');
  console.error('💡 Run: npm install');
  process.exit(1);
}

try {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const packageLock = JSON.parse(readFileSync(packageLockPath, 'utf-8'));

  if (packageJson.version !== packageLock.version) {
    console.error('❌ Version mismatch between package.json and package-lock.json');
    console.error(`   package.json: ${packageJson.version}`);
    console.error(`   package-lock.json: ${packageLock.version}`);
    console.error('💡 Run: npm install');
    process.exit(1);
  }

  const pkgDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const lockPackages = packageLock.packages?.[''] || packageLock;
  const lockDeps = { ...lockPackages.dependencies, ...lockPackages.devDependencies };

  const missingInLock = Object.keys(pkgDeps).filter(
    (dep) => !lockDeps[dep] && !packageLock.packages?.[`node_modules/${dep}`]
  );

  if (missingInLock.length > 0) {
    console.error('❌ Dependencies in package.json missing from package-lock.json:');
    missingInLock.forEach((dep) => console.error(`   - ${dep}`));
    console.error('💡 Run: npm install');
    process.exit(1);
  }

  console.log('✅ package-lock.json is in sync with package.json');
  process.exit(0);
} catch (error) {
  console.error('❌ Error checking lockfile sync:', error.message);
  console.error('💡 Run: npm install');
  process.exit(1);
}
