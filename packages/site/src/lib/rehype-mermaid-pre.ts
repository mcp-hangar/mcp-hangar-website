/**
 * rehype plugin: turn a ```mermaid fence into `<pre class="mermaid">` for the
 * client-side renderer (see components/MermaidRuntime.astro).
 *
 * This replaces the `rehype-mermaid` package, which was a dependency of this
 * site from May 2026 but was never wired into either markdown pipeline — so
 * every ```mermaid fence shipped as a syntax-highlighted code block showing its
 * own source. It cannot be wired in either: `rehype-mermaid` imports
 * `mermaid-isomorphic`, which imports `playwright` at module load, so even its
 * browser-free `pre-mermaid` strategy fails to import unless a full Chromium is
 * installed in the build. That is a build-time dependency this site does not
 * want, and the plugin's only job under that strategy is the tree rewrite
 * below.
 *
 * Two shapes have to be handled, because the site has two markdown pipelines
 * and syntax highlighting runs at a different point in each:
 *
 *   1. Before highlighting — `<pre><code class="language-mermaid">source</code></pre>`.
 *      This is what the docs loader's unified pipeline produces, where this
 *      plugin is placed ahead of rehype-shiki.
 *   2. After highlighting — `<pre class="shiki" data-language="mermaid">` whose
 *      code element holds one `<span class="line">` per source line. Astro's
 *      built-in markdown pipeline highlights after user rehype plugins in some
 *      versions and before in others; handling both means the plugin is correct
 *      either way rather than correct until an Astro upgrade reorders it.
 *
 * In both cases the source text is recovered and re-emitted verbatim as the
 * single text child of a bare `<pre class="mermaid">`. Nothing is rendered here:
 * the diagram is drawn in the browser, and the raw fence remains the fallback
 * if that never happens.
 */

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

/** Class list of a hast node, whatever shape `className` came in as. */
function classes(node: HastNode): string[] {
  const raw = node.properties?.className;
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === 'string') return raw.split(/\s+/);
  return [];
}

function isMermaidCode(code: HastNode): boolean {
  return classes(code).includes('language-mermaid');
}

/** Concatenated text of a subtree. */
function textOf(node: HastNode): string {
  if (node.type === 'text') return node.value ?? '';
  return (node.children ?? []).map(textOf).join('');
}

/**
 * Source text of a code element.
 *
 * Shiki emits one `<span class="line">` per line. The newlines between them are
 * text nodes in its output, but relying on that would make the extraction
 * depend on an implementation detail of the highlighter: joining the line
 * elements explicitly gives the same string whether or not those separators are
 * there, and mermaid is newline-sensitive — a diagram flattened onto one line
 * is a parse error, not a squashed diagram.
 */
function sourceOf(code: HastNode): string {
  const lines = (code.children ?? []).filter(
    (child) => child.type === 'element' && classes(child).includes('line'),
  );
  if (lines.length > 0) return lines.map(textOf).join('\n');
  return textOf(code);
}

/** The mermaid `<code>` child of a `<pre>`, if this is a mermaid fence. */
function mermaidCodeChild(pre: HastNode): HastNode | null {
  const highlighted = pre.properties?.['dataLanguage'] === 'mermaid';
  for (const child of pre.children ?? []) {
    if (child.type !== 'element' || child.tagName !== 'code') continue;
    if (highlighted || isMermaidCode(child)) return child;
  }
  return null;
}

export default function rehypeMermaidPre() {
  return (tree: HastNode) => {
    const visit = (node: HastNode) => {
      for (const child of node.children ?? []) {
        if (child.type === 'element' && child.tagName === 'pre') {
          const code = mermaidCodeChild(child);
          if (code) {
            // Drop the highlighter's inline background/colour styling with it:
            // the element is about to hold an SVG, not text.
            child.properties = { className: ['mermaid'] };
            child.children = [{ type: 'text', value: sourceOf(code) }];
            continue; // nothing left inside worth walking
          }
        }
        visit(child);
      }
    };

    visit(tree);
  };
}
