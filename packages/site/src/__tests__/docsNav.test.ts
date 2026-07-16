import { describe, it, expect } from 'vitest';
import { buildDocsNav, countCookbookRecipes, type DocEntry } from '../docsNav';

/** Minimal collection-entry factory. */
function doc(id: string, title?: string, sidebar?: DocEntry['data']['sidebar']): DocEntry {
  return { id, data: { title: title ?? id, sidebar } };
}

/** Representative slice of the real docs collection. */
const BASE: DocEntry[] = [
  doc('getting-started/quickstart', 'Quick Start'),
  doc('getting-started/installation', 'Installation'),
  doc('guides/HTTP_TRANSPORT', 'HTTP Transport for Remote MCP servers'),
  doc('guides/AUTHENTICATION', 'Authentication'),
  doc('cookbook/index', 'Cookbook'),
  doc('cookbook/01-http-gateway', '01 — HTTP Gateway'),
  doc('cookbook/02-health-checks', '02 — Health Checks'),
  doc('adr/ADR-001-cqrs', 'ADR-001: CQRS'),
  doc('reference/cli', 'CLI'),
];

describe('buildDocsNav', () => {
  it('keeps prev/next flat list identical to the flattened sidebar (no drift)', () => {
    const { sections, flat } = buildDocsNav(BASE);
    const fromSections = sections.flatMap((s) => s.links);
    expect(flat).toEqual(fromSections);
  });

  it('auto-includes a new doc without any config change', () => {
    const withNew = [...BASE, doc('cookbook/20-readonly-controlled-write', '20 — Read-Only Rootfs')];
    const { flat } = buildDocsNav(withNew);
    const hrefs = flat.map((l) => l.href);
    expect(hrefs).toContain('/docs/cookbook/20-readonly-controlled-write');
  });

  it('appends new numbered docs after the pinned ones in natural order', () => {
    const withNew = [
      ...BASE,
      doc('cookbook/20-readonly-controlled-write', '20'),
      doc('cookbook/10-discovery-docker', '10'),
    ];
    const { sections } = buildDocsNav(withNew);
    const cookbook = sections.find((s) => s.title === 'Cookbook')!;
    const ids = cookbook.links.map((l) => l.href.replace('/docs/', ''));
    // Overview + pinned 01,02 first (from EXPLICIT_ORDER), then 10, then 20.
    expect(ids).toEqual([
      'cookbook/index',
      'cookbook/01-http-gateway',
      'cookbook/02-health-checks',
      'cookbook/10-discovery-docker',
      'cookbook/20-readonly-controlled-write',
    ]);
  });

  it('excludes hidden pages even when present in the collection', () => {
    const withHidden = [...BASE, doc('code-of-conduct', 'Code of Conduct'), doc('CONTRIBUTING', 'Contributing')];
    const { flat } = buildDocsNav(withHidden);
    const hrefs = flat.map((l) => l.href);
    expect(hrefs).not.toContain('/docs/code-of-conduct');
    expect(hrefs).not.toContain('/docs/CONTRIBUTING');
  });

  it('renders sections in the configured order', () => {
    const { sections } = buildDocsNav(BASE);
    const titles = sections.map((s) => s.title);
    expect(titles).toEqual(['Getting Started', 'Guides', 'Cookbook', 'Reference', 'ADRs']);
  });

  it('routes an unknown top-level directory into a fallback section, never dropping it', () => {
    const { sections, flat } = buildDocsNav([...BASE, doc('tutorials/first-agent', 'First Agent')]);
    const fallback = sections.find((s) => s.title === 'Tutorials');
    expect(fallback).toBeDefined();
    expect(flat.map((l) => l.href)).toContain('/docs/tutorials/first-agent');
  });

  it('prefers curated label, then sidebar.label, then the doc title', () => {
    const docs = [
      doc('guides/HTTP_TRANSPORT', 'HTTP Transport for Remote MCP servers'), // curated override wins
      doc('guides/NEW_WITH_FRONTMATTER', 'Long Prose Title', { label: 'Short' }),
      doc('guides/NEW_PLAIN', 'Plain Title'),
    ];
    const { flat } = buildDocsNav(docs);
    const byHref = Object.fromEntries(flat.map((l) => [l.href, l.label]));
    expect(byHref['/docs/guides/HTTP_TRANSPORT']).toBe('HTTP Transport');
    expect(byHref['/docs/guides/NEW_WITH_FRONTMATTER']).toBe('Short');
    expect(byHref['/docs/guides/NEW_PLAIN']).toBe('Plain Title');
  });

  it('tidies fallback labels: strips the ordering prefix and any -- subtitle', () => {
    const docs = [
      doc('cookbook/05-load-balancing', '05 -- Load Balancing'),
      doc('cookbook/01-http-gateway', '01 — HTTP Gateway'),
      doc('guides/SOMETHING', 'Feature Name -- with a long subtitle'),
      doc('guides/HYPHENATED', 'Read-Only Rootfs'),
    ];
    const { flat } = buildDocsNav(docs);
    const byHref = Object.fromEntries(flat.map((l) => [l.href, l.label]));
    expect(byHref['/docs/cookbook/05-load-balancing']).toBe('Load Balancing');
    expect(byHref['/docs/cookbook/01-http-gateway']).toBe('HTTP Gateway');
    expect(byHref['/docs/guides/SOMETHING']).toBe('Feature Name');
    expect(byHref['/docs/guides/HYPHENATED']).toBe('Read-Only Rootfs'); // single hyphen in a word preserved
  });

  it('counts numbered cookbook recipes, excluding the overview and non-cookbook docs', () => {
    const docs = [
      doc('cookbook/index', 'Overview'),
      doc('cookbook/01-http-gateway', '01'),
      doc('cookbook/02-health-checks', '02'),
      doc('cookbook/23-harden-public-gateway', '23'),
      doc('guides/HTTP_TRANSPORT', 'not a recipe'),
    ];
    expect(countCookbookRecipes(docs)).toBe(3);
  });

  it('groups the mixed Operations directories under one section', () => {
    const opsDocs = [
      doc('operations/COMPLIANCE', 'Compliance'),
      doc('observability/otel-integrations', 'OTel'),
      doc('security', 'Security Policy'),
      doc('security/AUTH_SECURITY_AUDIT', 'Audit'),
      doc('changelog', 'Changelog'),
    ];
    const { sections } = buildDocsNav(opsDocs);
    const ops = sections.find((s) => s.title === 'Operations')!;
    expect(ops.links.map((l) => l.href)).toEqual([
      '/docs/operations/COMPLIANCE',
      '/docs/observability/otel-integrations',
      '/docs/security',
      '/docs/security/AUTH_SECURITY_AUDIT',
      '/docs/changelog',
    ]);
  });
});
