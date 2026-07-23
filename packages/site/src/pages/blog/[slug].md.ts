import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs/promises';
import path from 'node:path';
import { stripSvg } from '../../lib/strip-svg';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: { id: string; data: { title: string; description: string; date: Date; author: string; tags?: string[] }; body?: string; filePath?: string } };

  // Read original MDX source
  const mdxPath = path.resolve(`src/content/blog/${post.id}.mdx`);
  let body = '';
  try {
    const raw = await fs.readFile(mdxPath, 'utf-8');
    // Strip frontmatter
    const fmEnd = raw.indexOf('---', raw.indexOf('---') + 3);
    body = fmEnd > 0 ? raw.slice(fmEnd + 3).trim() : raw;
    // Strip import/export statements (MDX-specific) and leading h1 (already in header)
    body = body
      .replace(/^(import|export)\s+.*$/gm, '')
      .replace(/^#\s+.+\n*/m, '')
      .trim();
  } catch {
    body = post.body || '';
  }
  // Machines get prose, not diagrams — strip any inline SVG.
  body = stripSvg(body);

  const tags = post.data.tags?.length ? `\nTags: ${post.data.tags.join(', ')}` : '';
  const date = post.data.date.toISOString().split('T')[0];

  const header = [
    `# ${post.data.title}`,
    '',
    `> ${post.data.description}`,
    '',
    `Author: ${post.data.author} | Date: ${date}${tags}`,
    `Source: https://mcp-hangar.io/blog/${post.id}`,
    '',
    '---',
    '',
  ].join('\n');

  return new Response(`${header}${body}\n`, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
