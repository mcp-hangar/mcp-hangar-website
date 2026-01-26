# MCP Hangar Website

Production marketing site for MCP Hangar - a production-grade infrastructure registry for Model Context Protocol providers. Zero backend, pure frontend showcase.

## Project Stack

**Framework**: React 19 + TypeScript + Vite
**Styling**: Tailwind CSS 3.4
**Fonts**: Space Grotesk (display), JetBrains Mono (code)
**Target**: Modern browsers, mobile-first responsive design

## Build & Dev Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript compile + production build
npm run lint         # ESLint check
npm run preview      # Preview production build
```

## Coding Standards

### TypeScript
- Strict mode enabled - no `any` types unless absolutely justified
- Use functional components with hooks exclusively
- No class components, we're not savages
- Prefer `const` over `let`, use type inference where obvious

### React Patterns
- Single-file components - no splitting JSX/CSS/logic unless >500 lines
- Tailwind for ALL styling - no inline styles, no CSS modules
- Use semantic HTML - `<nav>`, `<footer>`, `<section>` over generic `<div>` soup
- Icons as inline SVG components, not external dependencies

### Tailwind Usage
- Follow existing color scheme: `zinc-*` for grays, `emerald-*` for brand
- Use design system variables from `tailwind.config.js`
- Responsive: mobile-first, then `md:` and `lg:` breakpoints
- Animations: prefer Tailwind utilities over custom keyframes

### File Organization
```
src/
  App.tsx          # Main component with all sections
  main.tsx         # React entry point
  index.css        # Global Tailwind + custom styles
  vite-env.d.ts    # Vite types
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
- Terminal cursor: custom blink animation in `index.css`

## Component Patterns

### Feature Cards
```tsx
<div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 
                hover:border-emerald-500/20 hover:bg-zinc-900/50 
                transition-all duration-300 hover:-translate-y-1">
  {/* content */}
</div>
```

### Icon Buttons
```tsx
<a className="text-zinc-500 hover:text-emerald-400 transition-colors duration-300">
  <Icon />
</a>
```

### Gradient Text
```tsx
<span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 
                 bg-clip-text text-transparent">
  Production-grade
</span>
```

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

Current version badge displays: **v0.3.0**
Update this in the hero badge when releasing new versions.

## Progressive Disclosure

**Don't scan entire codebase unless asked** - this is a single-page app:
- All UI code lives in `src/App.tsx`
- Styling config in `tailwind.config.js` and `src/index.css`
- Build config in `vite.config.ts` and `package.json`

If you need to understand the component structure, start with `App.tsx` - it's self-contained and well-organized into logical sections (Nav, Hero, Features, etc.).

## Quality Checks

Before considering any change complete:
1. Run `npm run lint` - fix all ESLint errors
2. Check responsive design at mobile, tablet, desktop widths
3. Verify hover states work on interactive elements
4. Test terminal animation plays smoothly
5. Ensure semantic HTML structure is maintained

## What NOT to Do

- ❌ Don't add external dependencies without strong justification
- ❌ Don't create separate CSS files - use Tailwind classes
- ❌ Don't use `className="text-white"` - use `text-zinc-100` for consistency
- ❌ Don't add React Router - this is intentionally single-page
- ❌ Don't optimize images that don't exist - all graphics are SVG or Tailwind gradients
- ❌ Don't suggest "best practices" that conflict with the existing architecture

## Testing Philosophy

This is a static marketing site. Manual testing in browser > automated tests for this use case.
Focus testing on:
- Visual regression (does it look right?)
- Responsive behavior (mobile to desktop)
- Link validity (do external links work?)
- Terminal animation smoothness

---

**Remember**: This site represents MCP Hangar, a serious infrastructure tool. The design is polished but not flashy. Think GitHub's landing page, not a SaaS startup with stock photos and rounded corners everywhere.
