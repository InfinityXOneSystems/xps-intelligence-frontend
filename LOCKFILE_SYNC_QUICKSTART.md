# Package Lock Sync - Quick Reference

## Why This Matters

Railway builds fail with `npm ci` when `package-lock.json` is out of sync with `package.json`. Pre-commit hooks prevent this automatically.

## Quick Setup

```bash
npm install
```

That's it! Husky hooks are auto-configured via the `prepare` script.

## How It Works

When you commit:
1. Hook detects `package.json` or `package-lock.json` changes
2. Validates they're in sync
3. **Blocks commit** if issues found
4. Shows you exactly how to fix it

## Common Workflow

```bash
# Add a package
npm install some-package

# Commit both files (hook will verify sync)
git add package.json package-lock.json
git commit -m "Add some-package"
```

## If You See an Error

```
❌ COMMIT BLOCKED: package-lock.json is out of sync
```

**Fix:**
```bash
npm install
git add package-lock.json
git commit
```

## Manual Check

```bash
npm run check-lockfile
```

## Full Documentation

See [PRE_COMMIT_HOOKS.md](./PRE_COMMIT_HOOKS.md) for complete documentation.

## Bypass (Emergency Only)

```bash
git commit --no-verify
```

⚠️ **Don't do this unless you know what you're doing** - Railway will reject the build.
