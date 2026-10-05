import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { compile } from "@mdx-js/mdx";
import matter from "gray-matter";
import {
  MARKER,
  escapeMdx,
  extractUpgradeSection,
  parseReleaseBody,
  renderPost,
  slugFor,
} from "../../scripts/release-post.mjs";

// Fixtures trimmed from core's real v2.24.0 and v2.6.0 release notes and
// UPGRADE.md, with the characters MDX chokes on added where prose has them.
const FIX = path.resolve(__dirname, "fixtures/release-post");
const release = JSON.parse(
  fs.readFileSync(path.join(FIX, "release-2.24.0.json"), "utf8")
);
const oldBody = fs.readFileSync(
  path.join(FIX, "release-2.6.0-body.md"),
  "utf8"
);
const upgradeMd = fs.readFileSync(path.join(FIX, "UPGRADE.md"), "utf8");

describe("parseReleaseBody", () => {
  it("keeps the change sections and drops Installation and Links", () => {
    const sections = parseReleaseBody(release.body);
    expect(sections.map((s: { title: string }) => s.title)).toEqual([
      "Added",
      "Fixed",
      "Security",
    ]);
    const all = JSON.stringify(sections);
    expect(all).not.toContain("pip install");
    expect(all).not.toContain("PyPI Package");
  });

  it("splits an item into its scope and text, joining wrapped lines", () => {
    const [added] = parseReleaseBody(release.body);
    expect(added.items).toHaveLength(2);
    expect(added.items[0].scope).toBe("core");
    expect(added.items[0].text).toMatch(
      /^a running gateway now shows .* Every tool in `hangar_tools`, `GET \/api\/tools`/
    );
    expect(added.items[0].text).toContain("([#1646](");
    expect(added.items[1].scope).toBe("observability");
  });

  it("keeps an item with no scope", () => {
    const fixed = parseReleaseBody(release.body)[1];
    expect(fixed.items[1]).toEqual({
      scope: null,
      text: "An item with no scope.",
    });
  });

  it("reads the pre-2.7 format, headed by the compare link, with * bullets", () => {
    const sections = parseReleaseBody(oldBody);
    expect(sections.map((s: { title: string }) => s.title)).toEqual([
      "Added",
      "Fixed",
    ]);
    expect(sections[1].items[0].scope).toBe("core");
  });
});

describe("extractUpgradeSection", () => {
  it("takes one version's section, up to the next ## heading", () => {
    const s = extractUpgradeSection(upgradeMd, "2.24.0")!;
    expect(s).toMatch(/^### `batch_call_refused` from a gate/);
    expect(s).toContain("caller_ids: true");
    expect(s).not.toContain("tools.listChanged");
  });

  it("drops HTML comments, which MDX cannot compile", () => {
    expect(extractUpgradeSection(upgradeMd, "2.24.0")).not.toContain("<!--");
  });

  it("reads the older `## 2.6.0 — ...` heading style", () => {
    expect(extractUpgradeSection(upgradeMd, "2.6.0")).toMatch(
      /^### 1\. Per-tenant digest pins/
    );
  });

  it("does not take 2.24.0's section for 2.2.0, and answers null when there is none", () => {
    expect(extractUpgradeSection(upgradeMd, "2.2.0")).toBeNull();
    expect(extractUpgradeSection(upgradeMd, "2.4.0")).toBeNull();
  });
});

describe("escapeMdx", () => {
  it("escapes braces and < in prose, and leaves code spans and fences alone", () => {
    const md =
      "a <= b in {x} and `GET /x/{id}`\n```yaml\nk: {v}\n```\nafter {y}";
    expect(escapeMdx(md)).toBe(
      "a \\<= b in \\{x\\} and `GET /x/{id}`\n```yaml\nk: {v}\n```\nafter \\{y\\}"
    );
  });
});

describe("renderPost", () => {
  const mdx = renderPost({
    version: "2.24.0",
    publishedAt: release.publishedAt,
    sections: parseReleaseBody(release.body),
    upgrade: extractUpgradeSection(upgradeMd, "2.24.0"),
  });
  const { data, content } = matter(mdx);

  it("is a draft, with the blog collection's frontmatter", () => {
    expect(data.draft).toBe(true);
    expect(typeof data.title).toBe("string");
    expect(typeof data.description).toBe("string");
    expect(data.author).toBe("MCP Hangar Team");
    expect(new Date(data.date).toISOString().slice(0, 10)).toBe("2026-10-04");
    expect(data.tags).toEqual(["mcp", "mcp-hangar", "release"]);
    // A tag matching /advisor/ would draw the post's card as an advisory.
    expect(data.tags.some((t: string) => /advisor/i.test(t))).toBe(false);
    expect(data.advisory).toBeUndefined();
  });

  it("marks every place a person has to write", () => {
    expect(data.title).toContain(MARKER);
    expect(data.description).toContain(MARKER);
    expect(content).toContain(`${MARKER}: the opening`);
  });

  it("lays out the release's sections, the upgrade notes and the install line", () => {
    const headings = content.match(/^##+ .*$/gm);
    expect(headings).toEqual([
      "## Added",
      "## Fixed",
      "## Security",
      "## Upgrading",
      "### `batch_call_refused` from a gate no longer carries `error`",
      "## Get it",
    ]);
    expect(content).toContain("pip install --upgrade mcp-hangar==2.24.0");
    expect(content).toContain(
      "https://github.com/mcp-hangar/mcp-hangar/releases/tag/v2.24.0"
    );
  });

  it("compiles as MDX, braces and comparisons included", async () => {
    await expect(compile(content)).resolves.toBeTruthy();
  });

  it("would not compile without the escaping -- the fixture exercises it", async () => {
    await expect(
      compile(parseReleaseBody(release.body)[1].items[0].text)
    ).rejects.toThrow();
  });

  it("says so when core has no upgrade notes for the version", () => {
    const none = renderPost({
      version: "2.17.1",
      publishedAt: "2026-09-02T10:00:00Z",
      sections: [],
      upgrade: null,
    });
    expect(none).toContain(
      `${MARKER}: core's UPGRADE.md has no section for 2.17.1`
    );
  });
});

describe("slugFor", () => {
  it("dates the file and dashes the version, like the existing release posts", () => {
    expect(slugFor("2.24.0", "2026-10-04T15:15:31Z")).toBe(
      "2026-10-04-v2-24-0-release"
    );
  });
});
