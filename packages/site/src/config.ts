/** Shared configuration constants used across the marketing site. */

/**
 * Current released version of mcp-hangar, shown across the marketing site
 * (hero badge/button, footer, quick-start output, structured data).
 * Bump this in one place when a new release ships.
 *
 * **Stable releases only.** `pip install mcp-hangar` does not resolve to a
 * prerelease without `--pre`, so advertising a candidate here puts a version
 * beside an install command that will not produce it. It also decides whether
 * a Learn page reads "Since X" or "Landing in X" (see lib/version-badge), and
 * a candidate for X is not X.
 */
export const VERSION = "2.24.0";

/** Version prefixed with a leading "v", e.g. "v1.4.0". */
export const VERSION_TAG = `v${VERSION}`;

/**
 * How long the laptop quick start takes, install to the first governed deny.
 * One number, stated everywhere the site gives a duration for that journey:
 * the hero, the Learn tutorial's title and card, and the /docs index. It used
 * to be four (60 seconds, 5 min, "under 2 minutes", ten minutes).
 *
 * Measured 2026-10-04 against mcp-hangar 2.24.0 on macOS, cold: a fresh venv,
 * an empty HOME (so no npx/uvx cache), `pip install mcp-hangar==2.24.0`, then
 * the quick start as written -- `init -y` (starts and pins three servers),
 * `git clone`, `pin --write`, one allowed `echo`, the description change, and
 * the refused `echo` ("schema does not match its pinned digest"). Machine time
 * was 33 seconds; the rest is a person typing six commands, writing demo.yaml,
 * pointing a client at it and restarting the client twice. Five minutes
 * covers that with room, and is a promise a first-time reader can keep.
 *
 * Frontmatter cannot import this, so the Learn entry repeats it literally and
 * a unit test (time-to-value.test.ts) holds the two together.
 */
export const TIME_TO_VALUE = {
  /** In a sentence: "in five minutes". */
  words: "five minutes",
  /** On a card or a meta line. */
  short: "5 min",
} as const;

/** Base URL for the docs. */
export const DOCS_BASE = "/docs";

/** External links used in multiple places. */
export const LINKS = {
  github: "https://github.com/mcp-hangar/mcp-hangar",
  pypi: "https://pypi.org/project/mcp-hangar/",
  ossQuickstart: `${DOCS_BASE}/getting-started/quickstart`,
  ossDocs: `${DOCS_BASE}/`,
  blog: `${DOCS_BASE}/blog/`,
  /** The product's release notes. Not `/docs/changelog`: that page is the
   *  docs repo's own changelog, versioned separately from core. */
  changelog: "https://github.com/mcp-hangar/mcp-hangar/releases",
  /** How to contribute. On GitHub, not on the site: contributor and process
   *  pages are not product docs (see lib/docs-publication). */
  contributing:
    "https://github.com/mcp-hangar/mcp-hangar/blob/main/CONTRIBUTING.md",
} as const;

/** The install command shown in the landing page. */
export const INSTALL_COMMAND = "pip install mcp-hangar";

/** Alternative install commands for the quick start section. */
export const INSTALL_COMMANDS = {
  pip: "pip install mcp-hangar",
  uv: "uv pip install mcp-hangar",
  curl: "curl -sSL https://mcp-hangar.io/install.sh | bash",
} as const;

/**
 * What MCP Hangar is, said once. Every surface that describes the product --
 * the hero, <title> and meta, the OG card, the JSON-LD block, llms.txt, the
 * footer and the root package.json -- takes its words from here, because five
 * hand-written self-descriptions had drifted into five different products
 * (one Kubernetes-only, one a "control plane").
 *
 * Kubernetes is one deployment path (the operator), not the premise: core is
 * a Python package that runs over stdio on a laptop or over HTTP on a VM.
 *
 * Brand: "MCP Hangar" in prose and titles; `mcp-hangar` only for the package
 * and the command. The hero says "Hangar" because the h1 above it already
 * carries "MCP" and the nav carries the full name.
 */
const ROLE =
  "the runtime security and governance layer between your agents and your MCP servers: identity, policy, approvals and an audit record for every call.";
const RUNS_ON = "Runs on a laptop, a VM, or Kubernetes.";

export const BRAND = "MCP Hangar";

/** The h1, also the home OG card's title. */
export const HEADLINE = "Every MCP tool call ends in a verdict.";

/** The line under the h1. */
export const HERO_SUB = `Hangar is ${ROLE} ${RUNS_ON}`;

/** Meta, OG and machine-readable description. */
export const DESCRIPTION = `${BRAND} is ${ROLE} ${RUNS_ON}`;

/** The category in a few words: <title>, the OG eyebrow, the footer. */
export const CATEGORY = "Runtime security and governance for MCP";
