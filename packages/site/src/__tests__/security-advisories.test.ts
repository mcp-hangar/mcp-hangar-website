import { describe, it, expect } from "vitest";
import { normalise, serialise } from "../../scripts/refresh-advisories.mjs";
import snapshot from "../data/security-advisories.json";

const record = (over: Record<string, unknown>) => ({
  ghsa_id: "GHSA-aaaa-bbbb-cccc",
  cve_id: null,
  state: "published",
  severity: "high",
  summary: " A thing ",
  published_at: "2026-09-15T10:00:00Z",
  withdrawn_at: null,
  html_url:
    "https://github.com/mcp-hangar/mcp-hangar/security/advisories/GHSA-aaaa-bbbb-cccc",
  vulnerabilities: [
    { vulnerable_version_range: "<= 2.19.1", patched_versions: "2.20.0" },
  ],
  ...over,
});

describe("advisory snapshot", () => {
  it("keeps published advisories only -- never drafts, triage or withdrawn ones", () => {
    const out = normalise([
      record({ ghsa_id: "GHSA-pub0-0000-0000" }),
      record({
        ghsa_id: "GHSA-draf-0000-0000",
        state: "draft",
        published_at: null,
      }),
      record({
        ghsa_id: "GHSA-tria-0000-0000",
        state: "triage",
        published_at: null,
      }),
      record({ ghsa_id: "GHSA-clos-0000-0000", state: "closed" }),
      record({
        ghsa_id: "GHSA-with-0000-0000",
        withdrawn_at: "2026-09-20T00:00:00Z",
      }),
    ]);
    expect(out.map((a: { ghsaId: string }) => a.ghsaId)).toEqual([
      "GHSA-pub0-0000-0000",
    ]);
  });

  it("reduces a record to what the site shows, newest first", () => {
    const out = normalise([
      record({
        ghsa_id: "GHSA-old0-0000-0000",
        published_at: "2026-09-12T08:00:00Z",
      }),
      record({ ghsa_id: "GHSA-new0-0000-0000" }),
    ]);
    expect(out[0]).toEqual({
      ghsaId: "GHSA-new0-0000-0000",
      cveId: null,
      severity: "high",
      summary: "A thing",
      publishedAt: "2026-09-15",
      affectedVersions: "<= 2.19.1",
      patchedVersions: "2.20.0",
      url: "https://github.com/mcp-hangar/mcp-hangar/security/advisories/GHSA-aaaa-bbbb-cccc",
    });
    expect(out[1].ghsaId).toBe("GHSA-old0-0000-0000");
  });

  it("the committed snapshot is published-only and in the script's own format", () => {
    expect(snapshot.state).toBe("published");
    expect(snapshot.advisories.length).toBeGreaterThan(0);
    for (const a of snapshot.advisories) {
      expect(a.ghsaId).toMatch(/^GHSA(-[23456789cfghjmpqrvwx]{4}){3}$/);
      expect(a.url).toBe(
        `https://github.com/mcp-hangar/mcp-hangar/security/advisories/${a.ghsaId}`
      );
    }
    // Re-serialising is a no-op: the file is exactly what the script writes.
    expect(serialise(snapshot.advisories)).toBe(
      JSON.stringify(snapshot, null, 2) + "\n"
    );
  });
});
