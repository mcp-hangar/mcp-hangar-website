/**
 * Strip inline SVG (and any stray SVG child elements that leak out of a block)
 * from a rendered doc/learn/blog body before inlining it into machine-readable
 * output (llms-full.txt and the raw .md endpoints).
 *
 * Machines get prose, not diagrams — no SVG in machine output.
 */
export function stripSvg(input: string): string {
  if (!input) return input;
  let out = input
    // Whole <svg>...</svg> blocks (case-insensitive, across newlines).
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    // Stray self-closing or paired SVG child elements that may leak.
    .replace(/<(path|rect|circle|line|polyline|polygon|g|defs|marker|text|tspan)\b[\s\S]*?\/>/gi, '')
    .replace(/<(text|tspan|g|defs|marker)\b[\s\S]*?<\/\1>/gi, '');
  // Collapse the runs of blank lines a removed block leaves behind.
  out = out.replace(/\n{3,}/g, '\n\n');
  return out.trim();
}
