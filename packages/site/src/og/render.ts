import satori, { type SatoriOptions } from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import path from "node:path";
import { CARD } from "./tokens";

/**
 * Satori + resvg, at build time.
 *
 * No browser and no network: the fonts are vendored next to this file because
 * satori reads TTF/OTF/WOFF and the site's webfonts are woff2, which it cannot
 * parse. Same frontmatter in, same pixels out — which is the point.
 */

const FONT_DIR = path.resolve("src/og/fonts");

const read = (file: string) => fs.readFileSync(path.join(FONT_DIR, file));

let fonts: SatoriOptions["fonts"] | null = null;

/** Loaded once per build, not once per card. */
function loadFonts(): SatoriOptions["fonts"] {
    if (fonts) return fonts;
    fonts = [
        { name: "Space Grotesk", data: read("SpaceGrotesk_500Medium.ttf"), weight: 500, style: "normal" },
        { name: "Space Grotesk", data: read("SpaceGrotesk_700Bold.ttf"), weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: read("JetBrainsMono_400Regular.ttf"), weight: 400, style: "normal" },
        { name: "JetBrains Mono", data: read("JetBrainsMono_600SemiBold.ttf"), weight: 600, style: "normal" },
    ];
    return fonts;
}

/** Minimal element factory — satori takes React-shaped nodes, and this avoids a JSX runtime. */
export function h(type: string, style: Record<string, unknown>, ...children: unknown[]): unknown {
    return { type, props: { style, children: children.length === 1 ? children[0] : children } };
}

/**
 * Render a satori tree to PNG bytes.
 *
 * Errors are deliberately not caught: a card that fails to render must fail the
 * build. A silently-broken OG image is worse than a missing one, because
 * nothing downstream will ever notice it.
 */
export async function renderCard(tree: unknown): Promise<Buffer> {
    const svg = await satori(tree as Parameters<typeof satori>[0], {
        width: CARD.width,
        height: CARD.height,
        fonts: loadFonts(),
    });
    return new Resvg(svg, {
        fitTo: { mode: "width", value: CARD.width * CARD.scale },
    })
        .render()
        .asPng();
}

/**
 * Title sizing, because satori neither shrinks text to fit nor honours
 * `-webkit-line-clamp` — an earlier version of this file set the clamp and it
 * silently did nothing; a 214-character title rendered six lines and would have
 * run off the card. So the bound is applied to the string, not to the CSS.
 *
 * Each tier's `max` is the longest title that still fits its own line budget at
 * that size (two lines at 72px, three below), measured against the widest real
 * titles in docs. Anything past the last tier is truncated at a word boundary.
 */
const TIERS = [
    { max: 44, fontSize: 72, lineHeight: 1.1 },
    { max: 82, fontSize: 58, lineHeight: 1.15 },
    { max: 105, fontSize: 46, lineHeight: 1.15 },
] as const;

/** Cut to `max`, preferring a word boundary, and mark the cut. */
function truncate(s: string, max: number): string {
    const cut = s.slice(0, max - 1);
    const space = cut.lastIndexOf(" ");
    const kept = space > max * 0.6 ? cut.slice(0, space) : cut;
    return kept.replace(/[\s,.;:—-]+$/, "") + "…";
}

export function fitTitle(title: string) {
    const text = title.trim();
    for (const tier of TIERS) {
        if (text.length <= tier.max) return { ...tier, text, truncated: false };
    }
    const last = TIERS[TIERS.length - 1];
    return { ...last, text: truncate(text, last.max), truncated: true };
}
