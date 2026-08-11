import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import mermaid from 'mermaid';

/**
 * Every diagram on the site, parsed by the same library that draws it.
 *
 * Diagrams are rendered in the browser (see components/MermaidRuntime.astro),
 * which means a syntax error in a fence is invisible at build time: the page
 * builds, deploys, and fails only in the reader's browser. That is exactly how
 * the previous failure mode survived — `rehype-mermaid` was a dependency for
 * three months without ever being wired into a pipeline, so both ```mermaid
 * fences on the site shipped as code blocks displaying their own source, and
 * nothing failed. These assertions close both holes: the fences must reach the
 * browser as diagram containers, and each one must parse.
 */

const DIST = path.join(process.cwd(), 'dist');

function* htmlFiles(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

interface Diagram {
  page: string;
  source: string;
}

const diagrams: Diagram[] = [];
/** Pages still shipping a mermaid fence as a highlighted code block. */
const unrendered: string[] = [];

beforeAll(() => {
  for (const file of htmlFiles(DIST)) {
    const html = fs.readFileSync(file, 'utf-8');
    if (!html.includes('mermaid')) continue;

    const page = path.relative(DIST, file);

    // A mermaid fence that reached the browser as a code block — the bug this
    // suite exists to catch. Shiki tags the language on the `pre`.
    if (html.includes('data-language="mermaid"')) unrendered.push(page);

    const doc = new DOMParser().parseFromString(html, 'text/html');
    for (const pre of doc.querySelectorAll('pre.mermaid')) {
      diagrams.push({ page, source: pre.textContent ?? '' });
    }
  }

  mermaid.initialize({ startOnLoad: false, theme: 'base', securityLevel: 'strict' });
});

describe('Mermaid diagrams', () => {
  it('reach the browser as diagram containers, never as code blocks', () => {
    expect(unrendered).toEqual([]);
  });

  it('are present on the pages that author them', () => {
    // A floor, not an inventory: the point is that the pipeline is wired at
    // all, so this fails loudly if a plugin gets dropped from either markdown
    // pipeline rather than tracking every page that gains a diagram.
    //
    // Deliberately below the number of diagrams the docs repo actually has.
    // Docs are a pinned git dependency, so how many arrive depends on which
    // commit `@mcp-hangar/docs` currently resolves to; a floor tied to that
    // count would turn an unrefreshed pin into a red test on this repo.
    const pages = new Set(diagrams.map((d) => d.page));
    expect(pages.size).toBeGreaterThanOrEqual(5);

    // Both pipelines: the docs collection has its own, separate from Astro's.
    expect([...pages].some((p) => p.startsWith('docs/'))).toBe(true);
    expect([...pages].some((p) => p.startsWith('blog/'))).toBe(true);
  });

  it('every diagram parses', async () => {
    const failures: string[] = [];

    for (const { page, source } of diagrams) {
      expect(source.trim().length).toBeGreaterThan(0);
      try {
        await mermaid.parse(source);
      } catch (err) {
        failures.push(`${page}: ${(err as Error).message}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
