import { describe, it, expect } from "vitest";
import matter from "gray-matter";
import { TOOL_ACCESS_SNIPPET } from "../lib/home-snippets";

// gray-matter's front-matter engine is js-yaml; parsing the snippet as front
// matter is the YAML parser the site already has, without a new dependency.
function parseYaml(source: string): Record<string, unknown> {
  return matter(`---\n${source}\n---\n`).data;
}

// Python's fnmatch for the subset the snippet uses: `*`, `?` and literals.
// Core matches each pattern against the whole upstream tool name.
function fnmatch(name: string, pattern: string): boolean {
  const re = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".");
  return new RegExp(`^${re}$`).test(name);
}

describe("homepage tool-access snippet", () => {
  const parsed = parseYaml(TOOL_ACCESS_SNIPPET) as {
    mcp_servers: Record<
      string,
      { tools: { allow_list: string[]; approval_list: string[] } }
    >;
  };
  const servers = Object.entries(parsed.mcp_servers);

  it("is a server's `tools:` block, the shape core parses", () => {
    expect(servers).toHaveLength(1);
    const [, server] = servers[0];
    expect(Object.keys(server.tools).sort()).toEqual([
      "allow_list",
      "approval_list",
    ]);
    expect(Array.isArray(server.tools.allow_list)).toBe(true);
    expect(Array.isArray(server.tools.approval_list)).toBe(true);
  });

  it("uses bare upstream tool names, never `<server>.<tool>`", () => {
    for (const [id, server] of servers) {
      for (const pattern of [
        ...server.tools.allow_list,
        ...server.tools.approval_list,
      ]) {
        expect(pattern.startsWith(`${id}.`), pattern).toBe(false);
        expect(pattern, pattern).not.toContain(".");
      }
    }
  });

  it("lets reads through and holds create_issue, as the card says", () => {
    const [, { tools }] = servers[0];
    const allowed = (n: string) => tools.allow_list.some((p) => fnmatch(n, p));
    const held = (n: string) => tools.approval_list.some((p) => fnmatch(n, p));
    expect(allowed("get_issue")).toBe(true);
    expect(allowed("list_issues")).toBe(true);
    expect(held("create_issue")).toBe(true);
    expect(allowed("delete_repository") || held("delete_repository")).toBe(
      false
    );
  });
});
