import fs from "fs";
import path from "path";

/** Reads styles/tokens.css: the light block, and the two dark blocks. */
export const tokensCss = fs.readFileSync(
  path.join(process.cwd(), "src/styles/tokens.css"),
  "utf-8"
);

type Theme = Record<string, string>;

const declarations = (block: string): Theme =>
  Object.fromEntries(
    [...block.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [
      m[1],
      m[2].trim(),
    ])
  );

/** The body of the first `{ ... }` after *marker*, without nested braces. */
const blockAfter = (marker: string) => {
  const at = tokensCss.indexOf(marker);
  if (at < 0) throw new Error(`tokens.css has no ${marker}`);
  const open = tokensCss.indexOf("{", at);
  const close = tokensCss.indexOf("}", open);
  return tokensCss.slice(open + 1, close);
};

export const themes = () => ({
  light: declarations(blockAfter(":root {")),
  darkMedia: declarations(blockAfter(':root:not([data-theme="light"])')),
  darkAttr: declarations(blockAfter(':root[data-theme="dark"]')),
});

const channels = (hex: string) => {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`not a 6-digit hex colour: ${hex}`);
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const rgb = channels;

/** sRGB relative luminance. */
const luminance = (hex: string) => {
  const [r, g, b] = channels(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG contrast ratio between two hexes. */
export const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
