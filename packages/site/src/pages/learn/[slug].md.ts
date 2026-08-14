import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs/promises';
import path from 'node:path';
import { stripSvg } from '../../lib/strip-svg';

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = (await getCollection('learn')).filter(e => !e.data.draft);
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
        since: string;
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

  // Unwrap MDX components. Stripping the import lines above left the tags they
  // referred to in place, so 7 of 15 learn pages shipped literal
  // `<Callout variant="note">…</Callout>` to anything reading the markdown.
  // The content inside a callout is prose worth keeping, so unwrap rather than
  // delete: opening and closing tags of capitalised components go, their
  // children stay. Self-closing components carry no prose and are dropped.
  //
  // Some components carry prose in their attributes rather than their
  // children — a stage on the request path names itself in `title`/`summary`,
  // and the flow's closing line lives in `note`. Dropping the tag would drop
  // that text, leaving the markdown a run of unlabelled paragraphs, so those
  // attributes are promoted to a line of prose before the tag goes.
  const attr = (attrs: string, name: string) =>
    attrs.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
  const promote = (attrs: string) => {
    const title = attr(attrs, 'title');
    const summary = attr(attrs, 'summary');
    const note = attr(attrs, 'note');
    if (title) return `\n**${title}.**${summary ? ` ${summary}` : ''}\n`;
    if (note) return `\n${note}\n`;
    return '';
  };

  body = body
    .replace(/<([A-Z][A-Za-z0-9]*)\b([^>]*)\/>\s*/g, (_m, _tag, attrs) => promote(attrs))
    .replace(/<([A-Z][A-Za-z0-9]*)\b([^>]*)>/g, (_m, _tag, attrs) => promote(attrs))
    .replace(/<\/([A-Z][A-Za-z0-9]*)\s*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const tags = entry.data.tags?.length ? `\nTags: ${entry.data.tags.join(', ')}` : '';
  const updated = entry.data.updated.toISOString().split('T')[0];

  const header = [
    `# ${entry.data.title}`,
    '',
    `> ${entry.data.description}`,
    '',
    `Type: ${entry.data.type} | Level: ${entry.data.level} | Time: ${entry.data.time} | Since: ${entry.data.since} | Updated: ${updated}${tags}`,
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
