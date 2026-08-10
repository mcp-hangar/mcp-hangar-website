/**
 * Page path → OG card path.
 *
 * The mapping is deliberately explicit rather than a catch-all. An unmapped
 * page still gets a valid image — the site-wide fallback — but the build gate
 * in `integrations/og-gate.mjs` reads the emitted HTML and fails on it. Silent
 * fallback is how a redesign ends up with half its pages still shipping last
 * year's card.
 */

/** The pre-redesign site-wide asset in `public/`. Kept as a floor, never as a plan. */
export const OG_FALLBACK = "/og-image.png";

/** Sections whose pages each get their own card, generated from the collection. */
const SECTIONS = ["blog", "learn", "security", "docs"] as const;

/** Single-segment pages that have a card but are not a section. */
const STANDALONE = new Set(["/privacy", "/terms"]);

export function ogPathFor(pagePath: string): string {
    const p = pagePath.replace(/\/+$/, "") || "/";

    if (p === "/") return "/og/home.png";
    if (STANDALONE.has(p)) return `/og${p}.png`;

    for (const section of SECTIONS) {
        if (p === `/${section}`) return `/og/${section}.png`;
        if (p.startsWith(`/${section}/`)) return `/og${p}.png`;
    }

    return OG_FALLBACK;
}
