/**
 * rehype plugin: put every table in its own horizontal scroll container.
 *
 * A markdown table is as wide as its widest row, and nothing in either
 * markdown pipeline wrapped one -- so on a 390px phone 85 of 161 pages laid out
 * wider than the screen and the browser zoomed the whole page out to fit
 * (`/docs/upgrade` at 682px, `/docs/guides/KUBERNETES` at 726px). Wrapped, the
 * table scrolls inside the column and the page does not.
 *
 * The wrapper is a scroll region, so it is focusable and named: a keyboard
 * user has to be able to reach it to scroll it (axe
 * `scrollable-region-focusable`), and a screen reader announces it by name. The
 * name is the table's caption if it has one, else its column headings.
 *
 * Used by both pipelines: the docs loader (content/loaders/oss-docs.ts) and
 * Astro's MDX pipeline for Blog, Learn and Security (astro.config.mjs).
 */

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

const MAX_NAME = 80;

function text(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(text).join("");
}

function find(node: HastNode, tag: string): HastNode | undefined {
  for (const child of node.children ?? []) {
    if (child.type !== "element") continue;
    if (child.tagName === tag) return child;
    const hit = find(child, tag);
    if (hit) return hit;
  }
  return undefined;
}

export function tableName(table: HastNode): string {
  const caption = find(table, "caption");
  if (caption) {
    const name = text(caption).trim();
    if (name) return name;
  }
  const headRow = find(table, "tr");
  const headings = (headRow?.children ?? [])
    .filter((c) => c.type === "element")
    .map((c) => text(c).replace(/\s+/g, " ").trim())
    .filter(Boolean);
  if (headings.length === 0) return "Table";
  const name = `Table: ${headings.join(", ")}`;
  return name.length > MAX_NAME ? `${name.slice(0, MAX_NAME - 1)}…` : name;
}

function isWrap(node: HastNode): boolean {
  const cls = node.properties?.className;
  return Array.isArray(cls) && cls.includes("table-wrap");
}

function visit(node: HastNode): void {
  const children = node.children;
  if (!children) return;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type !== "element") continue;
    if (child.tagName === "table" && !isWrap(node)) {
      children[i] = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["table-wrap"],
          tabIndex: 0,
          role: "region",
          ariaLabel: tableName(child),
        },
        children: [child],
      };
      continue; // a table inside a table cell is not worth a second wrapper
    }
    visit(child);
  }
}

export default function rehypeTableWrap() {
  return (tree: HastNode) => visit(tree);
}
