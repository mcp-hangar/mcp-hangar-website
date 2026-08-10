import type { APIRoute, GetStaticPaths } from "astro";
import { ogCards, type CardProps } from "../../og/cards";
import { renderCard } from "../../og/render";
import { blogCard, docsCard, homeCard, learnCard, securityCard } from "../../og/templates";

export const prerender = true;

/** One OG card per page, rendered into `dist` at build time. */

export const getStaticPaths: GetStaticPaths = async () =>
    (await ogCards()).map(c => ({ params: { slug: c.slug }, props: c.props }));

export function cardTree(p: CardProps) {
    return p.kind === "home" ? homeCard()
        : p.kind === "blog" ? blogCard(p)
        : p.kind === "security" ? securityCard(p)
        : p.kind === "learn" ? learnCard(p)
        : docsCard(p);
}

export const GET: APIRoute = async ({ props }) => {
    // Deliberately unguarded: a card that cannot render fails the build.
    const png = await renderCard(cardTree(props as CardProps));

    // Copied into a plain ArrayBuffer: node's Buffer is not assignable to
    // BodyInit under this TS lib, and casting it away hides a real mismatch.
    return new Response(new Uint8Array(png).buffer, {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
};
