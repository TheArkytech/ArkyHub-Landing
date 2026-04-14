# Vibecode Starter Template for Claude Code

## What's Included

```
your-project/
├── CLAUDE.md                    ← Project brain (Claude reads this first)
├── .claude/
│   └── mcp.json                 ← MCP servers (21st.dev, Hugging Face, Motion)
└── setup.sh                     ← One-time setup script
```

## Quick Start

### 1. Copy this template into your new project
```bash
# Create your project first
npx create-next-app@latest my-app --typescript --tailwind --app --src-dir
cd my-app

# Copy the template files
cp -r /path/to/vibecode-template/.claude .
cp /path/to/vibecode-template/CLAUDE.md .
```

### 2. Install the Claude Code Skills (one-time, global)

These install globally to `~/.claude/skills/` and work across all projects:

```bash
# In Claude Code, run these commands:

# UI/UX Pro Max — design system intelligence
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill

# Anthropic official skills — frontend-design + others
/plugin marketplace add anthropics/skills
/plugin install example-skills@anthropic-agent-skills

# Dependency Auditor — auto-checks npm packages for CVEs
/plugin marketplace add alirezarezvani/claude-skills
/plugin install dependency-auditor@claude-code-tresor

# Trail of Bits — pro-level security analysis (optional)
/plugin marketplace add trailofbits/skills

# Emil Kowalski — design engineer animation principles (taste layer)
# (Install from terminal, not /plugin)
# Run in your terminal: npx skills add emilkowalski/skill
```

### 3. Configure API Keys

**21st.dev Magic** (free during beta):
1. Go to https://21st.dev/magic
2. Sign up and get your API key
3. Set it: `export TWENTYFIRST_DEV_API_KEY="your-key"`

**Hugging Face** (free):
1. Go to https://huggingface.co
2. Create a free account
3. The MCP server handles auth via browser login — no key needed

**Motion Studio** (basic is free):
- No key needed for the basic MCP (docs + examples)
- For premium (330+ examples), add `"TOKEN": "your-token"` to env

### 4. Install project dependencies
```bash
pnpm add motion lucide-react
pnpm add -D @types/node
npx shadcn@latest init
```

### 5. Open Claude Code and start building
```bash
claude
```

Just describe what you want:
- "Build a landing page for a construction tech SaaS"
- "Create a dashboard with animated stat cards"
- "Design a dark-theme pricing section with 3 tiers"

Claude automatically reads CLAUDE.md, detects your stack, loads relevant
skills, and uses the MCP servers — no need to mention any tools by name.

## How to Customize

### Change the brand
Edit `CLAUDE.md` → Brand section. Update colors, fonts, and style.

### Change the stack
Edit `CLAUDE.md` → Stack section. Claude adapts automatically.
UI/UX Pro Max supports: React, Next.js, Vue, Nuxt, Svelte, Astro,
Flutter, SwiftUI, React Native, and plain HTML/Tailwind.

### Add more MCP servers
Edit `.claude/mcp.json` to add servers. Popular ones:
- Context7 (library docs): `npx -y @upstash/context7-mcp@latest`
- Browserbase (web testing): check browserbase.com/mcp
- Supabase (database): check supabase.com/docs/mcp

### Add project-specific skills
Create `.claude/skills/my-skill/SKILL.md` in your project.
These only apply to this project and override global skills.

## Cost Summary

| Tool               | Cost   | Notes                          |
|---------------------|--------|--------------------------------|
| UI/UX Pro Max       | Free   | Design system intelligence     |
| 21st.dev Magic      | Free   | Component generator (MCP)      |
| Motion Studio MCP   | Free   | Animation API docs (MCP)       |
| Emil Kowalski skill | Free   | Animation taste layer          |
| Hugging Face MCP    | Free   | Image generation (MCP)         |
| frontend-design     | Free   | Anthropic aesthetic skill      |
| Dependency Auditor  | Free   | Auto-scans on pkg changes      |
| /security-review    | Free   | Built into Claude Code         |
| Trail of Bits       | Free   | Pro security analysis          |
| **Total**           | **$0** |                                |

## Documentation

- [Brand Strategy](./docs/brand/README.md) — BrandScript and Positioning Statement for the landing page content
