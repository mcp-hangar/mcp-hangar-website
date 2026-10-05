import { getCollection, type CollectionEntry } from "astro:content";

/**
 * The blog posts the site publishes: every post whose frontmatter does not say
 * `draft: true`.
 *
 * Every page, feed and card reads posts through this, never through
 * `getCollection("blog")` directly, so a draft is built by nothing: no route,
 * no listing, no RSS item, no llms.txt line and no OG card. That is what makes
 * `scripts/release-post.mjs` safe -- it writes a draft, and a draft that is
 * merged by accident still reaches no reader. `blog-drafts.test.ts` fails on a
 * direct `getCollection("blog")` anywhere else.
 */
export async function publishedPosts(): Promise<CollectionEntry<"blog">[]> {
  return getCollection("blog", ({ data }) => !data.draft);
}
