# Pre-Commit Hooks Guide

## Overview

This project uses **Husky** pre-commit hooks to prevent `package-lock.json` sync issues that cause Railway build failures.

## Problem Statement

When `package.json` and `package-lock.json` fall out of sync, Railway's Docker build fails with:

```
npm ci can only install packages when your package.json and package-lock.json are in sync
```

This happens when:
- Dependencies are added/updated in `package.json` but `npm install` wasn't run
- `package-lock.json` is missing from commits
- Manual edits to `package.json` without regenerating the lockfile

## Solution: Automated Pre-Commit Checks

We've implemented two layers of protection:

### 1. Husky Git Hooks (Primary)

Located in `.husky/pre-commit`, this hook runs automatically before every commit.

**What it does:**
- ✅ Detects changes to `package.json` or `package-lock.json`
- ✅ Verifies they're in sync using `npm run check-lockfile`
- ✅ Blocks commits if sync issues are found
- ✅ Provides clear remediation instructions

**Installation:**
```bash
npm install
```

The `prepare` script in `package.json` automatically sets up Husky.

### 2. Pre-Commit Framework (Optional)

Located in `.pre-commit-config.yaml`, this provides additional validation if you use the `pre-commit` framework.

**Installation:**
```bash
pip install pre-commit
pre-commit install
```

## How It Works

### The Lockfile Checker (`scripts/check-lockfile.js`)

This script performs comprehensive validation:

1. **Version Check**: Ensures `package.json` and `package-lock.json` versions match
2. **Dependency Check**: Verifies all dependencies in `package.json` exist in `package-lock.json`
3. **Clear Errors**: Provides actionable error messages with fix instructions

### Pre-Commit Flow

```
┌─────────────────────┐
│ git commit          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────┐
│ Husky pre-commit hook triggers  │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│ Check if package files changed  │
└──────────┬──────────────────────┘
           │
           ▼
        ┌──┴──┐
        │ Yes │
        └──┬──┘
           │
           ▼
┌─────────────────────────────────┐
│ Run check-lockfile.js           │
└──────────┬──────────────────────┘
           │
      ┌────┴────┐
      │         │
    ✅ Pass   ❌ Fail
      │         │
      ▼         ▼
   Commit    Block
  Allowed   Commit
```

## Common Scenarios

### Scenario 1: Adding a New Dependency

```bash
# ❌ Wrong - will be blocked
npm install --save-exact some-package
git add package.json
git commit -m "Add package"  # BLOCKED!

# ✅ Correct
npm install --save-exact some-package
git add package.json package-lock.json
git commit -m "Add package"  # Success!
```

### Scenario 2: Updating Dependencies

```bash
# ❌ Wrong
npm update some-package
git add package.json
git commit -m "Update package"  # BLOCKED!

# ✅ Correct
npm update some-package
git add package.json package-lock.json
git commit -m "Update package"  # Success!
```

### Scenario 3: Manual package.json Edit

```bash
# You manually edit package.json
vim package.json

# ❌ Wrong
git add package.json
git commit -m "Update deps"  # BLOCKED!

# ✅ Correct
npm install  # Regenerate lockfile
git add package.json package-lock.json
git commit -m "Update deps"  # Success!
```

## Error Messages & Fixes

### Error: "package-lock.json is out of sync"

```
❌ COMMIT BLOCKED: package-lock.json is out of sync with package.json

To fix this issue:
  1. Run: npm install
  2. Stage the updated package-lock.json: git add package-lock.json
  3. Try committing again
```

**Fix:**
```bash
npm install
git add package-lock.json
git commit
```

### Error: "You're committing package.json changes without package-lock.json"

```
⚠️  WARNING: You're committing package.json changes without package-lock.json

To fix this:
  1. Run: npm install
  2. Stage the lockfile: git add package-lock.json
  3. Try committing again
```

**Fix:**
```bash
npm install
git add package-lock.json
git commit
```

### Error: "Dependencies in package.json missing from package-lock.json"

```
❌ Dependencies in package.json missing from package-lock.json:
   - some-package
   - another-package
💡 Run: npm install
```

**Fix:**
```bash
npm install
git add package-lock.json
git commit
```

## Manual Verification

You can manually check lockfile sync at any time:

```bash
npm run check-lockfile
```

This is useful when:
- Pulling changes from other developers
- Switching branches
- Debugging dependency issues
- Before pushing to CI/CD

## Bypassing Hooks (Emergency Only)

If you absolutely must bypass the pre-commit hooks:

```bash
git commit --no-verify -m "Emergency commit"
```

⚠️ **WARNING**: Only do this if you understand the risks. Railway builds will fail if lockfiles are out of sync.

## CI/CD Integration

The lockfile check is also integrated into CI/CD:

### GitHub Actions

Add to your workflow:

```yaml
- name: Check lockfile sync
  run: npm run check-lockfile
```

### Railway

Railway uses `npm ci` which automatically fails on sync issues, so no additional check is needed.

## Troubleshooting

### Husky not running

```bash
# Reinstall Husky
npm install
npx husky install
chmod +x .husky/pre-commit
```

### Check script fails unexpectedly

```bash
# Debug the checker
node scripts/check-lockfile.js

# Regenerate lockfile from scratch
rm package-lock.json
npm install
```

### Pre-commit hook is slow

The check typically runs in <100ms. If it's slow:
- Check your `node_modules` size
- Ensure you're not running in a slow filesystem (e.g., network drive)

## Best Practices

1. **Always use npm commands**: Use `npm install`, `npm update`, `npm uninstall` rather than manual edits
2. **Commit lockfile with package.json**: Always stage both files together
3. **Don't edit lockfile manually**: It's generated, don't touch it
4. **Use exact versions**: Use `--save-exact` flag when installing critical dependencies
5. **Review lockfile diffs**: Check what actually changed before committing
6. **Keep lockfile in git**: Never add `package-lock.json` to `.gitignore`

## Related Documentation

- [Railway Build Failures](./RAILWAY_BUILD_FIX.md) - Understanding Railway build issues
- [NPM CI vs Install](https://docs.npmjs.com/cli/v10/commands/npm-ci) - NPM's official docs
- [Husky Documentation](https://typicode.github.io/husky/) - Git hooks made easy

## Maintenance

### Updating Husky

```bash
npm install husky@latest --save-dev
```

### Updating the Checker Script

The checker script is at `scripts/check-lockfile.js`. Modify as needed for your project's requirements.

### Adding More Pre-Commit Checks

Edit `.husky/pre-commit` to add additional validation:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Existing lockfile check
npm run check-lockfile

# Add your custom checks here
npm run lint-staged
npm run type-check
```

## Support

If you encounter issues with pre-commit hooks:

1. Check this documentation first
2. Run manual verification: `npm run check-lockfile`
3. Review error messages carefully
4. Regenerate lockfile: `npm install`
5. Contact the team if issues persist

---

**Last Updated**: 2024-03-14  
**Maintainer**: XPS Intelligence Team
