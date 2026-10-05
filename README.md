# MCP Hangar Website

The site behind [mcp-hangar.io](https://mcp-hangar.io) — the marketing pages, the
Learn and Security sections, the blog, and the rendered documentation for
[MCP Hangar](https://github.com/mcp-hangar/mcp-hangar).

## Stack

- **Astro 7**, static output. No client framework: nothing on this site is
  hydrated, and there is no `client:*` directive anywhere.
- **Tailwind CSS 4**, configured in CSS rather than in a config file. Every
  colour is a token in `src/styles/tokens.css`; `global.css` maps them to
  utilities and clears Tailwind's own palette.
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

## Core data

The home page draws core's gate path and quotes a record core's exporters
wrote. Both live in `packages/site/src/data/core.json`, extracted from a clone
of [`mcp-hangar`](https://github.com/mcp-hangar/mcp-hangar) at a release tag:

```bash
python3 packages/site/scripts/core-data.py ../mcp-hangar v2.24.0 \
  --python ../mcp-hangar/.venv/bin/python
```

CI cannot run it (it has no clone of core), so re-run it by hand when a
release changes the gates; `core-data.test.ts` fails if the page names a gate
or a code that the file does not.

## Brand

Marks and palette come from [`mcp-hangar/brand`](https://github.com/mcp-hangar/brand)
rather than being redrawn here. `brand.lock.json` pins the commit,
`pnpm brand:sync` pulls it, and `src/__tests__/brand.test.ts` fails the build if
the site drifts from it — the gate's geometry, the verdict colours, and the
served favicon are all checked against the vendored source.

## Colour

Light is the default theme and dark is a full variant: the same token names in
`src/styles/tokens.css`, followed from the system preference or chosen with the
toggle in the nav (remembered in `localStorage`, applied before first paint).

Three colours carry meaning, because every call ends in a verdict: allow,
deny, and hold (an approval pending, or a control that is off by default).
Everything else is a neutral ramp. A hue on something that is not a verdict is
a bug, not a preference. `src/__tests__/tokens.test.ts` fails the build on a
colour literal or a Tailwind palette class outside `tokens.css`, on a text
token under 4.5:1 in either theme, and on the two dark blocks drifting apart;
`e2e/theme.spec.ts` runs axe on sample pages in both themes, by both paths.

## Contributing

Branch, open a PR against `main`, and make sure `pnpm verify` passes — `main` is
protected and CI runs the same command. Commit messages follow Conventional
Commits.

## License

MIT. See [LICENSE](LICENSE).
