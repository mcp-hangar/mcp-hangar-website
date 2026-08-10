/**
 * The verdict palette, for satori.
 *
 * Satori has no CSS custom properties, so these hexes cannot come from
 * `@theme` in global.css at render time — but they must not drift from it
 * either. `og-tokens.test.ts` parses global.css and asserts every value here
 * still matches its token, so a palette change fails the build rather than
 * quietly producing cards in last month's colours.
 *
 * Templates import from here. A hex typed into a template is a bug.
 */

/** Mirrors `--color-*` in `@theme`. Keys are the token names, minus the prefix. */
export const VERDICT = {
    allow: "#10b981",
    allowSoft: "#6ee7b7",
    deny: "#f43f5e",
    denySoft: "#fda4af",
    optin: "#f59e0b",
    optinSoft: "#fcd34d",
} as const;

/** The zinc base. Not in `@theme` — Tailwind ships it — so these are Tailwind's own values. */
export const ZINC = {
    950: "#09090b",
    900: "#18181b",
    800: "#27272a",
    700: "#3f3f46",
    600: "#52525b",
    500: "#71717a",
    400: "#a1a1aa",
    300: "#d4d4d8",
    100: "#f4f4f5",
    50: "#fafafa",
} as const;

/** 1200×630 logical; the endpoint renders it at 2× to match the existing asset. */
export const CARD = { width: 1200, height: 630, scale: 2 } as const;

export const FONT = { sans: "Space Grotesk", mono: "JetBrains Mono" } as const;
