import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://mcp-hangar.io';

interface DocEntry {
  id: string;
  data: { title: string; description?: string };
  body?: string;
}

function cleanBody(doc: DocEntry): string {
  return (doc.body || '').replace(/^#\s+.+\n*/, '').trim();
}

function renderSection(title: string, entries: DocEntry[]): string {
  if (entries.length === 0) return '';
  const pages = entries
    .map(d => `### ${d.data.title}\n\n${cleanBody(d)}`)
    .join('\n\n---\n\n');
  return `## ${title}\n\n${pages}`;
}

export const GET: APIRoute = async () => {
  const docs = await getCollection('oss') as unknown as DocEntry[];
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const categorizedPrefixes = [
    'getting-started/', 'guides/', 'cookbook/', 'reference/',
    'architecture/', 'operations/', 'observability/', 'runbooks/',
    'security', 'adr/', 'development/', 'integrations/', 'testing/',
  ];

  const byPrefix = (prefix: string) =>
    docs.filter(d => d.id.startsWith(prefix) && !d.id.endsWith('/index'));

  const sections = [
    renderSection('Getting Started', byPrefix('getting-started/')),
    renderSection('Guides', byPrefix('guides/')),
    renderSection('Cookbook', byPrefix('cookbook/')),
    renderSection('Reference', byPrefix('reference/')),
    renderSection('Architecture', byPrefix('architecture/')),
    renderSection('Operations & Observability', [
      ...docs.filter(d => d.id.startsWith('operations/')),
      ...docs.filter(d => d.id.startsWith('observability/')),
      ...docs.filter(d => d.id.startsWith('runbooks/')),
    ]),
    renderSection('Security', docs.filter(d => d.id.startsWith('security'))),
    renderSection('Integrations', byPrefix('integrations/')),
    renderSection('Other', docs.filter(
      d => d.id !== 'index' && !categorizedPrefixes.some(p => d.id.startsWith(p))
    )),
  ].filter(Boolean);

  // Blog: include latest 5 posts inline
  const blogInline = posts.slice(0, 5).map(p => {
    const date = p.data.date.toISOString().split('T')[0];
    const body = (p.body || '').replace(/^#\s+.+\n*/, '').trim();
    return `### ${p.data.title}\n\n*${date} — ${p.data.author}*\n\n${body}`;
  }).join('\n\n---\n\n');

  const blogSection = posts.length > 0
    ? `## Blog (latest ${Math.min(5, posts.length)})\n\n${blogInline}`
    : '';

  const olderNote = posts.length > 5
    ? `\n\n> ${posts.length - 5} older posts available at ${SITE}/blog/ or via individual .md endpoints in llms.txt.\n`
    : '';

  const body = `# MCP Hangar

> MCP Hangar is the open-source control plane for Model Context Protocol (MCP) servers. It sits between AI agents and MCP servers to provide authentication, access control policies, observability, and compliance-grade audit logging. MIT-licensed, self-hosted, sub-millisecond overhead.

## Key facts

- Language: Python (pip install mcp-hangar)
- License: MIT
- Proxy architecture: agents connect to Hangar via MCP, Hangar enforces policies and forwards to upstream MCP servers
- Supports: subprocess, Docker, and remote HTTP MCP server backends
- Zero cloud dependency: runs locally, on bare metal, or in Kubernetes
- GitHub: https://github.com/mcp-hangar/mcp-hangar
- Website: ${SITE}
- Index: ${SITE}/llms.txt

---

${sections.join('\n\n---\n\n')}

---

${blogSection}${olderNote}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
