#!/bin/bash
# Vibecode Template Setup Script
# Run this inside your new project folder

set -e

echo "🎨 Vibecode Template Setup"
echo "=========================="
echo ""

# Check if we're in a project directory
if [ ! -f "package.json" ]; then
    echo "⚠️  No package.json found. Create your project first:"
    echo "   npx create-next-app@latest my-app --typescript --tailwind --app --src-dir"
    echo "   cd my-app"
    echo "   Then run this script again."
    exit 1
fi

# Copy template files
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "📁 Copying .claude/ config..."
cp -r "$SCRIPT_DIR/.claude" .

echo "📝 Copying CLAUDE.md..."
cp "$SCRIPT_DIR/CLAUDE.md" .

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm add motion lucide-react
elif command -v npm &> /dev/null; then
    npm install motion lucide-react
else
    echo "⚠️  No package manager found. Install manually: pnpm add motion lucide-react"
fi

echo ""
echo "✅ Template applied!"
echo ""
echo "Next steps:"
echo "  1. Set your 21st.dev API key:"
echo "     export TWENTYFIRST_DEV_API_KEY=\"your-key\""
echo ""
echo "  2. Install global skills (one-time, in Claude Code):"
echo "     /plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill"
echo "     /plugin install ui-ux-pro-max@ui-ux-pro-max-skill"
echo "     /plugin marketplace add anthropics/skills"
echo "     /plugin install example-skills@anthropic-agent-skills"
echo ""
echo "  3. Open Claude Code and start building:"
echo "     claude"
echo ""
echo "  Just describe what you want — all tools load automatically."
