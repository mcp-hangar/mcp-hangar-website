# MCP Hangar Website

Production marketing site for MCP Hangar - a production-grade control plane for Model Context Protocol providers. Zero backend, pure frontend showcase.

## Project Stack

**Framework**: React 19 + TypeScript + Vite
**Styling**: Tailwind CSS 3.4
**Testing**: Vitest + React Testing Library
**CI/CD**: GitHub Actions + Vercel
**Fonts**: Space Grotesk (display), JetBrains Mono (code)
**Target**: Modern browsers, mobile-first responsive design

## Build & Dev Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript compile + production build
npm run lint         # ESLint check
npm run preview      # Preview production build
npm run test         # Run tests with Vitest
npm run test:ui      # Run tests with Vitest UI
npm run test:coverage # Run tests with coverage report
```

## File Organization

```
src/
  App.tsx                      # Main page component with all sections
  main.tsx                     # React entry point (wraps App in ErrorBoundary)
  index.css                    # Global Tailwind + custom styles
  vite-env.d.ts                # Vite types
  components/
    ErrorBoundary.tsx          # Error boundary for graceful failure handling
    Feature.tsx                # Reusable feature card component
    Icons.tsx                  # All SVG icon components (inline)
    TerminalAnimation.tsx      # Animated terminal demo component
  __tests__/
    App.test.tsx               # Component tests
  test/
    setup.ts                   # Vitest setup (jest-dom matchers)
.claude/
  commands/                    # Custom slash commands for Claude Code
    deploy.md                  # Pre-deployment checklist
    feature.md                 # Add new feature card workflow
    release.md                 # Version bump workflow
    responsive.md              # Responsive design audit
  hooks/                       # Claude Code hooks configuration
  managed-settings.json        # Permissions and security settings
.github/
  workflows/
    ci.yml                     # CI pipeline (lint, test, build, type-check)
```

## Coding Standards

### TypeScript
- Strict mode enabled - no `any` types unless absolutely justified
- Use functional components with hooks exclusively
- **Exception**: `ErrorBoundary` is a class component (React limitation for error boundaries)
- Prefer `const` over `let`, use type inference where obvious

### React Patterns
- Single-file components - no splitting JSX/CSS/logic unless >500 lines
- Tailwind for ALL styling - no inline styles, no CSS modules
- Use semantic HTML - `<nav>`, `<footer>`, `<section>` over generic `<div>` soup
- Icons as inline SVG components in `src/components/Icons.tsx`

### Tailwind Usage
- Follow existing color scheme: `zinc-*` for grays, `emerald-*` for brand
- Use design system variables from `tailwind.config.js`
- Responsive: mobile-first, then `md:` and `lg:` breakpoints
- Animations: prefer Tailwind utilities over custom keyframes

### Component Patterns

**Feature Cards** - Use the `<Feature />` component:
```tsx
<Feature
  icon={<YourIcon />}
  title="Feature Name"
  description="Brief description of the feature."
/>
```

**Adding New Icons** - Add to `src/components/Icons.tsx`:
```tsx
export const NewIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
       stroke="currentColor" strokeWidth={1.5}>
    {/* path data */}
  </svg>
);
```

**Gradient Text**:
```tsx
<span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400
                 bg-clip-text text-transparent">
  Production-grade
</span>
```

## Design Philosophy

This is a **dark mode, terminal-aesthetic** landing page with:
- Emerald green accent color (`#22c55e`) for CTAs and highlights
- Zinc color palette for backgrounds and text
- Subtle grain texture overlay for depth
- Smooth hover transitions (300ms duration standard)
- Generous whitespace, clean typography hierarchy

### Animation Guidelines
- Hover states: `hover:-translate-y-0.5` for lift effect
- Transitions: `transition-all duration-300` as default
- Pulse effects: use `animate-pulse` sparingly
- Terminal cursor: custom blink animation in TerminalAnimation component

## Content Strategy

- **Technical but accessible** - explain features without dumbing down
- **Value-first messaging** - lead with benefits, follow with implementation
- **Community-driven tone** - emphasize open source, MIT license, contributions
- **Zero marketing fluff** - engineers smell bullshit from miles away

## External Links

All external URLs point to:
- Docs: `https://mapyr.github.io/mcp-hangar/`
- GitHub: `https://github.com/mapyr/mcp-hangar`
- PyPI: `https://pypi.org/project/mcp-hangar/`
- Install script: `https://get.mcp-hangar.io`

## Version Information

Current version badge displays: **v0.4.0**
Update these locations when releasing new versions:
- Hero badge in `src/App.tsx` (line ~76)
- Terminal animation in `src/components/TerminalAnimation.tsx` (line ~9)
- `package.json` version field

## Deployment

**Vercel Configuration** (`vercel.json`):
- `get.mcp-hangar.io` redirects to `/install.sh`
- SPA routing configured (all routes → index.html except install.sh)
- Security headers (CSP, X-Frame-Options, etc.)

**CI Pipeline** (`.github/workflows/ci.yml`):
- Runs on push/PR to `main` and `dev` branches
- Tests on Node.js 18.x and 20.x
- Steps: lint → test → build → type-check
- Uploads build artifacts from Node 20.x

## Testing

Run tests with:
```bash
npm run test           # Watch mode
npm run test -- --run  # Single run (CI mode)
npm run test:coverage  # With coverage
```

Tests are in `src/__tests__/`. Current coverage:
- App renders correctly
- Navigation links present
- Version badge displays
- Install command visible

**Testing Philosophy**: This is a static marketing site. Manual testing in browser > automated tests for this use case. Focus automated tests on critical content verification.

## Quality Checks

Before considering any change complete:
1. Run `npm run lint` - fix all ESLint errors
2. Run `npm run test -- --run` - all tests must pass
3. Run `npm run build` - ensure production build succeeds
4. Check responsive design at mobile, tablet, desktop widths
5. Verify hover states work on interactive elements
6. Test terminal animation plays smoothly

## Slash Commands

Use these in Claude Code for common workflows:
- `/deploy` - Run pre-deployment checklist
- `/feature [description]` - Add a new feature card
- `/release [version]` - Update version numbers
- `/responsive [section]` - Check responsive design issues

## What NOT to Do

- Don't add external dependencies without strong justification
- Don't create separate CSS files - use Tailwind classes
- Don't use `className="text-white"` - use `text-zinc-100` for consistency
- Don't add React Router - this is intentionally single-page
- Don't optimize images that don't exist - all graphics are SVG or Tailwind gradients
- Don't suggest "best practices" that conflict with the existing architecture
- Don't skip running lint and tests before committing

## Progressive Disclosure

**Don't scan entire codebase unless asked** - this is a single-page app:
- UI logic: `src/App.tsx` and `src/components/`
- Styling: `tailwind.config.js` and `src/index.css`
- Build: `vite.config.ts` and `package.json`
- Tests: `vitest.config.ts` and `src/__tests__/`
- Deployment: `vercel.json`
- CI: `.github/workflows/ci.yml`

Start with `App.tsx` if you need to understand the component structure - it's self-contained and well-organized into logical sections (Nav, Hero, Features, Quick Start, Contributing, Footer).

---

**Remember**: This site represents MCP Hangar, a serious infrastructure tool. The design is polished but not flashy. Think GitHub's landing page, not a SaaS startup with stock photos and rounded corners everywhere.
