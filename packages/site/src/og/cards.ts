import { getCollection } from "astro:content";

/**
 * Every card the build emits, in one list.
 *
 * The PNG endpoint renders from it and /og-preview tiles it, so the contact
 * sheet cannot show a set of cards the site does not actually ship.
 *
 * `props` carries only what came out of frontmatter — nothing here reads a page
 * body, so a card can never drift from what the page declares about itself.
 */

export type CardProps =
    | { kind: "home" }
    | { kind: "blog"; title: string; date?: string; advisory?: boolean }
    | { kind: "security"; title: string; note?: string }
    | { kind: "learn"; title: string }
    | { kind: "docs"; title: string; subpath?: string };

/** `slug` is both the card's path under /og/ and the page it belongs to. */
export type Card = { slug: string; page: string; props: CardProps };

const fmtDate = (d: Date) => d.toISOString().split("T")[0];

/** A post is an advisory when it says so, or when its slug does. */
const isAdvisory = (id: string, tags?: string[]) =>
    /security-advisory/.test(id) || (tags ?? []).some(t => /advisor/i.test(t));

export async function ogCards(): Promise<Card[]> {
    const [blog, learn, docs, security] = await Promise.all([
        getCollection("blog"),
        getCollection("learn"),
        getCollection("oss"),
        getCollection("security"),
    ]);

    // Non-collection routes. Kept by hand on purpose: it is a short list, and a
    // page that lands here without an entry is caught by the build gate rather
    // than silently taking the site-wide fallback.
    const cards: Card[] = [
        { slug: "home", page: "/", props: { kind: "home" } },
        { slug: "blog", page: "/blog", props: { kind: "blog", title: "Engineering notes from the enforcement plane" } },
        { slug: "learn", page: "/learn", props: { kind: "learn", title: "Understand how Hangar governs every MCP call" } },
        { slug: "security", page: "/security", props: { kind: "security", title: "Security", note: "CVE ledger · OWASP MCP Top 10" } },
        { slug: "docs", page: "/docs", props: { kind: "docs", title: "Documentation" } },
        { slug: "privacy", page: "/privacy", props: { kind: "docs", title: "Privacy policy" } },
        { slug: "terms", page: "/terms", props: { kind: "docs", title: "Terms" } },
    ];

    for (const p of blog) {
        cards.push({
            slug: `blog/${p.id}`,
            page: `/blog/${p.id}`,
            props: {
                kind: "blog",
                title: p.data.title,
                date: p.data.date ? fmtDate(p.data.date) : undefined,
                advisory: isAdvisory(p.id, p.data.tags),
            },
        });
    }

    // Drafts build no page, so they get no card either.
    for (const e of learn.filter(e => !e.data.draft)) {
        cards.push({ slug: `learn/${e.id}`, page: `/learn/${e.id}`, props: { kind: "learn", title: e.data.title } });
    }

    for (const e of security) {
        cards.push({ slug: `security/${e.id}`, page: `/security/${e.id}`, props: { kind: "security", title: e.data.title } });
    }

    for (const d of docs) {
        const parts = d.id.split("/");
        cards.push({
            slug: `docs/${d.id}`,
            page: `/docs/${d.id}`,
            props: {
                kind: "docs",
                title: d.data.title ?? parts[parts.length - 1],
                subpath: parts.length > 1 ? parts.slice(0, -1).join(" / ") : undefined,
            },
        });
    }

    return cards;
}
