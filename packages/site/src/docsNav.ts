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
 * order, and are the reader's questions rather than the docs repo's folders:
 * how do I start, how do I do X, a worked recipe, what does key Y mean, how do
 * I run it, what does it guarantee. Architecture is reference material; the
 * remaining runbooks, the upgrade guide and the release matrix are operating.
 *
 * ADRs are not here. They are the project's decision record, with their own
 * index at /docs/adr and their own nav group (see DECISIONS_PREFIX), so the
 * product docs stop reading as a 29-entry design archive.
 */
const SECTIONS: SectionDef[] = [
  { title: "Start", prefixes: ["getting-started"] },
  { title: "Guides", prefixes: ["guides"] },
  { title: "Cookbook", prefixes: ["cookbook"] },
  { title: "Reference", prefixes: ["reference", "architecture"] },
  {
    title: "Operate",
    prefixes: [
      "operations",
      "observability",
      "integrations",
      "runbooks",
      "upgrade",
    ],
  },
  { title: "Security", prefixes: ["security"] },
];

/** ADRs: their own section, out of the docs sidebar and pager. */
export const DECISIONS_PREFIX = "adr";
export const DECISIONS_INDEX = "/docs/adr";

/** Pages that are built and reachable by URL but deliberately kept out of the nav. */
const HIDDEN_IDS = new Set<string>([
  "code-of-conduct",
  // The docs repo's own release notes (docs v1.2.x, compare links into
  // mcp-hangar/docs) -- not the product's. In the nav, beside the Upgrade
  // Guide, it read as the product changelog, and the footer linked it as one.
  // The product's notes are core's GitHub releases (LINKS.changelog). Hiding
  // is nav-only: the page still builds and stays reachable by URL.
  "changelog",
]);

/**
 * Curated reading order. Any doc id not present here is appended after the
 * pinned ones within its section, sorted by `sidebar.order` then natural id.
 */
const EXPLICIT_ORDER: string[] = [
  // Getting Started
  "getting-started/quickstart",
  "getting-started/installation",
  "getting-started/releases",
  // Guides
  "guides/HTTP_TRANSPORT",
  "guides/AUTHENTICATION",
  "guides/FRONT_DOOR",
  "guides/MCP_SERVER_GROUPS",
  "guides/DISCOVERY",
  "guides/KUBERNETES",
  "guides/CONTAINERS",
  "guides/OBSERVABILITY",
  "guides/REST_API",
  "guides/FACADE_API",
  "guides/WEBSOCKETS",
  "guides/LOG_STREAMING",
  "guides/BATCH_INVOCATIONS",
  "guides/TESTING",
  // Cookbook (Overview first, then numbered recipes — new ones append in order)
  "cookbook/index",
  // Reference
  "reference/configuration",
  "reference/cli",
  "reference/rest-api",
  "reference/tools",
  "reference/hot-reload",
  // Reference: architecture after the lookup pages
  "architecture/OVERVIEW",
  "architecture/EVENT_SOURCING",
  "architecture/INTERCEPTOR_FRAMEWORK",
  // Operate
  "upgrade",
  "operations/COMPLIANCE",
  "observability/otel-integrations",
  "integrations/openlit-otlp",
  // Security
  "security",
  "security/VERDICT_LIMITS",
  "security/OWASP_MCP_TOP_10_COVERAGE",
  "security/AUTH_SECURITY_AUDIT",
];

/** Short, curated sidebar labels. Falls back to `sidebar.label` then title. */
const LABEL_OVERRIDES: Record<string, string> = {
  "getting-started/quickstart": "Quick Start",
  "getting-started/installation": "Installation",
  "guides/HTTP_TRANSPORT": "HTTP Transport",
  "guides/AUTHENTICATION": "Authentication & RBAC",
  "guides/FRONT_DOOR": "Front-Door Mode",
  "guides/MCP_SERVER_GROUPS": "Server Groups",
  "guides/DISCOVERY": "Discovery",
  "guides/KUBERNETES": "Kubernetes",
  "guides/CONTAINERS": "Containers",
  "guides/OBSERVABILITY": "Observability",
  "guides/REST_API": "REST API",
  "guides/FACADE_API": "Facade API",
  "guides/WEBSOCKETS": "WebSockets",
  "guides/LOG_STREAMING": "Log Streaming",
  "guides/BATCH_INVOCATIONS": "Batch Invocations",
  "guides/TESTING": "Testing",
  "cookbook/index": "Overview",
  "reference/configuration": "Configuration",
  "reference/cli": "CLI",
  "reference/rest-api": "REST API",
  "reference/tools": "MCP Tools",
  "reference/hot-reload": "Hot Reload",
  "architecture/OVERVIEW": "Architecture Overview",
  "architecture/EVENT_SOURCING": "Event Sourcing",
  "architecture/INTERCEPTOR_FRAMEWORK": "Interceptor Framework",
  "operations/COMPLIANCE": "Compliance Export",
  "observability/otel-integrations": "OpenTelemetry",
  "integrations/openlit-otlp": "OpenLIT OTLP",
  security: "Security Policy",
  "security/AUTH_SECURITY_AUDIT": "Auth Security Audit",
  upgrade: "Upgrade Guide",
};

const ORDER_INDEX = new Map(EXPLICIT_ORDER.map((id, i) => [id, i]));

/** Numeric-aware comparison so `cookbook/02` sorts before `cookbook/10`. */
function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, "en", { numeric: true, sensitivity: "base" });
}

function topSegment(id: string): string {
  const slash = id.indexOf("/");
  return slash === -1 ? id : id.slice(0, slash);
}

function titleCase(segment: string): string {
  return segment
    .split(/[-_/]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function matchesPrefix(id: string, prefix: string): boolean {
  return id === prefix || id.startsWith(prefix + "/");
}

function sectionFor(id: string): number {
  return SECTIONS.findIndex((s) =>
    s.prefixes.some((p) => matchesPrefix(id, p))
  );
}

/**
 * Tidies a fallback label derived from a doc title so the sidebar reads clean:
 *   - drops a leading ordering prefix (`05 -- `, `01 — `) — the number is
 *     redundant once the list is already sorted;
 *   - keeps only the concise lead before a ` -- ` / em-dash subtitle separator.
 * So `05 -- Load Balancing` -> `Load Balancing` and
 * `ADR-009: … -- Core, Operator …` -> `ADR-009: …`. Single hyphens inside a word
 * (`Relay-Only`) are untouched. Curated LABEL_OVERRIDES bypass this entirely.
 */
function cleanLabel(raw: string): string {
  const tidy = raw
    .trim()
    .replace(/^\d+\s*[—–-]{1,2}\s*/, "")
    .split(/\s+(?:--|[—–])\s+/)[0]
    .trim();
  return tidy || raw.trim();
}

function labelFor(doc: DocEntry): string {
  const override = LABEL_OVERRIDES[doc.id];
  if (override !== undefined) return override;
  return cleanLabel(doc.data.sidebar?.label ?? doc.data.title);
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
  const visible = docs.filter(
    (d) => !HIDDEN_IDS.has(d.id) && !isDecision(d.id)
  );

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

export function isDecision(id: string): boolean {
  return matchesPrefix(id, DECISIONS_PREFIX);
}

/**
 * The Decisions nav: every ADR in number order (natural id order, which is
 * number order for `adr/ADR-NNN-*`). Its own sidebar group and its own pager,
 * so reading ADR-014 pages on to ADR-015 rather than into the quick start.
 */
export function buildDecisionsNav(docs: DocEntry[]): NavLink[] {
  return docs
    .filter((d) => isDecision(d.id))
    .sort((a, b) => naturalCompare(a.id, b.id))
    .map((d) => ({ href: `/docs/${d.id}`, label: adrLabel(d.data.title) }));
}

/** `ADR-014: Tasks are Relayed With Governance -- …` -> `ADR-014 Tasks are Relayed With Governance`. */
function adrLabel(title: string): string {
  return cleanLabel(title)
    .replace(/^(ADR-\d+):\s*/, "$1 ")
    .replace(/`/g, "");
}

export interface DecisionRecord {
  href: string;
  /** "ADR-014" */
  number: string;
  /** The title without the number or a `--` subtitle. */
  title: string;
  /** Proposed, Accepted, Superseded, Deprecated or Rejected. */
  status: string;
  /** True when the status line says a later ADR replaced part of it. */
  partlySuperseded: boolean;
}

const STATUS_WORDS = [
  "Proposed",
  "Accepted",
  "Superseded",
  "Deprecated",
  "Rejected",
] as const;

/**
 * Reads an ADR's number, title and status. The status comes from the
 * `**Status:**` line every ADR in mcp-hangar/docs carries; its first word is
 * the status and the rest is commentary ("Accepted -- partially superseded by
 * ADR-010 (…)"). An ADR without a recognisable status throws: an index that
 * prints "Unknown" for a decision's standing is worse than a failed build.
 */
export function parseDecision(doc: {
  id: string;
  data: { title: string };
  body?: string;
}): DecisionRecord {
  const number =
    /^(ADR-\d+)/.exec(doc.data.title)?.[1] ?? /(ADR-\d+)/.exec(doc.id)?.[1];
  if (!number) throw new Error(`Decision "${doc.id}" has no ADR number`);
  const line = /^\s*\*\*Status:?\*\*:?\s*(.+)$/im.exec(doc.body ?? "")?.[1];
  const status = STATUS_WORDS.find((w) =>
    new RegExp(`^${w}\\b`, "i").test(line?.trim() ?? "")
  );
  if (!line || !status) {
    throw new Error(
      `Decision "${doc.id}" has no recognisable **Status:** line ` +
        `(expected one of ${STATUS_WORDS.join(", ")})`
    );
  }
  // Backticks are markdown, and this is a plain-text title.
  const title = cleanLabel(doc.data.title)
    .replace(/^ADR-\d+:\s*/, "")
    .replace(/`/g, "");
  return {
    href: `/docs/${doc.id}`,
    number,
    title,
    status,
    partlySuperseded: status !== "Superseded" && /superseded/i.test(line),
  };
}

/**
 * Count numbered cookbook recipes (e.g. `cookbook/01-http-gateway`), excluding
 * the `cookbook/index` overview. Used by the landing page so the advertised
 * recipe count is derived from the docs collection instead of hand-maintained.
 */
export function countCookbookRecipes(docs: DocEntry[]): number {
  return docs.filter((d) => /^cookbook\/\d+-/.test(d.id)).length;
}
