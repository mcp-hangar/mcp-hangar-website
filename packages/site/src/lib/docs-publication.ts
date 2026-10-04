/**
 * Which files of `mcp-hangar/docs` the site publishes, and where the rest go.
 *
 * The docs repository holds two audiences: people running MCP Hangar, and
 * people working on it. Until the redesign every file in it became a page
 * here, so an evaluator reading the product docs met the branch-protection
 * settings, the epic playbook and a manual test plan beside the quick start.
 * Contributor and process pages now stay on GitHub only:
 *
 * - `development/*`, by prefix, so a new process page cannot leak back in;
 * - `runbooks/RELEASE` (how the project cuts a release, not how you run it);
 * - `testing/approval-gate-manual-testing` (a maintainer's test plan);
 * - the root `CONTRIBUTING` (a docs-repo style note; the site's one
 *   "Contributing" link points at core's CONTRIBUTING.md instead).
 *
 * Nothing here is deleted from the docs repo. The loader skips these ids, the
 * doc-links step rewrites links to them into GitHub URLs, and vercel.json
 * redirects their old /docs URLs (and `.md` twins) to the same GitHub files --
 * a test checks that every id below has both redirects.
 */

export const DOCS_REPO_BLOB = "https://github.com/mcp-hangar/docs/blob/main";

/** Directory prefixes whose pages stay on GitHub. */
export const UNPUBLISHED_PREFIXES = ["development"] as const;

/** Single pages that stay on GitHub. */
export const UNPUBLISHED_IDS = [
  "CONTRIBUTING",
  "runbooks/RELEASE",
  "testing/approval-gate-manual-testing",
] as const;

/** Files the loader never renders as pages, whatever their content. */
function isRepoScaffolding(id: string): boolean {
  return id === "index" || id === "README" || id.endsWith("/README");
}

export function isUnpublished(id: string): boolean {
  return (
    (UNPUBLISHED_IDS as readonly string[]).includes(id) ||
    UNPUBLISHED_PREFIXES.some((p) => id === p || id.startsWith(`${p}/`))
  );
}

/** True when a docs-repo markdown file (by id, no `.md`) becomes a page. */
export function isPublished(id: string): boolean {
  return !isRepoScaffolding(id) && !isUnpublished(id);
}

/** The GitHub URL of a docs-repo markdown file, by id. */
export function githubUrlFor(id: string, anchor = ""): string {
  return `${DOCS_REPO_BLOB}/${id}.md${anchor}`;
}

/**
 * Where a link to a docs-repo file that is not a page should go. The ADR
 * README is the ADR index, which the site renders itself as Decisions; the
 * repo's root index is the docs landing page. Everything else is the file on
 * GitHub.
 */
export function offSiteTarget(id: string, anchor = ""): string {
  if (id === "adr/README") return `/docs/adr${anchor}`;
  if (id === "index" || id === "README") return `/docs${anchor}`;
  return githubUrlFor(id, anchor);
}
