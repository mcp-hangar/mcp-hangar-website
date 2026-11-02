# MCP Hangar Website

Source of [mcp-hangar.io](https://mcp-hangar.io): marketing pages, Learn and Security sections, the blog, and the rendered documentation.

## Quick Reference

| Property | Value |
|----------|-------|
| Framework | Astro 7, static output, nothing hydrated (no `client:*` directive anywhere) |
| Styling | Tailwind CSS 4 configured in CSS; every colour is a token in `packages/site/src/styles/tokens.css` |
| Package manager | pnpm 11 workspace, Node 22 (`.nvmrc`), one root lockfile |
| Hosting | Vercel, builds `packages/site/dist` from `main` |
| Gate | `pnpm verify` (what CI runs) |

## Commands

```bash
pnpm install --frozen-lockfile
pnpm dev                 # http://localhost:4321
pnpm verify              # lint, format:check, check, test:unit, build, test:build, test:e2e
pnpm --filter site exec playwright install chromium   # once, before test:e2e
pnpm brand:sync          # re-vendor packages/site/brand from the commit in brand.lock.json
pnpm --filter site release-post 2.24.0                # draft a release blog post
```

## Layout

```text
packages/site/
├── brand/            vendored from mcp-hangar/brand, pinned in brand.lock.json
├── e2e/              playwright specs
├── integrations/     og-gate.mjs fails the build on a missing OG card
├── public/           favicon, install.sh, robots.txt
├── scripts/          brand sync, advisories refresh, core data, release post, version check
└── src/
    ├── components/   .astro components; sections/ holds the homepage
    ├── content/      blog, learn and security as MDX; loaders/ for the docs
    ├── data/core.json  gate path and exporter record extracted from a core tag
    ├── og/           satori + resvg card templates rendered at build
    ├── pages/        routes
    └── __tests__/    vitest
```

## Where content comes from

- Blog, Learn and Security are MDX under `src/content` in this repository.
- Documentation is not. It is `mcp-hangar/docs`, pinned to a commit SHA in `packages/site/package.json` (`@mcp-hangar/docs`) and rendered by `src/content/loaders/oss-docs.ts`. `Rebuild on Docs Update` moves the pin nightly and on dispatch; `sync-core-version` also re-pins it when it bumps the advertised version. Never edit rendered docs here; fix them in `mcp-hangar/docs`.
- The advertised core version is `VERSION` in `packages/site/src/config.ts`. `sync-core-version` bumps it from the latest public release; CI compares it with PyPI. Do not bump it by hand.
- Brand marks and palette are vendored from `mcp-hangar/brand`. Change them there, then move the commit in `brand.lock.json` and run `pnpm brand:sync`; `brand.test.ts` fails on drift.
- `src/data/core.json` is extracted from a core clone at a release tag with `packages/site/scripts/core-data.py`. CI cannot run it; re-run by hand when a release changes the gates.

## Conventions

- Colour carries a verdict: allow, deny, hold. Everything else is a neutral ramp. `tokens.test.ts` fails the build on a colour literal or Tailwind palette class outside `tokens.css`, on a text token under 4.5:1 in either theme, and on the two dark blocks drifting apart.
- Light is the default theme; dark is a full variant with the same token names.
- Release posts start from `pnpm release-post`, carry `draft: true` and `TODO(editor)` markers; rewrite, verify against core's `CHANGELOG.md` at the tag, remove the markers, then set `draft: false`. `blog-drafts.test.ts` fails on a published post with a marker.
- Conventional Commits. Scopes are in `.github/workflows/pr-title.yml`: `site`, `learn`, `blog`, `security`, `docs`, `ci`, `deps`, `deps-dev`, `infra`, `repo`. Branch `<type>/<slug>`; PR body with `## Why` and `## How tested` in prose; squash-merge.
- No emoji in code, content or commit messages. Public text never names the test cluster's host or IP.
- An agent prepares the merge of a green PR and the owner runs it; the classifier refuses `gh pr merge` from an agent.

## Workflows

| Workflow | Purpose |
|----------|---------|
| `ci.yml` | `pnpm verify`, VERSION vs PyPI, site manifests vs operator CRDs |
| `sync-core-version.yml` | daily and on dispatch: bump `VERSION` and the docs pin, open a PR |
| `rebuild-docs.yml` | daily and on dispatch: move the docs pin to the latest commit, open a PR |
| `domain-lint.yml` | wording and domain checks on content |
| `dependabot-*.yml` | auto-merge and retry for dependency PRs |

After a core release, the version-sync PR is merged last in the cross-repo order, because it pins the docs as they are when it runs. If docs change after it merged, dispatch `Rebuild on Docs Update`.

## What NOT to Do

- Do not add `client:*` directives or a client framework.
- Do not write colour literals or Tailwind palette classes outside `tokens.css`.
- Do not edit vendored brand files or rendered docs in this repository.
- Do not bump `VERSION` or the docs pin by hand; dispatch the workflow.
- Do not publish a release post that still carries a `TODO(editor)` marker.
