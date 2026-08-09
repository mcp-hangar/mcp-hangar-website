# WS-0 — Repo inventory for the verdict-system redesign

Recon only; no source changed in this workstream. Everything below was read off
`origin/main` at `bf63a46`, not off a feature branch.

All paths are relative to `packages/site/` unless stated otherwise.

---

## 0. Findings that change later workstreams

Read these four before planning anything else.

### 0.1 The epic's starting point already moved — main is three PRs ahead

`origin/main` is at `bf63a46 refactor(site): rebuild the homepage around six sections (#150)`. Merged since the epic was written:

| PR | What landed |
| --- | --- |
| website #150 | homepage rebuilt to six sections; `QuickStart`, `ProductionSecurity`, `StandardsCoverage`, `Documentation`, `BuiltonOpenSource` deleted; `ThreeDoors` added |
| website #151 | Learn track navigation — `src/lib/learn-track.ts`, prev/next + "go deeper" on every Learn page |
| docs #168 | 16 docs pages now link back to their Learn concept |

**The epic's complaint still stands** — the 16-tile grid is alive: `Capabilities.astro` renders four cards × four items. WS-3 kills it as specified. But the sections it lists as present (`QuickStart`, the standards section as a full section) are gone, and the current order is Hero → WhyEnforcement → Architecture → Capabilities → AsyncGovernance → ThreeDoors. WS-3 should be re-read against this, not against the July page.

### 0.2 Tailwind v4, CSS-first — there is no `tailwind.config.js`

Tailwind is wired as a Vite plugin (`@tailwindcss/vite` 4.3.3, `astro.config.mjs:36`) and configured **in CSS**: `src/styles/global.css` opens with `@import "tailwindcss"`, `@plugin "@tailwindcss/typography"`, then a `@theme { }` block.

`@theme` today contains **only fonts and animations — zero color tokens**:

```css
--font-sans: 'Space Grotesk', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
--animate-pulse-slow / --animate-fade-in / --animate-slide-up
```

So WS-1 introduces the first colour tokens this repo has ever had, and it does it in `@theme` — creating a `tailwind.config.js` would be the parallel convention the epic warns against. Both fonts the epic wants are already loaded locally via `@fontsource-variable` (no new downloads needed, as required).

### 0.3 `llms.txt`, `llms-full.txt` and the `.md` mirrors are **generated**, not hand-maintained

They are Astro routes, evaluated at build:

- `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`
- mirrors: `src/pages/blog/[slug].md.ts`, `src/pages/docs/[...slug].md.ts`, `src/pages/learn/[slug].md.ts`

`llms.txt.ts` builds its sections by reading the `oss`, `learn` and `blog` collections and bucketing docs by path prefix (`getting-started/`, `guides/`, `cookbook/`, `reference/`, `architecture/`, `adr/`, …). It already derives a **security** bucket from docs pages.

**This removes the "write the generation script" branch of WS-7.** It also creates a constraint for WS-5 — see next.

### 0.4 Static pages have no `.md` mirror — this decides WS-5's shape

Every mirror route is collection-backed. The three hardcoded pages (`index.astro`, `privacy.astro`, `terms.astro`) have **no** `.md` twin and appear in no llms section.

C10 requires every content page to keep a `.md` mirror at the same path. So `/security`, `/security/cve-ledger` and `/security/owasp-mcp-top-10` **cannot be hardcoded `.astro` pages**. Two options, in order of fit:

1. **New `security` content collection** (+ a `[slug].md.ts` mirror and an llms section) — follows the pattern the repo already uses three times. Also makes "adding a CVE entry is one markdown block" true by construction.
2. Keep them as `.astro` and write a bespoke mirror route — more code, new convention, and the ledger stops being markdown-editable.

Recommend (1). Flagging because it is a structural decision, not an implementation detail.

---

## 1. Component tree

```
src/
  layouts/Base.astro          — <head>, meta/OG, JSON-LD, SiteNav + slot + SiteFooter
  components/
    SiteNav.astro  SiteFooter.astro
    Badge.astro  Button.astro  Callout.astro  Feature.astro
    Step.astro  StepList.astro          (used by 3 Learn pages — not homepage)
    DocsSidebar.astro  DocsNavPrevNext.astro  BlogByline.astro
    CodeBlock.tsx                        (the only React island)
    icons/*.astro
    sections/                            (homepage only)
      Hero · WhyEnforcement · Architecture · Capabilities · AsyncGovernance · ThreeDoors
  pages/
    index.astro  privacy.astro  terms.astro
    learn/index.astro  learn/[slug].astro  learn/[slug].md.ts
    docs/index.astro  docs/[...slug].astro  docs/[...slug].md.ts
    blog/…  llms.txt.ts  llms-full.txt.ts  blog.xml.ts
  lib/  version-badge.ts · learn-track.ts · rehype-doc-links.ts
  content/  blog/ learn/ loaders/   (+ content.config.ts)
  styles/global.css
```

Homepage section order lives in `src/pages/index.astro`; there is no layout-level section registry.

### 1.1 The Learn pipeline diagram is div-soup — WS-2 is a rebuild, not a move

`src/pages/learn/index.astro` is **711 lines**, and the diagram is inline in it:

- **0** `<svg>` elements — it is entirely divs and borders
- **20** `.ctl` control divs carrying `data-filter` / `data-theme` / `data-active`
- **281 lines** of page-scoped `<style>`
- **1** `<script>` block driving the single-highlight filter behaviour

The epic anticipated this. `PipelineMotif` with a `size` prop means extracting markup **and** 281 lines of CSS **and** the filter script into a component, then proving the Learn page still filters identically. Budget WS-2 accordingly; this is the largest single piece of WS-2.

---

## 2. Content model

| Collection | Source | Route | `.md` mirror |
| --- | --- | --- | --- |
| `blog` | `src/content/blog/*.mdx` | `/blog/[slug]` | yes |
| `learn` | `src/content/learn/*.mdx` (16 files) | `/learn/[slug]` | yes |
| `oss` | custom loader `content/loaders/oss-docs.ts` (docs repo, pinned git dep) | `/docs/[...slug]` | yes |

`learn` frontmatter is the richest schema: `type` (Concept/Tutorial/Why/Visual), `level`, `time`, `theme` (foundations/enforcement/async/observability), `since`, `tags`. A `security` collection should be modelled on it.

Docs are pre-rendered in the **loader's own unified() pipeline**, not Astro's markdown pipeline — `astro.config` rehype plugins are a no-op for them; `lib/rehype-doc-links.ts` is registered inside the loader instead. Relevant if WS-7 touches docs rendering.

Version single source: `src/config.ts` → `VERSION = "2.5.0"`, `VERSION_TAG`. Consumed by hero badge, footer, JSON-LD and the Learn "Since / Landing in" logic (`lib/version-badge.ts`).

---

## 3. Tailwind / colour inventory

Raw utilities in markup; **no semantic layer exists yet**. Counts over `src/` (utility-prefixed occurrences: `text|bg|border|from|via|to|ring|shadow|decoration|fill|stroke`):

| family | count | note |
| --- | --- | --- |
| `zinc` | 346 | the base; stays |
| `emerald` | 167 | brand green — most of it decorative, not "allow" |
| `amber` | 37 | mixed meaning; see below |
| `sky` | 35 | **to be removed entirely (WS-1)** |
| `teal` | 1 | hero gradient tail (`to-teal-400`) |
| `rose` / `red` | **0** | `verdict-deny` is a brand-new family — nothing to migrate |

### `sky-*` by file (7 files, 35 uses)

| file | uses |
| --- | --- |
| `components/sections/Capabilities.astro` | 8 |
| `components/Feature.astro` | 7 |
| `components/sections/ThreeDoors.astro` | 6 |
| `components/sections/Architecture.astro` | 5 |
| `components/Badge.astro` | 5 |
| `components/Button.astro` | 3 |
| `pages/index.astro` | 1 (the hero radial gradient layer) |

### `amber-*` by file (4 files, 37 uses) — meaning audit needed

| file | uses | current meaning |
| --- | --- | --- |
| `components/sections/Capabilities.astro` | 27 | Compliance card accent **and** the hardening panel — decorative, not opt-in |
| `components/Callout.astro` | 7 | warning callout — not opt-in |
| `pages/learn/[slug].astro` | 2 | the `Visual` page-type badge — not opt-in |
| `components/sections/WhyEnforcement.astro` | 1 | the `risk 0.87` detector chip — arguably correct as "not a verdict" |

Only the Learn pipeline's opt-in markers use amber the way the epic wants to formalise. **Most amber on the site today means something else** — WS-1's amber audit is bigger than a rename.

### Type scale

- `text-7xl`: **1** occurrence — `sections/Hero.astro` (`text-5xl md:text-7xl`). Capping at `5xl` is a one-line change.
- `text-6xl`: **0**.
- Section `h2` is already `text-4xl md:text-5xl` after #150 — the epic's "cap h2 at 4xl" is a **reduction** from what shipped yesterday, worth confirming with Marcin before applying.
- Eyebrows are currently `font-semibold uppercase tracking-[0.16em]` in the sans face; moving them to mono is a global find-and-replace across the six sections plus Learn.
- Gradients: 12 `bg-gradient`/`radial-gradient` occurrences remain site-wide (hero layer is in `index.astro`).

---

## 4. Head, OG, favicon, JSON-LD

All in `src/layouts/Base.astro`:

- OG image: **static file** `public/og-image.png`, referenced as `${siteUrl}/og-image.png`. No generation step — WS-7 regenerates the PNG by hand and drops it in.
- Favicon: `public/favicon.svg` — two colours, `#09090b` (zinc-950) and `#10b981` (emerald-500). **No sky**, and emerald-500 is exactly the brand green WS-1 keeps as `verdict-allow`. So the favicon needs no replacement; C-check it, don't redraw it.
- JSON-LD: a **single site-wide** `SoftwareApplication` block, inlined in `Base.astro`, using `VERSION`.
  There is **no per-page JSON-LD mechanism**. WS-5's `ItemList`/`TechArticle` for the ledger therefore needs either a small `jsonLd` prop threaded through `Base`, or nothing at all. Given "no bespoke SEO framework", a single optional prop is the proportionate move — but it is new plumbing, so call it out in the WS-5 PR rather than smuggling it in.

Other head facts: canonical is slash-less and Vercel 308-redirects the trailing-slash form (`astro.config.mjs` comment) — keep new `/security` URLs slash-less to match.

---

## 5. Navigation & `/features`

`SiteNav.astro` nav array: `/#features` (label "Features"), `/docs/`, `/learn/`, `/docs/blog/`, GitHub.
`SiteFooter.astro` also links `/#features`, plus `/learn/` (added in #150).

**There is no `/features` route** — only the `#features` anchor, which is `id="features"` on `Capabilities.astro`. So WS-4 needs **no 301**: removing the nav item is safe. What it does need is the anchor's fate decided, because two components point at it and WS-3 replaces the section that carries it.

Syntax highlighting: **Shiki**, configured in `astro.config.mjs` (`shikiConfig`), with `CodeBlock.tsx` as the interactive island. `PolicySnippet` (WS-2) should build on these rather than introduce a highlighter.

---

## 6. Test surface that will push back

`src/__tests__/build-output.test.ts` asserts literal strings in built HTML — `id="features"`, `pip install mcp-hangar`, `How it works`, `Capabilities`, `Governance`, `Per-caller access policies`, `Open Source — MIT License`, plus JSON-LD presence. `learn-track.test.ts` asserts the track footer on all 16 Learn pages.

WS-3 deletes or rewrites several of those strings. Update the assertions deliberately, in the same PR that changes the markup — do not delete coverage to make a build pass.
