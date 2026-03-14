#!/bin/bash

echo "🚀 Setting up pre-commit hooks for package-lock.json sync..."
echo ""

# Make sure we're in the project root
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Run this script from the project root."
  exit 1
fi

# Install dependencies (this will trigger Husky setup via prepare script)
echo "📦 Installing dependencies..."
npm install

# Make pre-commit hook executable
if [ -f ".husky/pre-commit" ]; then
  chmod +x .husky/pre-commit
  echo "✅ Made .husky/pre-commit executable"
fi

# Test the lockfile checker
echo ""
echo "🔍 Testing lockfile checker..."
if npm run check-lockfile; then
  echo "✅ Lockfile is in sync!"
else
  echo "⚠️  Lockfile may need to be regenerated"
  echo "   Run: npm install"
fi

# Test Husky installation
echo ""
echo "🪝 Testing Husky installation..."
if [ -d ".husky" ] && [ -f ".husky/pre-commit" ]; then
  echo "✅ Husky hooks installed successfully"
else
  echo "⚠️  Husky may not be installed correctly"
  echo "   Try: npx husky install"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Read PRE_COMMIT_HOOKS.md for full documentation"
echo "   2. Try making a commit to test the hooks"
echo "   3. The hooks will automatically prevent lockfile sync issues"
echo ""
echo "🔧 Manual check anytime: npm run check-lockfile"
echo ""
