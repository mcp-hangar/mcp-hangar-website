/**
 * rehype plugin: make every code block keyboard-scrollable.
 *
 * A `<pre>` scrolls sideways (`overflow: auto` in the prose styles), and a
 * scroll container a keyboard cannot reach is a WCAG failure (axe
 * `scrollable-region-focusable`). Shiki already puts `tabindex="0"` on what it
 * highlights; a fence with no language -- log output, a plain-text sample --
 * never reaches Shiki and shipped without one. This fills the gap after
 * highlighting, so it only touches blocks that are still missing it.
 *
 * Mermaid sources are left alone: the browser replaces them with a diagram.
 */

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

function isMermaid(node: HastNode): boolean {
  const cls = node.properties?.className;
  return Array.isArray(cls) && cls.includes("mermaid");
}

function visit(node: HastNode): void {
  if (node.type === "element" && node.tagName === "pre" && !isMermaid(node)) {
    node.properties ??= {};
    if (node.properties.tabIndex === undefined) node.properties.tabIndex = 0;
  }
  for (const child of node.children ?? []) visit(child);
}

export default function rehypeFocusablePre() {
  return (tree: HastNode) => visit(tree);
}
