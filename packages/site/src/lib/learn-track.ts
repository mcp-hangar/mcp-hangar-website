/**
 * The Learn track: its order, and where each stop hands off to the docs.
 *
 * The reading order used to live inside the hub page, where it only ever sorted
 * the grid — so the sequence existed but was invisible the moment you started
 * reading, and a page could not tell you what came next. It lives here now, and
 * both the hub and the individual pages read from it.
 *
 * Curated in one place rather than in each page's frontmatter, for the same
 * reason the hub gave originally: the whole sequence is easier to judge when you
 * can see all of it at once.
 */

/** The guided spine: Intro -> Core -> Deep, foundations -> enforcement -> async. */
export const READING_ORDER = [
    "from-install-to-a-governed-deny", // start here
    "what-is-a-policy-enforcement-plane",
    "the-request-path",
    "enforcement-plane-vs-api-gateway",
    "deterministic-not-anomaly-based",
    "costs-and-boundaries",
    "more-than-one-hangar",
    "write-your-first-mcpegresspolicy",
    "the-l7-mcpegresspolicy-language",
    "digest-pinning",
    "governance-observability",
    "the-governed-task-relay-flow",
    "mid-flight-consent",
    "govern-an-async-task-end-to-end",
    "relay-with-governance",
    "tasks-on-the-v2-sdk",
] as const;

export const START_HERE = READING_ORDER[0];

/** Position in the spine; anything unlisted sorts to the end. */
export function rank(slug: string): number {
    const i = (READING_ORDER as readonly string[]).indexOf(slug);
    return i === -1 ? Number.POSITIVE_INFINITY : i;
}

export interface DocsLink {
    href: string;
    label: string;
}

/**
 * Where a Learn page hands off when the reader wants the operational detail.
 *
 * Deliberately guides and cookbook recipes rather than ADRs. The pages already
 * cite ADRs inline, which is right for "why this was decided", but a reader who
 * has just understood a concept wants the thing they can run — the decision
 * record is not that.
 */
export const DEEPER_READING: Record<string, DocsLink[]> = {
    "from-install-to-a-governed-deny": [
        { href: "/docs/getting-started/quickstart", label: "Quickstart" },
        { href: "/docs/cookbook/24-egress-policy-language", label: "Cookbook: the egress policy language" },
    ],
    "what-is-a-policy-enforcement-plane": [
        { href: "/docs/architecture/OVERVIEW", label: "Architecture overview" },
        { href: "/docs/guides/EGRESS_POLICY", label: "Egress policy guide" },
    ],
    "the-request-path": [
        { href: "/docs/architecture/OVERVIEW", label: "Architecture overview" },
        { href: "/docs/guides/FRONT_DOOR", label: "Front door guide" },
    ],
    "enforcement-plane-vs-api-gateway": [
        { href: "/docs/guides/EGRESS_POLICY", label: "Egress policy guide" },
        { href: "/docs/cookbook/23-harden-public-gateway", label: "Cookbook: harden a public gateway" },
    ],
    "deterministic-not-anomaly-based": [
        { href: "/docs/guides/EGRESS_POLICY", label: "Egress policy guide" },
    ],
    "costs-and-boundaries": [
        { href: "/docs/cookbook/13-production-checklist", label: "Cookbook: production checklist" },
        { href: "/docs/guides/DEPLOYMENT_PLAYBOOK", label: "Deployment playbook" },
    ],
    "more-than-one-hangar": [
        { href: "/docs/cookbook/25-multiple-replicas", label: "Cookbook: running multiple replicas" },
        { href: "/docs/guides/KUBERNETES", label: "Kubernetes guide" },
    ],
    "write-your-first-mcpegresspolicy": [
        { href: "/docs/cookbook/24-egress-policy-language", label: "Cookbook: the egress policy language" },
        { href: "/docs/guides/EGRESS_POLICY", label: "Egress policy guide" },
    ],
    "the-l7-mcpegresspolicy-language": [
        { href: "/docs/guides/EGRESS_POLICY", label: "Egress policy guide" },
        { href: "/docs/reference/configuration", label: "Configuration reference" },
    ],
    "digest-pinning": [
        { href: "/docs/cookbook/18-tenant-digest-pins", label: "Cookbook: per-tenant digest pins" },
        { href: "/docs/cookbook/14-upgrade-1.3-digest-pinning", label: "Cookbook: adopting digest pinning" },
    ],
    "governance-observability": [
        { href: "/docs/guides/OBSERVABILITY", label: "Observability guide" },
        { href: "/docs/cookbook/07-observability-metrics", label: "Cookbook: metrics" },
    ],
    "the-governed-task-relay-flow": [
        { href: "/docs/guides/GOVERNED_TASKS", label: "Governed tasks guide" },
    ],
    "mid-flight-consent": [
        { href: "/docs/guides/GOVERNED_TASKS", label: "Governed tasks guide" },
        { href: "/docs/guides/APPROVAL_ADAPTERS", label: "Approval adapters guide" },
    ],
    "govern-an-async-task-end-to-end": [
        { href: "/docs/guides/GOVERNED_TASKS", label: "Governed tasks guide" },
        { href: "/docs/reference/tools", label: "MCP tool reference" },
    ],
    "relay-with-governance": [
        { href: "/docs/guides/GOVERNED_TASKS", label: "Governed tasks guide" },
    ],
    "tasks-on-the-v2-sdk": [
        { href: "/docs/guides/GOVERNED_TASKS", label: "Governed tasks guide" },
    ],
};

export interface TrackPosition {
    /** 1-based position in the spine, or null for a page outside it. */
    index: number | null;
    total: number;
    prev: string | null;
    next: string | null;
    deeper: DocsLink[];
}

/** Where `slug` sits in the track, and what it hands off to. */
export function trackPosition(slug: string): TrackPosition {
    const order = READING_ORDER as readonly string[];
    const i = order.indexOf(slug);
    return {
        index: i === -1 ? null : i + 1,
        total: order.length,
        prev: i > 0 ? order[i - 1] : null,
        next: i !== -1 && i < order.length - 1 ? order[i + 1] : null,
        deeper: DEEPER_READING[slug] ?? [],
    };
}
