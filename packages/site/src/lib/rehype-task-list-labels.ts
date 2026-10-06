/**
 * rehype plugin: give every GFM task-list checkbox an accessible name.
 *
 * `- [ ] item` renders as `<li class="task-list-item"><input type="checkbox"
 * disabled> item</li>`. The text beside the input is not its label, so a screen
 * reader announces "checkbox, not checked" and nothing else, and axe reports
 * every one (`label`, critical: 105 nodes on 7 docs pages, mostly the
 * production checklist and the runbooks -- #304).
 *
 * The input stays: it is what announces the checked state. It is named with the
 * item's own text -- the list item minus any nested list, which belongs to the
 * child items -- with whitespace collapsed. An input that already has a name
 * (`aria-label`, `aria-labelledby`, `title`) is left alone.
 *
 * In the docs pipeline it runs after `rehype-raw`, so a task list written as raw
 * HTML in the docs repo is covered too.
 */

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

function classes(node: HastNode): string[] {
  const raw = node.properties?.className;
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") return raw.split(/\s+/);
  return [];
}

function isCheckbox(node: HastNode): boolean {
  return (
    node.type === "element" &&
    node.tagName === "input" &&
    node.properties?.type === "checkbox"
  );
}

function hasName(input: HastNode): boolean {
  const p = input.properties ?? {};
  return [p.ariaLabel, p.ariaLabelledBy, p.title].some(
    (v) => v !== undefined && String(v).trim() !== ""
  );
}

/** Text of a node, skipping nested lists (they are other items). */
function ownText(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  if (
    node.type === "element" &&
    (node.tagName === "ul" || node.tagName === "ol")
  )
    return "";
  return (node.children ?? []).map(ownText).join("");
}

/**
 * The item's checkbox: a direct child (tight list) or the first element of
 * the item's first paragraph (loose list).
 */
function checkboxOf(item: HastNode): HastNode | undefined {
  for (const child of item.children ?? []) {
    if (isCheckbox(child)) return child;
    if (child.type === "element" && child.tagName === "p") {
      return (child.children ?? []).find(isCheckbox);
    }
    if (child.type === "element") return undefined;
  }
  return undefined;
}

function visit(node: HastNode): void {
  if (
    node.type === "element" &&
    node.tagName === "li" &&
    classes(node).includes("task-list-item")
  ) {
    const input = checkboxOf(node);
    if (input && !hasName(input)) {
      const label = ownText(node).replace(/\s+/g, " ").trim();
      if (label) {
        input.properties ??= {};
        input.properties.ariaLabel = label;
      }
    }
  }
  for (const child of node.children ?? []) visit(child);
}

export default function rehypeTaskListLabels() {
  return (tree: HastNode) => visit(tree);
}
