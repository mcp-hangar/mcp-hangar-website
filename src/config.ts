/** Shared configuration constants used across the marketing site. */

/** Base URL for the Hangar Cloud web application. */
export const CLOUD_APP_URL = "https://app.mcp-hangar.io";

/** Base URL for the OSS docs (VitePress). */
export const DOCS_BASE = "/docs";

/** External links used in multiple places. */
export const LINKS = {
    github: "https://github.com/mcp-hangar/mcp-hangar",
    pypi: "https://pypi.org/project/mcp-hangar/",
    cloudWaitlist: "/waitlist",
    earlyAccess: "/waitlist?plan=pro",
    ossQuickstart: `${DOCS_BASE}/oss/getting-started/quickstart`,
    cloudDocs: `${DOCS_BASE}/cloud/`,
    ossDocs: `${DOCS_BASE}/oss/`,
    blog: `${DOCS_BASE}/blog/`,
    changelog: `${DOCS_BASE}/oss/changelog`,
} as const;

/** The install command shown in the landing page. */
export const INSTALL_COMMAND = "pip install mcp-hangar";

/** Alternative install commands for the quick start section. */
export const INSTALL_COMMANDS = {
    pip: "pip install mcp-hangar",
    uv: "uv pip install mcp-hangar",
    curl: "curl -sSL https://mcp-hangar.io/install.sh | bash",
} as const;

