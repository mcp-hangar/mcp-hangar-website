import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { stripSvg } from '../lib/strip-svg';

const SITE = 'https://mcp-hangar.io';

interface DocEntry {
  id: string;
  data: { title: string; description?: string };
  body?: string;
}

// Resolve a repo-relative markdown link against the document that contains it.
// The dump is flat, so `../upgrade.md` and `AUTHENTICATION.md` mean nothing to
// whoever reads it — 138 of the links in this file were unresolvable before
// this existed. Everything becomes an absolute URL that can actually be
// fetched; anything already absolute is left alone.
function absolutise(body: string, docId: string): string {
  const dir = docId.includes('/') ? docId.slice(0, docId.lastIndexOf('/')) : '';
  const resolve = (target: string): string => {
    const segments = (dir ? dir.split('/') : []).concat(target.split('/'));
    const out: string[] = [];
    for (const s of segments) {
      if (s === '' || s === '.') continue;
      if (s === '..') out.pop();
      else out.push(s);
    }
    return out.join('/');
  };
  return body.replace(/\]\(([^)\s]+?)(#[^)\s]*)?\)/g, (whole, target: string, hash = '') => {
    if (/^(https?:|mailto:|#)/.test(target)) return whole;
    if (target.startsWith('/')) return `](${SITE}${target}${hash})`;
    // Extension-less relative targets are docs paths too (`reference/configuration`).
    // Anything carrying a different extension is left alone rather than guessed at.
    const looksLikeDoc = target.endsWith('.md') || !/\.[a-z0-9]+$/i.test(target);
    if (!looksLikeDoc) return whole;
    return `](${SITE}/docs/${resolve(target).replace(/\.md$/, '')}.md${hash})`;
  });
}

// The `security` collection is MDX, so its raw body still carries the import
// lines and the component tags they refer to. Machines get the prose: drop the
// imports, drop self-closing components (they carry no prose), and unwrap the
// rest so a `<Callout>`'s contents survive. Same rule as the `.md` mirrors.
function mdxToProse(body: string): string {
  return body
    .replace(/^(import|export)\s+.*$/gm, '')
    .replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*\/>\s*/g, '')
    .replace(/<\/?([A-Z][A-Za-z0-9]*)\b[^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function cleanBody(doc: DocEntry): string {
  // Strip the leading h1 and any inline SVG — machine output is prose, no diagrams.
  const body = stripSvg((doc.body || '').replace(/^#\s+.+\n*/, '').trim());
  return absolutise(body, doc.id);
}

function renderSection(title: string, entries: DocEntry[]): string {
  if (entries.length === 0) return '';
  const pages = entries
    .map(d => `### ${d.data.title}\n\n${cleanBody(d)}`)
    .join('\n\n---\n\n');
  return `## ${title}\n\n${pages}`;
}

// Link-only index for large, recipe-shaped sections: title + description + the
// raw .md URL, no inlined body. Keeps them discoverable without paying their
// full token cost in the dump — fetch any link for the complete text.
function renderIndex(title: string, entries: DocEntry[], note: string): string {
  if (entries.length === 0) return '';
  const lines = entries.map(d => {
    const desc = d.data.description ? ` — ${d.data.description}` : '';
    return `- [${d.data.title}](${SITE}/docs/${d.id}.md)${desc}`;
  }).join('\n');
  return `## ${title}\n\n_${note}_\n\n${lines}`;
}

export const GET: APIRoute = async () => {
  const docs = await getCollection('oss') as unknown as DocEntry[];
  const learn = await getCollection('learn') as unknown as DocEntry[];
  // Site security posture pages. They join the docs' own security pages under
  // one `## Security` heading — a second heading of the same name would just be
  // a duplicate key in this file.
  const securityPages = (await getCollection('security'))
    .sort((a, b) => a.data.order - b.data.order)
    .map(s => ({
      id: s.id,
      data: { title: s.data.title, description: s.data.description },
      body: mdxToProse(s.body ?? ''),
    })) as DocEntry[];
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  // Internal-only contributor docs — excluded from the full machine dump.
  // (development/, testing/, and adr/ are not product understanding for an
  // external LLM; they also never fall into the "Other" catch-all below.)
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
    renderIndex('Cookbook', byPrefix('cookbook/'), 'Recipe index — fetch any link for the full walkthrough.'),
    renderIndex('Reference', byPrefix('reference/'), 'Reference index — fetch any link for the full entry.'),
    renderSection('Architecture', byPrefix('architecture/')),
    renderSection('Operations & Observability', [
      ...docs.filter(d => d.id.startsWith('operations/')),
      ...docs.filter(d => d.id.startsWith('observability/')),
      ...docs.filter(d => d.id.startsWith('runbooks/')),
    ]),
    renderSection('Security', [
      ...securityPages,
      ...docs.filter(d => d.id.startsWith('security')),
    ]),
    renderSection('Integrations', byPrefix('integrations/')),
    renderSection('Other', docs.filter(
      d => d.id !== 'index' && !categorizedPrefixes.some(p => d.id.startsWith(p))
    )),
    renderSection('Learn', learn),
  ].filter(Boolean);

  // Blog: compact index only (title + description + date + link) — no bodies.
  const blogEntries = posts.map(p => {
    const date = p.data.date.toISOString().split('T')[0];
    return `- [${p.data.title}](${SITE}/blog/${p.id}.md) (${date}) — ${p.data.description}`;
  }).join('\n');

  const blogSection = posts.length > 0
    ? `## Blog\n\n${blogEntries}`
    : '';

  const body = `# MCP Hangar

> MCP Hangar is the Kubernetes-native policy enforcement plane for Model Context Protocol (MCP). Every MCP tool call runs one deterministic allow/deny path — deploy-time admission, per-server egress control, tool-schema digest pinning, and the L7 MCPEgressPolicy language. MIT-licensed, self-hosted, no SaaS tier. Enforcement is deterministic: explicit policy, no anomaly scores or learned baselines.

## Key facts

- Language: Python (pip install mcp-hangar)
- License: MIT — self-hosted, no SaaS/managed tier
- Enforcement plane: each tool call passes a single deterministic allow/deny path (admission, tool-access authz, tool-schema digest pinning, L7 MCPEgressPolicy)
- Kubernetes-native: an operator applies deploy-time admission webhooks and default-deny egress in labelled namespaces
- Deterministic by design: explicit policy decisions, no anomaly detection
- Task relay-with-governance (ADR-014) shipped in 2.0.0; it is not in the 1.6.x line
- GitHub: https://github.com/mcp-hangar/mcp-hangar
- Website: ${SITE}
- Index: ${SITE}/llms.txt

---

${sections.join('\n\n---\n\n')}

---

${blogSection}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
