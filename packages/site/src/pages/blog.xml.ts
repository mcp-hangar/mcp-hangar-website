import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  return rss({
    title: 'MCP Hangar Blog',
    description: 'Updates and technical deep-dives from the MCP Hangar team.',
    site: context.site ?? 'https://mcp-hangar.io',
    items: posts
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .map(post => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: `/blog/${post.id}/`,
      })),
  });
}
