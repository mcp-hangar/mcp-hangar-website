/**
 * The card palette, for satori.
 *
 * Satori has no CSS custom properties, so these hexes cannot come from
 * styles/tokens.css at render time -- but they must not drift from it either.
 * og.test.ts parses tokens.css and asserts every value here still matches its
 * token (the light theme: a card is shared into feeds of either colour, and
 * the paper card is the site's default), so a palette change fails the build
 * rather than quietly producing cards in last month's colours.
 *
 * Templates import from here. A hex typed into a template is a bug, and
 * tokens.test.ts fails on one.
 */

/** Mirrors `--c-*` in tokens.css's light block. Keys are the token names, minus the prefix. */
export const INK = {
  ground: "#f7f8f5",
  panel: "#ffffff",
  subtle: "#eef0eb",
  ink: "#12161b",
  "ink-2": "#3f4750",
  "ink-3": "#58606a",
  rule: "#d5d9d2",
} as const;

/** The three verdicts and their tints, as `--c-allow`, `--c-allow-tint`, ... */
export const VERDICT = {
  allow: "#0d6b46",
  "allow-tint": "#e1f1e8",
  deny: "#a61f26",
  "deny-tint": "#f7e0e0",
  hold: "#875600",
  "hold-tint": "#f5ead2",
} as const;

/** The brand's own hexes (`--brand-*`): the mark, never text. */
export const BRAND = {
  allow: "#10b981",
  deny: "#ef4444",
  amber: "#f59e0b",
} as const;

/** 1200x630 logical; the endpoint renders it at 2x. */
export const CARD = { width: 1200, height: 630, scale: 2 } as const;

export const FONT = {
  display: "Schibsted Grotesk",
  sans: "IBM Plex Sans",
  mono: "IBM Plex Mono",
} as const;
