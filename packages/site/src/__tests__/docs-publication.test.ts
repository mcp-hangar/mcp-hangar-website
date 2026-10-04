import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import fg from "fast-glob";
import {
  githubUrlFor,
  isPublished,
  isUnpublished,
} from "../lib/docs-publication";

const require = createRequire(import.meta.url);
const docsDir = path.dirname(require.resolve("@mcp-hangar/docs/package.json"));
const repoIds = fg
  .sync("**/*.md", { cwd: docsDir })
  .map((f) => f.replace(/\.md$/, ""));
const vercel = JSON.parse(
  fs.readFileSync(new URL("../../../../vercel.json", import.meta.url), "utf8")
) as { redirects: { source: string; destination: string }[] };

describe("which docs pages the site publishes", () => {
  it("keeps contributor and process pages on GitHub (redesign D3)", () => {
    for (const id of [
      "development/GIT_FLOW",
      "development/EPIC_PLAYBOOK",
      "development/SOMETHING_NEW",
      "runbooks/RELEASE",
      "testing/approval-gate-manual-testing",
      "CONTRIBUTING",
    ]) {
      expect(isUnpublished(id), id).toBe(true);
      expect(isPublished(id), id).toBe(false);
    }
    for (const id of [
      "getting-started/quickstart",
      "runbooks/not-responding",
      "adr/ADR-014-tasks-relay-with-governance",
      "security/VERDICT_LIMITS",
      "upgrade",
    ]) {
      expect(isPublished(id), id).toBe(true);
    }
    expect(isPublished("adr/README")).toBe(false);
    expect(isPublished("index")).toBe(false);
  });

  // An unpublished page had a URL until now, and someone has it bookmarked.
  // Every one in the pinned docs must redirect, page and .md twin alike, to
  // the same file on GitHub -- a 404 is not an acceptable way to move it.
  it("redirects every unpublished page and its .md twin to the file on GitHub", () => {
    const unpublished = repoIds.filter(isUnpublished);
    expect(unpublished.length).toBeGreaterThanOrEqual(10);
    const bySource = new Map(
      vercel.redirects.map((r) => [r.source, r.destination])
    );
    for (const id of unpublished) {
      expect(bySource.get(`/docs/${id}`), id).toBe(githubUrlFor(id));
      expect(bySource.get(`/docs/${id}.md`), `${id}.md`).toBe(githubUrlFor(id));
    }
  });
});
