import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import {
  LINKS,
  INSTALL_COMMAND,
  DOCS_BASE,
  BRAND,
  CATEGORY,
  DESCRIPTION,
  HERO_SUB,
} from "../config";

describe("config", () => {
  it("exports INSTALL_COMMAND containing pip", () => {
    expect(INSTALL_COMMAND).toContain("pip");
    expect(INSTALL_COMMAND).toContain("mcp-hangar");
  });

  it("exports LINKS with expected keys", () => {
    expect(LINKS.github).toContain("github.com");
    expect(LINKS.ossQuickstart).toContain(DOCS_BASE);
    expect(LINKS.ossDocs).toContain("/docs/");
    expect(LINKS.blog).toContain("/blog/");
    expect(LINKS.pypi).toContain("pypi.org");
  });

  it("links the changelog to core's releases, not the docs repo's changelog", () => {
    expect(LINKS.changelog).toBe(
      "https://github.com/mcp-hangar/mcp-hangar/releases"
    );
  });

  it("LINKS are all strings", () => {
    for (const [, value] of Object.entries(LINKS)) {
      expect(typeof value).toBe("string");
    }
  });

  // Redesign decision D2, verbatim. A rewording is a positioning change and
  // should fail here first.
  it("states the one self-description the maintainer chose", () => {
    expect(HERO_SUB).toBe(
      "Hangar is the runtime security and governance layer between your agents and your MCP servers: identity, policy, approvals and an audit record for every call. Runs on a laptop, a VM, or Kubernetes."
    );
    expect(DESCRIPTION).toBe(HERO_SUB.replace(/^Hangar/, BRAND));
    expect(BRAND).toBe("MCP Hangar");
    expect(CATEGORY).not.toMatch(/kubernetes|control plane/i);
  });

  // The root package.json cannot import config.ts, so this keeps it honest.
  it("describes the site in the root package.json with the same words", () => {
    const pkg = JSON.parse(
      readFileSync(new URL("../../../../package.json", import.meta.url), "utf8")
    );
    expect(pkg.description).toContain(
      "the runtime security and governance layer between your agents and your MCP servers"
    );
    expect(pkg.description).not.toMatch(/control plane/i);
  });
});
