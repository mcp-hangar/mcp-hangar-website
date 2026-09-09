/**
 * Collect the headings a page's table of contents is built from.
 *
 * Astro populates `headings` for its own markdown collections, so blog, learn
 * and security pages get section anchors and a contents list for free. The docs
 * collection runs its own unified pipeline (`content/loaders/oss-docs.ts`),
 * which had neither: across 113 documentation pages not one heading carried an
 * `id`, so no section of the documentation could be linked to, and there was
 * nothing to build a rail from.
 *
 * Runs after `rehype-slug`, which assigns those ids using the same
 * `github-slugger` Astro uses -- so a docs anchor and a blog anchor for the
 * same wording are spelled identically.
 *
 * The tree walk is hand-rolled to match `rehype-doc-links` next door, and to
 * keep the loader's dependency list as short as it is.
 */
interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

export interface CollectedHeading {
  depth: number;
  slug: string;
  text: string;
}

const HEADING = /^h([1-6])$/;

function textOf(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

export default function rehypeCollectHeadings() {
  return (tree: HastNode, file: { data: Record<string, unknown> }) => {
    const headings: CollectedHeading[] = [];

    const visit = (node: HastNode) => {
      const depth = node.tagName && HEADING.exec(node.tagName)?.[1];
      const slug = node.properties?.id;
      if (depth && typeof slug === "string") {
        headings.push({
          depth: Number(depth),
          slug,
          text: textOf(node).trim(),
        });
      }
      if (node.children) for (const child of node.children) visit(child);
    };

    visit(tree);
    file.data.headings = headings;
  };
}
