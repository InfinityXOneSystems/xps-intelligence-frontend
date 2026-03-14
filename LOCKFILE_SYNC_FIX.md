# Package Lock File Sync Fix

## Issue Summary

The Railway build was failing with the following error:

```
npm error `npm ci` can only install packages when your package.json and package-lock.json 
or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` 
before continuing.

npm error Invalid: lock file's @github/spark@0.0.1 does not satisfy @github/spark@0.45.11
npm error Missing: octokit@5.0.5 from lock file
```

## Root Cause

The `package-lock.json` file was out of sync with `package.json`. Specifically:

1. **@github/spark version mismatch**: 
   - `package.json` specified: `"@github/spark": ">=0.43.1 <1"`
   - `package-lock.json` had: `@github/spark@0.0.1`

2. **Missing octokit dependencies**: The lock file was missing several @octokit/* packages that are dependencies of the newer octokit version

3. **Workspace package references**: The local `packages/spark-tools` was being linked as `@github/spark@0.0.1`

## Solution Applied

Ran `npm install` to regenerate the `package-lock.json` file, ensuring all dependencies are properly resolved and the lock file matches the package.json specifications.

## Verification

After running `npm install`:
- ✅ Lock file version now matches package.json requirements
- ✅ All octokit dependencies are properly resolved
- ✅ Build should pass on Railway deployment

## Prevention

The repository already has pre-commit hooks configured (see `.husky/pre-commit` and `PRE_COMMIT_HOOKS.md`). These hooks should:

1. Run `npm run check-lockfile` before commits
2. Verify package.json and package-lock.json are in sync
3. Block commits if they're out of sync

## Next Steps

1. **Commit the updated lock file**:
   ```bash
   git add package-lock.json
   git commit -m "fix: sync package-lock.json with package.json"
   git push
   ```

2. **Verify Railway build**: Once pushed, Railway will automatically trigger a new build that should succeed

3. **Monitor deployment**: Check Railway logs to confirm the build completes successfully

## Related Files

- `package.json` - Dependency specifications
- `package-lock.json` - Locked dependency tree (UPDATED)
- `.husky/pre-commit` - Pre-commit hooks
- `scripts/check-lockfile.js` - Lock file validation script
- `PRE_COMMIT_HOOKS.md` - Documentation on prevention measures

## Build Command

Railway uses Docker with this build process:
```dockerfile
RUN npm ci  # ← This was failing
RUN npm run build
```

The `npm ci` command requires an exact match between package.json and package-lock.json, which is now satisfied.
