import { describe, expect, it } from "vitest";
import fg from "fast-glob";
import fs from "fs";
import path from "path";

/**
 * One type system: three families, a fixed set of heading steps, and no
 * one-off sizes. Each was true of the old site's intent and false of its
 * source -- five heading treatments for one level, and pixel sizes typed into
 * class names -- so the rules are checked rather than remembered.
 */

const root = process.cwd();
const read = (f: string) => fs.readFileSync(path.join(root, f), "utf-8");
const css = read("src/styles/global.css");
const astro = fg.sync(["src/**/*.astro"], { cwd: root });

describe("fonts", () => {
  it("self-hosts the three families and nothing else", () => {
    const imports = [...css.matchAll(/@import "@fontsource[^"]*"/g)].map(
      (m) => m[0]
    );
    expect(imports.length).toBeGreaterThan(0);
    for (const i of imports) {
      expect(i).toMatch(
        /@fontsource\/(schibsted-grotesk|ibm-plex-sans|ibm-plex-mono)\/latin-\d00(-italic)?\.css/
      );
    }
  });

  it("names them in the theme", () => {
    expect(css).toMatch(/--font-display: 'Schibsted Grotesk'/);
    expect(css).toMatch(/--font-sans: 'IBM Plex Sans'/);
    expect(css).toMatch(/--font-mono: 'IBM Plex Mono'/);
  });

  it("loads nothing from a font CDN", () => {
    for (const f of astro)
      expect(read(f)).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
  });
});

describe("the type scale", () => {
  it.each(astro)("%s types no one-off size", (f) => {
    expect(read(f)).not.toMatch(/\btext-\[\d+(\.\d+)?(px|rem|em)\]/);
  });

  it.each(astro)("%s sets every classed h1 on the scale", (f) => {
    for (const m of read(f).matchAll(/<h1\s+class="([^"]*)"/g)) {
      expect(m[1]).toMatch(/\btext-(display|h1)\b/);
    }
  });
});
