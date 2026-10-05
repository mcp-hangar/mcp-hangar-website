import { describe, expect, it } from "vitest";
import { codeTheme } from "../lib/code-theme";
import { contrast, rgb, themes } from "./tokens-helpers";

/**
 * `styles/tokens.css` states the rule: colour is semantics, three hues carry
 * meaning because a call ends in one of three verdicts, and nothing that is
 * not a verdict gets a hue. Code blocks are the most common visual element on
 * this site, so they are where that rule is most expensive to break -- and
 * they broke it for as long as they rendered in a borrowed editor theme.
 *
 * The theme names custom properties rather than hexes, so this resolves each
 * one in both themes and asserts the rule there. A new scope can be added, a
 * shade can be re-picked, but nothing may carry a hue or drop under 4.5:1.
 */

const { light, darkAttr } = themes();

const resolve = (theme: Record<string, string>, value: string) => {
  const m = /^var\((--[\w-]+)\)$/.exec(value);
  if (!m) throw new Error(`the code theme should name a token: ${value}`);
  const hex = theme[m[1]];
  if (!hex) throw new Error(`${m[1]} is not declared in tokens.css`);
  return hex;
};

const background = codeTheme.colors!["editor.background"]!;

const foregrounds = [
  ...new Set([
    codeTheme.colors!["editor.foreground"]!,
    ...(codeTheme.settings ?? [])
      .map((rule) => rule.settings?.foreground)
      .filter((c): c is string => typeof c === "string"),
  ]),
];

describe("the code theme", () => {
  it("has foreground colours to check", () => {
    expect(foregrounds.length).toBeGreaterThanOrEqual(4);
  });

  describe.each([
    ["light", light],
    ["dark", darkAttr],
  ])("in the %s theme", (_name, theme) => {
    it.each([...foregrounds, background])("%s is achromatic", (value) => {
      const [r, g, b] = rgb(resolve(theme, value));
      // The ink ramp is a slightly cool grey rather than a pure one, so this
      // is a hue test, not an r === g === b test: a real hue spreads the
      // channels by 40 or more.
      expect(Math.max(r, g, b) - Math.min(r, g, b)).toBeLessThanOrEqual(20);
    });

    it.each(foregrounds)("%s clears 4.5:1 on the background", (value) => {
      expect(
        contrast(resolve(theme, value), resolve(theme, background))
      ).toBeGreaterThanOrEqual(4.5);
    });
  });
});
