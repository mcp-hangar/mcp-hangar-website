/** Shared configuration constants used across the marketing site. */

/**
 * Current released version of mcp-hangar, shown across the marketing site
 * (hero badge/button, footer, quick-start output, structured data).
 * Bump this in one place when a new release ships.
 */
export const VERSION = "1.4.0";

/** Version prefixed with a leading "v", e.g. "v1.4.0". */
export const VERSION_TAG = `v${VERSION}`;

/** Base URL for the docs. */
export const DOCS_BASE = "/docs";

/** External links used in multiple places. */
export const LINKS = {
    github: "https://github.com/mcp-hangar/mcp-hangar",
    pypi: "https://pypi.org/project/mcp-hangar/",
    ossQuickstart: `${DOCS_BASE}/getting-started/quickstart`,
    ossDocs: `${DOCS_BASE}/`,
    blog: `${DOCS_BASE}/blog/`,
    changelog: `${DOCS_BASE}/changelog`,
} as const;

/** The install command shown in the landing page. */
export const INSTALL_COMMAND = "pip install mcp-hangar";

/** Alternative install commands for the quick start section. */
export const INSTALL_COMMANDS = {
    pip: "pip install mcp-hangar",
    uv: "uv pip install mcp-hangar",
    curl: "curl -sSL https://mcp-hangar.io/install.sh | bash",
} as const;

