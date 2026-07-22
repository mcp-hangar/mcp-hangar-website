import path from 'node:path';

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
 * sets per file. A set of valid ids (`validIds`) is used so links that cannot be
 * resolved to a real doc are left untouched rather than pointing at a wrong URL.
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
}

// Matches a leading URI scheme (http:, https:, mailto:, etc.).
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

function rewriteHref(href: string, currentDir: string, validIds?: Set<string>): string | null {
  if (!href) return null;
  // Skip absolute / protocol-relative / root-relative / pure-anchor links.
  if (HAS_SCHEME.test(href)) return null;
  if (href.startsWith('//')) return null;
  if (href.startsWith('/')) return null;
  if (href.startsWith('#')) return null;

  // Split off any #anchor (and ?query, defensively, kept with the anchor part).
  const hashIdx = href.indexOf('#');
  const anchor = hashIdx >= 0 ? href.slice(hashIdx) : '';
  const pathPart = hashIdx >= 0 ? href.slice(0, hashIdx) : href;

  // Only rewrite links that point at a markdown file.
  if (!/\.md$/i.test(pathPart)) return null;

  // Resolve the relative path against the current document's directory.
  // path.posix.join collapses `./`, `../` and same-dir forms.
  const withoutExt = pathPart.replace(/\.md$/i, '');
  const resolvedId = path.posix.join(currentDir, withoutExt);

  // Guard: never emit a path that escapes the docs root.
  if (resolvedId.startsWith('..')) return null;

  // If we have the id set and the target isn't a known doc, leave it unchanged.
  if (validIds && !validIds.has(resolvedId)) return null;

  return `/docs/${resolvedId}${anchor}`;
}

export default function rehypeDocLinks(options: RehypeDocLinksOptions = {}) {
  const { validIds } = options;

  return (tree: HastNode, file: { data?: Record<string, unknown> }) => {
    const currentId = file?.data?.docId;
    if (typeof currentId !== 'string' || !currentId) return; // can't resolve — leave everything

    const currentDir = path.posix.dirname(currentId); // '' -> '.', 'guides/X' -> 'guides'

    const visit = (node: HastNode) => {
      if (node.tagName === 'a' && node.properties) {
        const href = node.properties.href;
        if (typeof href === 'string') {
          const next = rewriteHref(href, currentDir, validIds);
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
