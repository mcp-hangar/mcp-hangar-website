# MCP Hangar Website

The site behind [mcp-hangar.io](https://mcp-hangar.io) — the marketing pages, the
Learn and Security sections, the blog, and the rendered documentation for
[MCP Hangar](https://github.com/mcp-hangar/mcp-hangar).

## Stack

- **Astro 7**, static output. No client framework: nothing on this site is
  hydrated, and there is no `client:*` directive anywhere.
- **Tailwind CSS 4**, configured in CSS rather than in a config file — the
  `@theme` block at the top of `src/styles/global.css` is the whole palette.
- **pnpm 11** workspace, **Node 22** (`.nvmrc`). The root lockfile covers every
  package; there is no second one.
- **Vercel**, building `packages/site/dist` from `main`.

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:4321
```

`pnpm verify` is the gate everything has to pass, and it is what CI runs:

```
pnpm lint          eslint, including the workflow YAML
pnpm format:check  prettier
pnpm check         astro check
pnpm test:unit     vitest, no build required
pnpm build         157 pages and 156 OG cards
pnpm test:build    vitest against dist/
pnpm test:e2e      playwright, chromium
```

## Layout

```
packages/site/
├── brand/            vendored from mcp-hangar/brand, pinned in brand.lock.json
├── e2e/              playwright specs
├── integrations/     og-gate.mjs — fails the build on a missing OG card
├── public/           favicon, install.sh, robots.txt
├── scripts/          brand-sync.mjs
└── src/
    ├── components/   .astro components; sections/ holds the homepage
    ├── content/      blog, learn and security as MDX; loaders/ for the docs
    ├── og/           satori + resvg card templates, rendered at build
    ├── pages/        routes
    └── __tests__/    vitest
```

## Content

Blog, Learn and Security live in this repo as MDX under `src/content`.

The documentation does not. It comes from [`mcp-hangar/docs`](https://github.com/mcp-hangar/docs),
pinned to a commit SHA in `packages/site/package.json` and rendered through the
loader in `src/content/loaders/oss-docs.ts`. A nightly workflow moves that pin
and opens a PR; merging it redeploys with current docs.

## Brand

Marks and palette come from [`mcp-hangar/brand`](https://github.com/mcp-hangar/brand)
rather than being redrawn here. `brand.lock.json` pins the commit,
`pnpm brand:sync` pulls it, and `src/__tests__/brand.test.ts` fails the build if
the site drifts from it — the gate's geometry, the verdict colours, and the
served favicon are all checked against the vendored source.

## Colour

Two colours carry meaning, because the product is a binary verdict: green for
allow, rose for deny, and amber for the one state that is neither — a control
that exists but is off by default. Everything else is zinc. A hue on something
that is not a verdict is a bug, not a preference; `src/styles/global.css` says
so at greater length, and the code theme in `src/lib/code-theme.ts` is built
from lightness alone for the same reason.

## Contributing

Branch, open a PR against `main`, and make sure `pnpm verify` passes — `main` is
protected and CI runs the same command. Commit messages follow Conventional
Commits.

## License

MIT. See [LICENSE](LICENSE).
