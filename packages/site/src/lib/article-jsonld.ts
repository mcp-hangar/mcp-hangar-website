/**
 * Per-article structured data for `/blog/*`.
 *
 * The site-wide `SoftwareApplication` block in `Base.astro` describes the
 * product, and it stays exactly as it is: several independent JSON-LD objects
 * on one page is correct, so an article is emitted as its own top-level
 * `BlogPosting` rather than nested inside the product.
 *
 * Every value comes from collection frontmatter. Nothing here hardcodes a
 * title, a date, or an author — the only literals are the vocabulary itself
 * and the publisher's name, which has to agree with the site-wide block.
 *
 * The image is resolved through `ogPathFor`, the same function the `<head>`
 * uses for `og:image`. Building `/og/blog/<slug>.png` a second time by hand
 * would work right up until the OG mapping changes under it.
 */
import { ogPathFor } from "../og/resolve";

export interface ArticleInput {
    /** Collection id, which is also the last URL segment. */
    slug: string;
    title: string;
    description: string;
    /** Publication date from frontmatter. */
    date: Date;
    /** Revision date, when the post carries one. */
    updated?: Date;
    /** Byline from frontmatter. */
    author: string;
    /** Absolute site origin, e.g. `https://mcp-hangar.io`. */
    siteUrl: string;
}

/**
 * Bylines that name a group rather than a human.
 *
 * schema.org lets `author` be a Person or an Organization, and the difference
 * is not decorative: typing "MCP Hangar Team" as a Person would publish a
 * claim that a person by that name exists. An unrecognised byline is treated
 * as a Person, which is the right default for a name.
 */
const ORGANISATION_BYLINES = new Set(["MCP Hangar Team"]);

/** Must match the Organization in the site-wide block, or the two disagree. */
const PUBLISHER_NAME = "MCP Hangar";

export function blogPostingSchema(input: ArticleInput): Record<string, unknown> {
    const { slug, title, description, date, updated, author, siteUrl } = input;
    const path = `/blog/${slug}`;
    const url = `${siteUrl}${path}`;

    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        datePublished: date.toISOString(),
        // Always present: consumers treat a missing dateModified as unknown
        // rather than as "same as published".
        dateModified: (updated ?? date).toISOString(),
        url,
        mainEntityOfPage: url,
        image: `${siteUrl}${ogPathFor(path)}`,
        author: {
            "@type": ORGANISATION_BYLINES.has(author) ? "Organization" : "Person",
            name: author,
        },
        publisher: {
            "@type": "Organization",
            name: PUBLISHER_NAME,
            url: siteUrl,
        },
        inLanguage: "en",
    };
}

/**
 * Serialise for embedding in `<script type="application/ld+json">`.
 *
 * Every `<` is escaped to its unicode form, so a post that quotes a closing
 * script tag — an advisory about HTML injection is exactly the kind of post
 * that would — cannot end the block early. JSON reads the escape as the same
 * character, so consumers see the original text.
 */
export function toJsonLd(value: unknown): string {
    return JSON.stringify(value).replace(/</g, "\\u003c");
}
