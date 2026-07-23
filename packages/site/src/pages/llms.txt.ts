import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://mcp-hangar.io';

export const GET: APIRoute = async () => {
  const docs = await getCollection('oss');
  const learn = await getCollection('learn');
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  // Categorize docs by path prefix (skip index pages within categories)
  const categorize = (prefix: string) =>
    docs
      .filter(d => d.id.startsWith(prefix) && !d.id.endsWith('/index'))
      .map(d => `- [${d.data.title}](${SITE}/docs/${d.id}.md)`)
      .join('\n');

  const gettingStarted = categorize('getting-started/');
  const guides = categorize('guides/');
  const cookbook = categorize('cookbook/');
  const reference = categorize('reference/');
  const architecture = categorize('architecture/');
  const operations = [
    ...docs.filter(d => d.id.startsWith('operations/')),
    ...docs.filter(d => d.id.startsWith('observability/')),
    ...docs.filter(d => d.id.startsWith('runbooks/')),
  ].map(d => `- [${d.data.title}](${SITE}/docs/${d.id}.md)`).join('\n');
  const security = docs
    .filter(d => d.id.startsWith('security'))
    .map(d => `- [${d.data.title}](${SITE}/docs/${d.id}.md)`)
    .join('\n');
  const adr = categorize('adr/');
  const development = categorize('development/');
  const integrations = categorize('integrations/');
  const testing = categorize('testing/');

  const learnEntries = learn
    .map(l => `- [${l.data.title}](${SITE}/learn/${l.id}.md) — ${l.data.description}`)
    .join('\n');

  const blogEntries = posts
    .map(p => `- [${p.data.title}](${SITE}/blog/${p.id}.md) (${p.data.date.toISOString().split('T')[0]})`)
    .join('\n');

  // Standalone docs (not already categorized above)
  const categorizedPrefixes = [
    'getting-started/', 'guides/', 'cookbook/', 'reference/',
    'architecture/', 'operations/', 'observability/', 'runbooks/',
    'security', 'adr/', 'development/', 'integrations/', 'testing/',
  ];
  const standalone = docs
    .filter(d => d.id !== 'index' && !categorizedPrefixes.some(p => d.id.startsWith(p)))
    .map(d => `- [${d.data.title}](${SITE}/docs/${d.id}.md)`)
    .join('\n');

  const body = `# MCP Hangar

> MCP Hangar is the Kubernetes-native policy enforcement plane for Model Context Protocol (MCP). Every MCP tool call runs one deterministic allow/deny path — deploy-time admission, per-server egress control, tool-schema digest pinning, and the L7 MCPEgressPolicy language. MIT-licensed, self-hosted, no SaaS tier. Enforcement is deterministic: explicit policy, no anomaly scores or learned baselines.

## Key facts

- Language: Python (pip install mcp-hangar)
- License: MIT — self-hosted, no SaaS/managed tier
- Enforcement plane: each tool call passes a single deterministic allow/deny path (admission, tool-access authz, tool-schema digest pinning, L7 MCPEgressPolicy)
- Kubernetes-native: an operator applies deploy-time admission webhooks and default-deny egress in labelled namespaces
- Deterministic by design: explicit policy decisions, no anomaly detection
- Task relay-with-governance (ADR-014) lands in the 2.0 preview line, not stable
- GitHub: https://github.com/mcp-hangar/mcp-hangar
- Website: ${SITE}

## Getting Started

${gettingStarted}

## Guides

${guides}

## Cookbook

${cookbook}

## Reference

${reference}

## Architecture

${architecture}

## Operations & Observability

${operations}

## Security

${security}

## Architecture Decision Records

${adr}

## Integrations

${integrations}

## Development

${development}

## Testing

${testing}

## Other

${standalone}

## Learn

${learnEntries}

## Blog

${blogEntries}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
