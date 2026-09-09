import { describe, expect, it } from "vitest";
import { codeTheme } from "../lib/code-theme";

/**
 * `global.css` states the rule: colour is semantics, two hues carry meaning
 * because a verdict is binary, and nothing that is not a verdict gets a hue.
 * Code blocks are the most common visual element on this site, so they are
 * where that rule is most expensive to break -- and they broke it for as long
 * as they rendered in a borrowed editor theme.
 *
 * This asserts the rule rather than the values. A new scope can be added, a
 * shade can be re-picked, but nothing in the theme may carry a hue.
 */

const channels = (hex: string) => {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`not a 6-digit hex colour: ${hex}`);
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** sRGB relative luminance, for the contrast floor below. */
const luminance = (hex: string) => {
  const [r, g, b] = channels(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const background = codeTheme.colors!["editor.background"]!;

const foregrounds = [
  codeTheme.colors!["editor.foreground"]!,
  ...(codeTheme.settings ?? [])
    .map((rule) => rule.settings?.foreground)
    .filter((c): c is string => typeof c === "string"),
];

describe("the code theme carries no hue", () => {
  it("has foreground colours to check", () => {
    expect(foregrounds.length).toBeGreaterThan(5);
  });

  it.each([...new Set(foregrounds), background])("%s is achromatic", (hex) => {
    const [r, g, b] = channels(hex);
    // Tailwind's zinc is very slightly cool rather than a pure grey, so this
    // is a hue test, not an r === g === b test.
    expect(Math.max(r, g, b) - Math.min(r, g, b)).toBeLessThanOrEqual(10);
  });
});

describe("the code theme stays readable", () => {
  it.each([...new Set(foregrounds)])(
    "%s clears 4.5:1 on the background",
    (hex) => {
      expect(contrast(hex, background)).toBeGreaterThanOrEqual(4.5);
    }
  );
});
