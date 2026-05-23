import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await getCollection('oss');
  return docs.map(doc => ({
    params: { slug: doc.id },
    props: { doc },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const { doc } = props as { doc: { id: string; data: { title: string; description?: string }; body?: string } };

  // Strip leading h1 from body (already captured in data.title)
  const rawBody = (doc.body || '').replace(/^#\s+.+\n*/, '').trim();

  const lines: string[] = [
    `# ${doc.data.title}`,
    '',
  ];
  if (doc.data.description) {
    lines.push(`> ${doc.data.description}`, '');
  }
  lines.push(`Source: https://mcp-hangar.io/docs/${doc.id}`, '', '---', '');

  return new Response(lines.join('\n') + rawBody + '\n', {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
