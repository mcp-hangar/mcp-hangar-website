import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs/promises';
import path from 'node:path';
import { stripSvg } from '../../lib/strip-svg';

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getCollection('learn');
  return entries.map(entry => ({
    params: { slug: entry.id },
    props: { entry },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as {
    entry: {
      id: string;
      data: {
        title: string;
        description: string;
        updated: Date;
        tags?: string[];
        type: string;
        level: string;
        time: string;
        theme: string;
        status: string;
      };
      body?: string;
    };
  };

  // Read original MDX source
  const mdxPath = path.resolve(`src/content/learn/${entry.id}.mdx`);
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
    body = entry.body || '';
  }
  // Machines get prose, not diagrams — strip inline SVG from Visual learn pages.
  body = stripSvg(body);

  const tags = entry.data.tags?.length ? `\nTags: ${entry.data.tags.join(', ')}` : '';
  const updated = entry.data.updated.toISOString().split('T')[0];

  const header = [
    `# ${entry.data.title}`,
    '',
    `> ${entry.data.description}`,
    '',
    `Type: ${entry.data.type} | Level: ${entry.data.level} | Time: ${entry.data.time} | Updated: ${updated}${tags}`,
    `Source: https://mcp-hangar.io/learn/${entry.id}`,
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
