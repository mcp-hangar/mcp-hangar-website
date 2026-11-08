/**
 * The facts behind /compare. Every claim points at source code at a named
 * commit, never at a README. Re-verify each project quarterly and move
 * `VERIFIED` with the SHAs; a claim that cannot be re-read at the new commit
 * comes off the page.
 */

export const VERIFIED = "2026-11-08";

export type Verdict = "yes" | "partial" | "no";

export type Cell = { verdict: Verdict; note: string; href?: string };

export type Project = {
  name: string;
  repo: string;
  sha: string;
  pinning: Cell;
  approval: Cell;
  k8s: Cell;
  tenant: Cell;
  stronger: string[];
};

const blob = (repo: string, sha: string, file: string, lines?: string) =>
  `https://github.com/${repo}/blob/${sha}/${file}${lines ? `#${lines}` : ""}`;

const CORE = "mcp-hangar/mcp-hangar";
const CORE_SHA = "0d51ddae9ce81b8882144aa386b7b6a7ab15f3df";
const OP = "mcp-hangar/mcp-hangar-operator";
const OP_SHA = "e6bfa3c48b7f87ad87d0bd5018058786ee1f1d38";

export const HANGAR: Project = {
  name: "MCP Hangar",
  repo: CORE,
  sha: CORE_SHA,
  pinning: {
    verdict: "yes",
    note: "Pins name, description, inputSchema and outputSchema at approval; a drifted tool leaves tools/list and is reported as digest_drift.",
    href: blob(
      CORE,
      CORE_SHA,
      "src/mcp_hangar/application/read_models/tool_projection.py",
      "L850-L874"
    ),
  },
  approval: {
    verdict: "yes",
    note: "A tools/call is held until a person approves or denies it.",
    href: blob(
      CORE,
      CORE_SHA,
      "src/mcp_hangar/approvals/hold_registry.py",
      "L70-L81"
    ),
  },
  k8s: {
    verdict: "yes",
    note: "MCPEgressPolicy allows or denies by upstream and tool, and the operator installs a NetworkPolicy backstop on the server's pod.",
    href: blob(
      OP,
      OP_SHA,
      "api/v1alpha2/mcpegresspolicy_types.go",
      "L228-L230"
    ),
  },
  tenant: {
    verdict: "yes",
    note: "The effective tool policy is resolved per caller tenant.",
    href: blob(
      CORE,
      CORE_SHA,
      "src/mcp_hangar/domain/services/_policy_merge.py",
      "L28"
    ),
  },
  stronger: [],
};

const TH = "stacklok/toolhive";
const TH_SHA = "42cd9b7e497bfc77dc67a1e73037675247d405b1";
const KU = "Kuadrant/mcp-gateway";
const KU_SHA = "0550fbb04465f9345a7379ecfa602c3aabdf4a93";
const DO = "docker/mcp-gateway";
const DO_SHA = "7e0f34277c91855ad861eeff536b4fdc77420593";
const AG = "agentgateway/agentgateway";
const AG_SHA = "d327d10bc92bb5459482a19a79d0b3b6f83c3636";
const PL = "pipelab-org/pipelock";
const PL_SHA = "5b40a6fe8129e6ddeb0bb100fbe8cd1a435033f4";

export const ALTERNATIVES: Project[] = [
  {
    name: "ToolHive",
    repo: TH,
    sha: TH_SHA,
    pinning: {
      verdict: "no",
      note: "On tools/list_changed the cache is dropped and tools are re-read without a comparison.",
      href: blob(TH, TH_SHA, "pkg/vmcp/core/core.go", "L230-L238"),
    },
    approval: {
      verdict: "partial",
      note: "An elicitation step inside composite workflows asks the calling client; it does not hold an arbitrary tools/call.",
      href: blob(
        TH,
        TH_SHA,
        "pkg/vmcp/composer/workflow_engine.go",
        "L643-L700"
      ),
    },
    k8s: {
      verdict: "yes",
      note: "MCPAuthzConfig (Cedar or HTTP) and a toolsFilter allowlist, enforced at the gateway.",
      href: blob(
        TH,
        TH_SHA,
        "cmd/thv-operator/api/v1beta1/mcpauthzconfig_types.go",
        "L27-L44"
      ),
    },
    tenant: {
      verdict: "yes",
      note: "Cedar policies over the JWT principal and group claim, evaluated on call_tool.",
      href: blob(
        TH,
        TH_SHA,
        "pkg/authz/authorizers/cedar/core.go",
        "L280-L295"
      ),
    },
    stronger: [
      "A broad server catalog, shipped as its own module.",
      "Standalone quickstarts: thv run starts a server on a local container runtime, no Kubernetes needed.",
      "An operator with many CRDs, composite tools and a choice of Cedar or HTTP authorization.",
    ],
  },
  {
    name: "Kuadrant mcp-gateway",
    repo: KU,
    sha: KU_SHA,
    pinning: {
      verdict: "no",
      note: "Its only SHA-256 uses are session-id log hashing and key derivation.",
    },
    approval: {
      verdict: "no",
      note: "URL elicitation collects per-user credentials only.",
      href: blob(KU, KU_SHA, "api/v1/types.go", "L118"),
    },
    k8s: {
      verdict: "partial",
      note: "The router exposes server and tool names as headers a Kuadrant AuthPolicy can match; the per-tool tools/call rule ships as a sample.",
      href: blob(
        KU,
        KU_SHA,
        "config/samples/oauth-token-exchange/tools-call-auth.yaml",
        "L73-L80"
      ),
    },
    tenant: {
      verdict: "yes",
      note: "Per-user tool sets from JWT roles, through Kuadrant and Authorino.",
      href: blob(KU, KU_SHA, "config/e2e/auth/mcp-auth-policy.yaml", "L28-L47"),
    },
    stronger: [
      "Native to Gateway API and Envoy; reuses existing AuthPolicy, OPA and token-exchange patterns.",
      "MCPVirtualServer curates which tools are exposed.",
    ],
  },
  {
    name: "docker/mcp-gateway",
    repo: DO,
    sha: DO_SHA,
    pinning: {
      verdict: "no",
      note: "Digest pinning covers OCI images, not tool definitions.",
      href: blob(DO, DO_SHA, "pkg/workingset/workingset.go", "L635-L644"),
    },
    approval: {
      verdict: "no",
      note: "The only elicitation asks whether to open a browser for OAuth.",
      href: blob(DO, DO_SHA, "pkg/gateway/mcpadd.go", "L510-L512"),
    },
    k8s: {
      verdict: "no",
      note: "Not a Kubernetes project; allowHosts is host-based.",
      href: blob(DO, DO_SHA, "pkg/gateway/clientpool.go", "L535-L537"),
    },
    tenant: {
      verdict: "no",
      note: "The policy request carries no caller identity in the open-source code.",
      href: blob(DO, DO_SHA, "pkg/policy/policy.go", "L42-L60"),
    },
    stronger: [
      "Image signature verification and per-server network blocking with host proxies.",
      "A secrets-blocking interceptor, profiles pinned by OCI digest, and the Docker catalog.",
    ],
  },
  {
    name: "agentgateway",
    repo: AG,
    sha: AG_SHA,
    pinning: {
      verdict: "no",
      note: "No digest over tools; list_changed notifications are forwarded.",
    },
    approval: {
      verdict: "no",
      note: "No approval code; elicitation is passed through.",
      href: blob(
        AG,
        AG_SHA,
        "crates/agentgateway/src/mcp/session.rs",
        "L842-L846"
      ),
    },
    k8s: {
      verdict: "yes",
      note: "AgentgatewayPolicy backend.mcp.authorization filters lists and rejects call_tool, at the gateway.",
      href: blob(AG, AG_SHA, "crates/agentgateway/src/mcp/rbac.rs", "L53-L63"),
    },
    tenant: {
      verdict: "yes",
      note: "CEL rules over the tool name and JWT claims.",
      href: blob(AG, AG_SHA, "crates/agentgateway/src/mcp/rbac.rs", "L248"),
    },
    stronger: [
      "A high-throughput Rust data plane for MCP, A2A and LLM traffic.",
      "OpenAPI-to-MCP upstreams and MCP guardrail processors in the CRD.",
    ],
  },
  {
    name: "pipelock",
    repo: PL,
    sha: PL_SHA,
    pinning: {
      verdict: "partial",
      note: "Hashes the whole tool and, separately, everything but the description; the baseline is the first tools/list seen, and the default action is warn.",
      href: blob(PL, PL_SHA, "internal/mcp/tools/drift_cues.go", "L19-L43"),
    },
    approval: {
      verdict: "yes",
      note: "A defer action holds the call until an operator approves or denies it over the API.",
      href: blob(PL, PL_SHA, "internal/proxy/deferred_api.go", "L147-L150"),
    },
    k8s: {
      verdict: "no",
      note: "Configured in YAML; no CRD in its charts.",
    },
    tenant: {
      verdict: "partial",
      note: "Per-agent tool policy overrides, behind a licensed feature.",
      href: blob(PL, PL_SHA, "internal/config/schema.go", "L1871-L1884"),
    },
    stronger: [
      "Splits a structural digest from the description and classifies drift by cue: egress URL, agent directive, concealment, cross-tool reference and more.",
      "A durable, journalled hold for deferred calls, signed action receipts, and DLP and response scanning.",
    ],
  },
];

export const CAPABILITIES = [
  {
    key: "pinning",
    label: "Tool-contract pinning",
    detail:
      "A digest of each tool's definition is recorded at approval, and a changed tool is refused or withheld.",
  },
  {
    key: "approval",
    label: "Call-path approval gate",
    detail: "A person can hold a specific tools/call until they approve it.",
  },
  {
    key: "k8s",
    label: "MCP-semantic policy as a Kubernetes object",
    detail:
      "A CRD or Gateway API policy allows or denies by MCP server and tool, not only by host and port.",
  },
  {
    key: "tenant",
    label: "Per-tenant policy",
    detail:
      "Tool access differs per tenant, team or identity in one deployment.",
  },
] as const;
