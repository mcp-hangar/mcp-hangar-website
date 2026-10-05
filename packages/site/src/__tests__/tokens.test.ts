import { describe, expect, it } from "vitest";
import fg from "fast-glob";
import fs from "fs";
import path from "path";
import { contrast, themes, tokensCss } from "./tokens-helpers";

/**
 * The colour system, held by tests rather than by review.
 *
 * tokens.css is the only place a colour is written down. The two dark blocks
 * in it are duplicated by necessity (a media query and an attribute selector
 * cannot share one), so they are checked to be identical; every text token is
 * checked against every surface in both themes, because axe only sees the
 * pages it is pointed at; and the rest of the source is checked for colours
 * that went around the tokens.
 */

const { light, darkMedia, darkAttr } = themes();

describe("the dark theme is one theme", () => {
  it("declares the same tokens under the media query and the toggle", () => {
    expect(darkAttr).toEqual(darkMedia);
  });

  it("redefines every colour token the light theme declares", () => {
    const themed = Object.keys(light).filter((k) => k.startsWith("--c-"));
    expect(Object.keys(darkAttr).sort()).toEqual(themed.sort());
  });
});

describe.each([
  ["light", light],
  ["dark", darkAttr],
])("%s theme contrast", (_name, theme) => {
  const t = (k: string) => theme[k] ?? light[k];
  const surfaces = ["--c-ground", "--c-panel", "--c-subtle"];
  const text = [
    "--c-ink",
    "--c-ink-2",
    "--c-ink-3",
    "--c-allow",
    "--c-deny",
    "--c-hold",
  ];

  it.each(text.flatMap((fgName) => surfaces.map((bg) => [fgName, bg])))(
    "%s on %s clears 4.5:1",
    (fgName, bg) => {
      expect(contrast(t(fgName), t(bg))).toBeGreaterThanOrEqual(4.5);
    }
  );

  it.each(["allow", "deny", "hold"])(
    "the %s word clears 4.5:1 on its own tint",
    (v) => {
      expect(
        contrast(t(`--c-${v}`), t(`--c-${v}-tint`))
      ).toBeGreaterThanOrEqual(4.5);
    }
  );

  it("the ground reads against the primary button's ink, both ways", () => {
    expect(contrast(t("--c-ground"), t("--c-ink"))).toBeGreaterThanOrEqual(7);
    expect(contrast(t("--c-ground"), t("--c-ink-2"))).toBeGreaterThanOrEqual(
      4.5
    );
  });
});

describe("no colour goes around the tokens", () => {
  const root = process.cwd();
  // og/ renders with satori, which has no custom properties: its hexes mirror
  // the tokens and are held to them by og.test.ts.
  const files = fg.sync(["src/**/*.{astro,ts,css,mjs}"], {
    cwd: root,
    ignore: ["src/styles/tokens.css", "src/og/**", "src/__tests__/**"],
  });

  /** Comments say "#1285" and "zinc-500 was 4.1:1"; code is what is checked. */
  const code = (src: string) =>
    src
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/(^|[^:"'`])\/\/.*$/gm, "$1")
      .replace(/&#\d+;/g, "");

  const palette =
    /(?<![\w-])(?:bg|text|border|divide|ring|from|via|to|fill|stroke|outline|decoration|shadow|placeholder|accent|caret)-(?:zinc|gray|slate|neutral|stone|red|rose|emerald|green|amber|yellow|orange|blue|sky|white|black)(?:-\d+)?\b/;
  const literal = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch)\(/;

  it("finds source to check", () => {
    expect(files.length).toBeGreaterThan(40);
  });

  it.each(files)("%s uses tokens only", (file) => {
    const lines = code(fs.readFileSync(path.join(root, file), "utf-8"))
      .split("\n")
      // A <meta name="theme-color"> cannot read a custom property.
      .filter((l) => !l.includes('name="theme-color"'));
    const offenders = lines.filter((l) => palette.test(l) || literal.test(l));
    expect(offenders).toEqual([]);
  });

  it("tokens.css is where the colours are", () => {
    expect(tokensCss).toMatch(/--c-ground:\s*#f7f8f5/);
  });
});
