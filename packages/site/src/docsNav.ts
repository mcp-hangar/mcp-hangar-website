/**
 * Single source of truth for the docs navigation.
 *
 * Both the sidebar (`DocsSidebar.astro`) and the prev/next pager
 * (`DocsNavPrevNext.astro`) are derived from the `oss` content collection via
 * `buildDocsNav()`, so they cannot drift from each other or from the docs that
 * actually ship. When a new page lands in `@mcp-hangar/docs`, it appears in the
 * nav automatically — no website code change required.
 *
 * Curation is config-driven and *optional*:
 *   - SECTIONS       — section titles, order, and which id-prefixes belong where.
 *   - EXPLICIT_ORDER — pins the order of curated pages; anything not listed is
 *                      appended after, in natural (numeric-aware) id order.
 *   - LABEL_OVERRIDES — short sidebar labels; falls back to the doc's
 *                      `sidebar.label` frontmatter, then its title.
 *   - HIDDEN_IDS     — pages that exist but should not appear in the nav.
 *
 * None of these gate inclusion: a page missing from every override still shows
 * up (in its prefix-matched section, or a fallback section named after its
 * top-level directory). That is the whole point — the old hand-maintained
 * arrays silently dropped pages that weren't listed.
 */

export interface DocEntry {
  id: string;
  data: {
    title: string;
    sidebar?: { label?: string; order?: number };
  };
}

export interface NavLink {
  href: string;
  label: string;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

export interface DocsNav {
  sections: NavSection[];
  /** Flat, in-reading-order list matching the sidebar exactly (for prev/next). */
  flat: NavLink[];
}

interface SectionDef {
  title: string;
  /** id prefixes owned by this section; a doc matches when its id equals the
   *  prefix or begins with `prefix + "/"`. First matching section wins. */
  prefixes: string[];
}

/**
 * Section order and prefix ownership. Sections render top-to-bottom in this
 * order. `Operations` intentionally gathers several sibling directories.
 */
const SECTIONS: SectionDef[] = [
  { title: 'Getting Started', prefixes: ['getting-started'] },
  { title: 'Guides', prefixes: ['guides'] },
  { title: 'Cookbook', prefixes: ['cookbook'] },
  { title: 'Reference', prefixes: ['reference'] },
  { title: 'Architecture', prefixes: ['architecture'] },
  {
    title: 'Operations',
    prefixes: [
      'operations',
      'observability',
      'integrations',
      'runbooks',
      'security',
      'upgrade',
      'changelog',
    ],
  },
  { title: 'ADRs', prefixes: ['adr'] },
  { title: 'Development', prefixes: ['development', 'testing'] },
];

/** Pages that are built and reachable by URL but deliberately kept out of the nav. */
const HIDDEN_IDS = new Set<string>([
  'code-of-conduct',
  'CONTRIBUTING', // root duplicate of development/CONTRIBUTING
]);

/**
 * Curated reading order. Any doc id not present here is appended after the
 * pinned ones within its section, sorted by `sidebar.order` then natural id.
 */
const EXPLICIT_ORDER: string[] = [
  // Getting Started
  'getting-started/quickstart',
  'getting-started/installation',
  // Guides
  'guides/HTTP_TRANSPORT',
  'guides/AUTHENTICATION',
  'guides/FRONT_DOOR',
  'guides/MCP_SERVER_GROUPS',
  'guides/DISCOVERY',
  'guides/KUBERNETES',
  'guides/CONTAINERS',
  'guides/OBSERVABILITY',
  'guides/REST_API',
  'guides/FACADE_API',
  'guides/WEBSOCKETS',
  'guides/LOG_STREAMING',
  'guides/BATCH_INVOCATIONS',
  'guides/TESTING',
  // Cookbook (Overview first, then numbered recipes — new ones append in order)
  'cookbook/index',
  // Reference
  'reference/configuration',
  'reference/cli',
  'reference/rest-api',
  'reference/tools',
  'reference/hot-reload',
  // Architecture
  'architecture/OVERVIEW',
  'architecture/EVENT_SOURCING',
  'architecture/INTERCEPTOR_FRAMEWORK',
  // Operations
  'operations/COMPLIANCE',
  'observability/otel-integrations',
  'integrations/openlit-otlp',
  'runbooks/RELEASE',
  'security',
  'security/AUTH_SECURITY_AUDIT',
  'upgrade',
  'changelog',
  // Development
  'development/CONTRIBUTING',
  'development/GIT_FLOW',
  'development/BRANCH_PROTECTION',
  'development/PROJECT_BOARD',
  'development/EPIC_PLAYBOOK',
  'development/HOTFIX_RUNBOOK',
  'testing/approval-gate-manual-testing',
];

/** Short, curated sidebar labels. Falls back to `sidebar.label` then title. */
const LABEL_OVERRIDES: Record<string, string> = {
  'getting-started/quickstart': 'Quick Start',
  'getting-started/installation': 'Installation',
  'guides/HTTP_TRANSPORT': 'HTTP Transport',
  'guides/AUTHENTICATION': 'Authentication & RBAC',
  'guides/FRONT_DOOR': 'Front-Door Mode',
  'guides/MCP_SERVER_GROUPS': 'Server Groups',
  'guides/DISCOVERY': 'Discovery',
  'guides/KUBERNETES': 'Kubernetes',
  'guides/CONTAINERS': 'Containers',
  'guides/OBSERVABILITY': 'Observability',
  'guides/REST_API': 'REST API',
  'guides/FACADE_API': 'Facade API',
  'guides/WEBSOCKETS': 'WebSockets',
  'guides/LOG_STREAMING': 'Log Streaming',
  'guides/BATCH_INVOCATIONS': 'Batch Invocations',
  'guides/TESTING': 'Testing',
  'cookbook/index': 'Overview',
  'reference/configuration': 'Configuration',
  'reference/cli': 'CLI',
  'reference/rest-api': 'REST API',
  'reference/tools': 'MCP Tools',
  'reference/hot-reload': 'Hot Reload',
  'architecture/OVERVIEW': 'Overview',
  'architecture/EVENT_SOURCING': 'Event Sourcing',
  'architecture/INTERCEPTOR_FRAMEWORK': 'Interceptor Framework',
  'operations/COMPLIANCE': 'Compliance Export',
  'observability/otel-integrations': 'OpenTelemetry',
  'integrations/openlit-otlp': 'OpenLIT OTLP',
  'runbooks/RELEASE': 'Release Runbook',
  security: 'Security Policy',
  'security/AUTH_SECURITY_AUDIT': 'Auth Security Audit',
  upgrade: 'Upgrade Guide',
  changelog: 'Changelog',
  'adr/ADR-001-cqrs': 'ADR-001 CQRS',
  'adr/ADR-002-event-sourcing': 'ADR-002 Event Sourcing',
  'adr/ADR-003-sagas': 'ADR-003 Sagas',
  'adr/ADR-004-sep-1766-digest-pinning': 'ADR-004 Digest Pinning',
  'adr/ADR-005-sep-1763-interceptor-compliance': 'ADR-005 Interceptor Compliance',
  'adr/ADR-006-tetragon': 'ADR-006 Tetragon',
  'adr/ADR-007-langfuse-integration': 'ADR-007 Langfuse',
  'development/CONTRIBUTING': 'Contributing',
  'development/GIT_FLOW': 'Git Flow',
  'development/BRANCH_PROTECTION': 'Branch Protection',
  'development/PROJECT_BOARD': 'Project Board',
  'development/EPIC_PLAYBOOK': 'Epic Playbook',
  'development/HOTFIX_RUNBOOK': 'Hotfix Runbook',
  'testing/approval-gate-manual-testing': 'Approval Gate Testing',
};

const ORDER_INDEX = new Map(EXPLICIT_ORDER.map((id, i) => [id, i]));

/** Numeric-aware comparison so `cookbook/02` sorts before `cookbook/10`. */
function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' });
}

function topSegment(id: string): string {
  const slash = id.indexOf('/');
  return slash === -1 ? id : id.slice(0, slash);
}

function titleCase(segment: string): string {
  return segment
    .split(/[-_/]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function matchesPrefix(id: string, prefix: string): boolean {
  return id === prefix || id.startsWith(prefix + '/');
}

function sectionFor(id: string): number {
  return SECTIONS.findIndex((s) => s.prefixes.some((p) => matchesPrefix(id, p)));
}

function labelFor(doc: DocEntry): string {
  return LABEL_OVERRIDES[doc.id] ?? doc.data.sidebar?.label ?? doc.data.title;
}

function toLink(doc: DocEntry): NavLink {
  return { href: `/docs/${doc.id}`, label: labelFor(doc) };
}

/** Orders docs within a single section: pinned first (EXPLICIT_ORDER), then
 *  `sidebar.order`, then natural id order. */
function sortDocs(docs: DocEntry[]): DocEntry[] {
  return [...docs].sort((a, b) => {
    const ai = ORDER_INDEX.get(a.id) ?? Infinity;
    const bi = ORDER_INDEX.get(b.id) ?? Infinity;
    if (ai !== bi) return ai - bi;
    const ao = a.data.sidebar?.order ?? Infinity;
    const bo = b.data.sidebar?.order ?? Infinity;
    if (ao !== bo) return ao - bo;
    return naturalCompare(a.id, b.id);
  });
}

/**
 * Build the docs navigation from the `oss` content collection.
 * Deterministic and pure — safe to unit test and to call from Astro components.
 */
export function buildDocsNav(docs: DocEntry[]): DocsNav {
  const visible = docs.filter((d) => !HIDDEN_IDS.has(d.id));

  // Bucket docs into their configured section; unmatched ids fall back to a
  // section named after their top-level directory so nothing is ever dropped.
  const known: DocEntry[][] = SECTIONS.map(() => []);
  const fallback = new Map<string, DocEntry[]>();

  for (const doc of visible) {
    const idx = sectionFor(doc.id);
    if (idx === -1) {
      const seg = topSegment(doc.id);
      const bucket = fallback.get(seg) ?? [];
      bucket.push(doc);
      fallback.set(seg, bucket);
    } else {
      known[idx].push(doc);
    }
  }

  const sections: NavSection[] = [];

  SECTIONS.forEach((def, i) => {
    if (known[i].length === 0) return;
    sections.push({ title: def.title, links: sortDocs(known[i]).map(toLink) });
  });

  // Fallback sections, in stable natural order of their directory name.
  for (const seg of [...fallback.keys()].sort(naturalCompare)) {
    sections.push({
      title: titleCase(seg),
      links: sortDocs(fallback.get(seg)!).map(toLink),
    });
  }

  const flat = sections.flatMap((s) => s.links);
  return { sections, flat };
}
