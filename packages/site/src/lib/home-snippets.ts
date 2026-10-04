/**
 * The homepage's "Govern who calls what" snippet, kept outside the component so
 * a test can parse it.
 *
 * Patterns are matched with `fnmatch` against the upstream server's own tool
 * name -- `get_issue`, not `github.get_issue`. The server is already named by
 * the key the block sits under, and core never strips or adds a prefix, so a
 * qualified pattern matches nothing and hides every tool. This snippet shipped
 * that way once; `src/__tests__/home-snippets.test.ts` keeps it from coming back.
 *
 * `create_issue` is not on the allow list and does not need to be:
 * `approval_list` outranks `allow_list`, so a tool on it stays visible and is
 * held for a human (reference/configuration, "Holding a tool for a human").
 */
export const TOOL_ACCESS_SNIPPET = `mcp_servers:
  github:
    tools:
      allow_list: ["get_*", "list_*"]
      approval_list: ["create_issue"]`;
