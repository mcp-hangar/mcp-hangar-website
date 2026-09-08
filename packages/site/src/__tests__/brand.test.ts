import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

/**
 * The site against the brand, offline.
 *
 * `scripts/brand-sync.mjs` vendors two files from `mcp-hangar/brand` at the
 * commit in `brand.lock.json`: the gate's geometry and the favicon. This suite
 * is what makes that pin load-bearing — without it the vendored copies are
 * decoration, and the site drifts from them exactly the way it did before.
 *
 * It had drifted a long way. The nav and footer mark was redrawn by hand on a
 * 24-unit grid with a full crossbar, and a full crossbar is closed doors,
 * which in this brand means *deny* — so the product's own wordmark carried a
 * refusal. The favicon was a second hand-drawn copy with the same closed
 * crossbar in green, which BRAND.md lists as a Don't in as many words. Both
 * were reasonable-looking approximations. That is the problem with an
 * approximation of a mark whose geometry carries meaning.
 */

const read = (...segments: string[]) =>
  fs.readFileSync(path.join(process.cwd(), ...segments), "utf-8");

const lock = JSON.parse(read("brand.lock.json"));
const geometry = read(lock.vendorDir, "generators/hangar_brand/geometry.py");
const gate = read("src/components/icons/Gate.astro");
const css = read("src/styles/global.css");

/** A `NAME = "value"` constant out of the brand's geometry module. */
const brandConst = (name: string) =>
  geometry.match(new RegExp(`^${name} = "([^"]+)"`, "m"))?.[1];

const token = (name: string) =>
  css.match(new RegExp(`--color-${name}:\\s*([^;]+);`))?.[1].trim();

describe("the gate's geometry comes from the brand", () => {
  const parts = [
    "ARCH",
    "PILLARS",
    "BASE",
    "DOORS_OPEN",
    "DOORS_CLOSED",
    "DOORS_16",
  ];

  it.each(parts)("%s is drawn verbatim", (name) => {
    const d = brandConst(name);
    expect(d, `${name} is missing from the vendored geometry.py`).toBeDefined();
    expect(gate).toContain(d!);
  });

  // The check above passes for a file that also carries a seventh path someone
  // eyeballed. This one does not: every path in the component has to be one the
  // brand drew.
  it("draws nothing the brand did not", () => {
    const drawn = [...gate.matchAll(/(["'])(M[\d][^"']*)\1/g)].map((m) => m[2]);
    const allowed = new Set(parts.map(brandConst));

    expect(drawn.length).toBeGreaterThan(0);
    for (const d of drawn) expect(allowed).toContain(d);
  });
});

describe("the verdict palette comes from the brand", () => {
  // Green and red are not theme choices here — they are the two states a
  // policy can produce, and the brand's generated assets close their gates in
  // exactly these hexes. A second red on the site meant a page and a status
  // wall sitting side by side disagreed about what a refusal looks like.
  const pairs: [string, string][] = [
    ["verdict-allow", "BRAND"],
    ["verdict-deny", "DENY"],
    ["state-optin", "AMBER"],
  ];

  it.each(pairs)("--color-%s is the brand's %s", (name, constant) => {
    expect(token(name)).toBe(brandConst(constant));
  });
});

describe("served brand assets", () => {
  it.each(Object.entries(lock.serves as Record<string, string>))(
    "%s is served byte-for-byte",
    (source, served) => {
      expect(read(served as string)).toBe(read(lock.vendorDir, source));
    }
  );
});
