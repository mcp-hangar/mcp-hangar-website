import { describe, it, expect } from "vitest";
import fg from "fast-glob";
import path from "node:path";
import { createRequire } from "node:module";
import {
  buildDecisionsNav,
  buildDocsNav,
  countCookbookRecipes,
  parseDecision,
  type DocEntry,
} from "../docsNav";
import { isPublished } from "../lib/docs-publication";

/** Minimal collection-entry factory. */
function doc(
  id: string,
  title?: string,
  sidebar?: DocEntry["data"]["sidebar"]
): DocEntry {
  return { id, data: { title: title ?? id, sidebar } };
}

/** Representative slice of the real docs collection. */
const BASE: DocEntry[] = [
  doc("getting-started/quickstart", "Quick Start"),
  doc("getting-started/installation", "Installation"),
  doc("guides/HTTP_TRANSPORT", "HTTP Transport for Remote MCP servers"),
  doc("guides/AUTHENTICATION", "Authentication"),
  doc("cookbook/index", "Cookbook"),
  doc("cookbook/01-http-gateway", "01 — HTTP Gateway"),
  doc("cookbook/02-health-checks", "02 — Health Checks"),
  doc("adr/ADR-001-cqrs", "ADR-001: CQRS"),
  doc("reference/cli", "CLI"),
];

describe("buildDocsNav", () => {
  it("keeps prev/next flat list identical to the flattened sidebar (no drift)", () => {
    const { sections, flat } = buildDocsNav(BASE);
    const fromSections = sections.flatMap((s) => s.links);
    expect(flat).toEqual(fromSections);
  });

  it("auto-includes a new doc without any config change", () => {
    const withNew = [
      ...BASE,
      doc("cookbook/20-readonly-controlled-write", "20 — Read-Only Rootfs"),
    ];
    const { flat } = buildDocsNav(withNew);
    const hrefs = flat.map((l) => l.href);
    expect(hrefs).toContain("/docs/cookbook/20-readonly-controlled-write");
  });

  it("appends new numbered docs after the pinned ones in natural order", () => {
    const withNew = [
      ...BASE,
      doc("cookbook/20-readonly-controlled-write", "20"),
      doc("cookbook/10-discovery-docker", "10"),
    ];
    const { sections } = buildDocsNav(withNew);
    const cookbook = sections.find((s) => s.title === "Cookbook")!;
    const ids = cookbook.links.map((l) => l.href.replace("/docs/", ""));
    // Overview + pinned 01,02 first (from EXPLICIT_ORDER), then 10, then 20.
    expect(ids).toEqual([
      "cookbook/index",
      "cookbook/01-http-gateway",
      "cookbook/02-health-checks",
      "cookbook/10-discovery-docker",
      "cookbook/20-readonly-controlled-write",
    ]);
  });

  it("excludes hidden pages even when present in the collection", () => {
    const withHidden = [
      ...BASE,
      doc("code-of-conduct", "Code of Conduct"),
      // The docs repo's changelog, not the product's (see HIDDEN_IDS).
      doc("changelog", "Changelog"),
    ];
    const { flat } = buildDocsNav(withHidden);
    const hrefs = flat.map((l) => l.href);
    expect(hrefs).not.toContain("/docs/code-of-conduct");
    expect(hrefs).not.toContain("/docs/changelog");
  });

  it("renders sections in the configured order", () => {
    const { sections } = buildDocsNav(BASE);
    const titles = sections.map((s) => s.title);
    // ADRs are not a docs section any more: they are Decisions (D3).
    expect(titles).toEqual(["Start", "Guides", "Cookbook", "Reference"]);
  });

  it("routes an unknown top-level directory into a fallback section, never dropping it", () => {
    const { sections, flat } = buildDocsNav([
      ...BASE,
      doc("tutorials/first-agent", "First Agent"),
    ]);
    const fallback = sections.find((s) => s.title === "Tutorials");
    expect(fallback).toBeDefined();
    expect(flat.map((l) => l.href)).toContain("/docs/tutorials/first-agent");
  });

  it("prefers curated label, then sidebar.label, then the doc title", () => {
    const docs = [
      doc("guides/HTTP_TRANSPORT", "HTTP Transport for Remote MCP servers"), // curated override wins
      doc("guides/NEW_WITH_FRONTMATTER", "Long Prose Title", {
        label: "Short",
      }),
      doc("guides/NEW_PLAIN", "Plain Title"),
    ];
    const { flat } = buildDocsNav(docs);
    const byHref = Object.fromEntries(flat.map((l) => [l.href, l.label]));
    expect(byHref["/docs/guides/HTTP_TRANSPORT"]).toBe("HTTP Transport");
    expect(byHref["/docs/guides/NEW_WITH_FRONTMATTER"]).toBe("Short");
    expect(byHref["/docs/guides/NEW_PLAIN"]).toBe("Plain Title");
  });

  it("tidies fallback labels: strips the ordering prefix and any -- subtitle", () => {
    const docs = [
      doc("cookbook/05-load-balancing", "05 -- Load Balancing"),
      doc("cookbook/01-http-gateway", "01 — HTTP Gateway"),
      doc("guides/SOMETHING", "Feature Name -- with a long subtitle"),
      doc("guides/HYPHENATED", "Read-Only Rootfs"),
    ];
    const { flat } = buildDocsNav(docs);
    const byHref = Object.fromEntries(flat.map((l) => [l.href, l.label]));
    expect(byHref["/docs/cookbook/05-load-balancing"]).toBe("Load Balancing");
    expect(byHref["/docs/cookbook/01-http-gateway"]).toBe("HTTP Gateway");
    expect(byHref["/docs/guides/SOMETHING"]).toBe("Feature Name");
    expect(byHref["/docs/guides/HYPHENATED"]).toBe("Read-Only Rootfs"); // single hyphen in a word preserved
  });

  it("counts numbered cookbook recipes, excluding the overview and non-cookbook docs", () => {
    const docs = [
      doc("cookbook/index", "Overview"),
      doc("cookbook/01-http-gateway", "01"),
      doc("cookbook/02-health-checks", "02"),
      doc("cookbook/23-harden-public-gateway", "23"),
      doc("guides/HTTP_TRANSPORT", "not a recipe"),
    ];
    expect(countCookbookRecipes(docs)).toBe(3);
  });

  it("groups operating material under Operate and the security pages under Security", () => {
    const opsDocs = [
      doc("operations/COMPLIANCE", "Compliance"),
      doc("observability/otel-integrations", "OTel"),
      doc("runbooks/not-responding", "Not responding"),
      doc("upgrade", "Upgrade"),
      doc("security", "Security Policy"),
      doc("security/AUTH_SECURITY_AUDIT", "Audit"),
      doc("architecture/OVERVIEW", "Overview"),
    ];
    const { sections } = buildDocsNav(opsDocs);
    const hrefs = (title: string) =>
      sections.find((s) => s.title === title)!.links.map((l) => l.href);
    expect(hrefs("Operate")).toEqual([
      "/docs/upgrade",
      "/docs/operations/COMPLIANCE",
      "/docs/observability/otel-integrations",
      "/docs/runbooks/not-responding",
    ]);
    expect(hrefs("Security")).toEqual([
      "/docs/security",
      "/docs/security/AUTH_SECURITY_AUDIT",
    ]);
    expect(hrefs("Reference")).toEqual(["/docs/architecture/OVERVIEW"]);
  });

  it("keeps ADRs out of the docs sidebar and pager, and pages them on their own", () => {
    const docs = [
      ...BASE,
      doc(
        "adr/ADR-010-retire-agent-cloud-tier",
        "ADR-010: Retire the Agent -- why"
      ),
      doc("adr/ADR-002-event-sourcing", "ADR-002: Event Sourcing"),
    ];
    const { flat } = buildDocsNav(docs);
    expect(flat.some((l) => l.href.startsWith("/docs/adr/"))).toBe(false);
    expect(buildDecisionsNav(docs)).toEqual([
      { href: "/docs/adr/ADR-001-cqrs", label: "ADR-001 CQRS" },
      {
        href: "/docs/adr/ADR-002-event-sourcing",
        label: "ADR-002 Event Sourcing",
      },
      {
        href: "/docs/adr/ADR-010-retire-agent-cloud-tier",
        label: "ADR-010 Retire the Agent",
      },
    ]);
  });
});

describe("parseDecision", () => {
  const adr = (title: string, status: string) => ({
    id: "adr/ADR-004-x",
    data: { title },
    body: `# ${title}\n\n**Status:** ${status}\n\n## Context\n`,
  });

  it("reads number, title and the first word of the status line", () => {
    expect(
      parseDecision(adr("ADR-004: Digest Pinning -- and more", "Accepted"))
    ).toEqual({
      href: "/docs/adr/ADR-004-x",
      number: "ADR-004",
      title: "Digest Pinning",
      status: "Accepted",
      partlySuperseded: false,
    });
  });

  it("flags a record a later ADR partly replaced", () => {
    const d = parseDecision(
      adr(
        "ADR-004: X",
        "Accepted — partially superseded by [ADR-010](ADR-010.md)"
      )
    );
    expect(d.status).toBe("Accepted");
    expect(d.partlySuperseded).toBe(true);
    const gone = parseDecision(adr("ADR-004: X", "Superseded by ADR-018"));
    expect(gone.status).toBe("Superseded");
    expect(gone.partlySuperseded).toBe(false);
    expect(parseDecision(adr("ADR-004: X", "Proposed")).status).toBe(
      "Proposed"
    );
  });

  it("fails rather than print an unknown status", () => {
    expect(() => parseDecision(adr("ADR-004: X", "Pondering"))).toThrow(
      /Status/
    );
    expect(() =>
      parseDecision({
        id: "adr/ADR-004-x",
        data: { title: "ADR-004: X" },
        body: "",
      })
    ).toThrow(/Status/);
  });
});

// Against the docs actually pinned, not a fixture: every published page lands
// in one of the curated sections (no fallback section named after a folder),
// and every ADR has a status the Decisions index can print.
describe("the pinned docs", () => {
  const require = createRequire(import.meta.url);
  const dir = path.dirname(require.resolve("@mcp-hangar/docs/package.json"));
  const ids = fg
    .sync("**/*.md", { cwd: dir })
    .map((f) => f.replace(/\.md$/, ""))
    .filter(isPublished);

  it("fall into the curated sections, with nothing in a fallback", () => {
    const { sections } = buildDocsNav(ids.map((id) => doc(id)));
    expect(sections.map((s) => s.title)).toEqual([
      "Start",
      "Guides",
      "Cookbook",
      "Reference",
      "Operate",
      "Security",
    ]);
  });

  it("give every ADR a status", async () => {
    const fs = await import("node:fs/promises");
    const adrs = ids.filter((id) => id.startsWith("adr/"));
    expect(adrs.length).toBeGreaterThan(20);
    for (const id of adrs) {
      const body = await fs.readFile(path.join(dir, `${id}.md`), "utf8");
      const title = /^#\s+(.+)$/m.exec(body)![1];
      expect(
        () => parseDecision({ id, data: { title }, body }),
        id
      ).not.toThrow();
    }
  });
});
