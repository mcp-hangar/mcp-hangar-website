import path from "node:path";
import { offSiteTarget } from "./docs-publication";

/**
 * rehype plugin: rewrite relative `.md` links in docs content into site routes.
 *
 * Docs source (the `oss` collection) uses relative markdown links between files,
 * e.g. `[Egress Policy](EGRESS_POLICY.md)`, `[ADR-014](../adr/ADR-014-....md)`,
 * `[x](FOO.md#anchor)`. Rendered as-is these produce literal `.md` hrefs that are
 * broken on the site. This plugin resolves each such link against the CURRENT
 * document's id (route slug) and rewrites it to `/docs/<resolved-id><#anchor>`.
 *
 * The current document id is read from `file.data.docId`, which the docs loader
 * sets per file. A resolved target is one of three things:
 *
 * - a published page (`validIds`): rewritten to `/docs/<id>`;
 * - a file the docs repo has but the site does not publish (`repoIds` minus
 *   `validIds`: contributor pages, READMEs): rewritten to where it lives --
 *   the file on GitHub, or the site's own index for the ADR and root READMEs
 *   (see lib/docs-publication);
 * - anything else: the build FAILS. A relative `.md` link that names no file
 *   in the docs repo is broken, and passing it through used to ship it as a
 *   404 (`/docs/adr/README.md`, found by the 2026-10 link audit).
 *
 * `repoIds` is the loader's own file list, compared as exact strings: the
 * check must agree on a case-sensitive CI filesystem and a case-insensitive
 * laptop, so it never asks the filesystem.
 *
 * Without `validIds` (unit tests of the plain rewrite) every resolved link is
 * rewritten and nothing is checked.
 *
 * Only relative links ending in `.md` (optionally with a `#anchor`) are touched.
 * Absolute links (`http:`, `https:`, `mailto:`, protocol-relative `//`,
 * root-relative `/...`) and pure `#anchor` links are left unchanged.
 */

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

export interface RehypeDocLinksOptions {
  /** Set of valid doc ids (route slugs, e.g. `guides/EGRESS_POLICY`). */
  validIds?: Set<string>;
  /** Every markdown file in the docs repo, by id, published or not. Defaults
   *  to `validIds`, so an unpublished target is then an unknown one. */
  repoIds?: Set<string>;
}

export class UnknownDocLinkError extends Error {}

// Matches a leading URI scheme (http:, https:, mailto:, etc.).
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

function rewriteHref(
  href: string,
  currentId: string,
  validIds?: Set<string>,
  repoIds?: Set<string>
): string | null {
  if (!href) return null;
  // Skip absolute / protocol-relative / root-relative / pure-anchor links.
  if (HAS_SCHEME.test(href)) return null;
  if (href.startsWith("//")) return null;
  if (href.startsWith("/")) return null;
  if (href.startsWith("#")) return null;

  // Split off any #anchor (and ?query, defensively, kept with the anchor part).
  const hashIdx = href.indexOf("#");
  const anchor = hashIdx >= 0 ? href.slice(hashIdx) : "";
  const pathPart = hashIdx >= 0 ? href.slice(0, hashIdx) : href;

  // Only rewrite links that point at a markdown file.
  if (!/\.md$/i.test(pathPart)) return null;

  // Resolve the relative path against the current document's directory.
  // path.posix.join collapses `./`, `../` and same-dir forms.
  const currentDir = path.posix.dirname(currentId); // 'x' -> '.', 'guides/X' -> 'guides'
  const withoutExt = pathPart.replace(/\.md$/i, "");
  const resolvedId = path.posix.join(currentDir, withoutExt);

  if (!validIds) {
    // Plain rewrite, no checking: never emit a path that escapes the root.
    return resolvedId.startsWith("..") ? null : `/docs/${resolvedId}${anchor}`;
  }
  if (validIds.has(resolvedId)) return `/docs/${resolvedId}${anchor}`;
  if ((repoIds ?? validIds).has(resolvedId)) {
    return offSiteTarget(resolvedId, anchor);
  }
  throw new UnknownDocLinkError(
    `Docs page "${currentId}" links to "${href}", which resolves to ` +
      `"${resolvedId}.md" -- no such file in the docs repository. ` +
      `Fix the link in mcp-hangar/docs.`
  );
}

export default function rehypeDocLinks(options: RehypeDocLinksOptions = {}) {
  const { validIds, repoIds } = options;

  return (tree: HastNode, file: { data?: Record<string, unknown> }) => {
    const currentId = file?.data?.docId;
    if (typeof currentId !== "string" || !currentId) return; // can't resolve — leave everything

    const visit = (node: HastNode) => {
      if (node.tagName === "a" && node.properties) {
        const href = node.properties.href;
        if (typeof href === "string") {
          const next = rewriteHref(href, currentId, validIds, repoIds);
          if (next !== null) {
            node.properties.href = next;
          }
        }
      }
      if (node.children) {
        for (const child of node.children) visit(child);
      }
    };

    visit(tree);
  };
}
