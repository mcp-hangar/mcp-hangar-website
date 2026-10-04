#!/usr/bin/env node
/**
 * Refresh the snapshot of MCP Hangar's published security advisories.
 *
 * /security and the CVE ledger list core's GitHub Security Advisories
 * (mcp-hangar/mcp-hangar). They read `src/data/security-advisories.json`,
 * committed, so a build never depends on the network or on GitHub's rate
 * limit. This script is what moves that file. `refresh-advisories.yml` runs it
 * daily and opens a PR when the list changed.
 *
 * Published advisories only. The query asks for `state=published` and each
 * record's own `state` is checked again here, because the token that runs this
 * can see drafts and triage reports, and nothing in those may reach a public
 * page. Withdrawn advisories are dropped as well.
 *
 * The output carries no fetch timestamp on purpose: an unchanged list writes
 * an identical file, so the daily job opens a PR only when something changed.
 *
 * Usage:
 *   node scripts/refresh-advisories.mjs            write the snapshot
 *   node scripts/refresh-advisories.mjs --check    exit 1 if it is stale
 *
 * Uses GH_TOKEN or GITHUB_TOKEN when set; published advisories on a public
 * repository are readable without one, at a lower rate limit.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const REPO = "mcp-hangar/mcp-hangar";
const API = `https://api.github.com/repos/${REPO}/security-advisories`;
const OUT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/data/security-advisories.json"
);

/** Reduce the API's records to what the site shows, published ones only. */
export function normalise(records) {
  return records
    .filter((a) => a.state === "published" && a.published_at && !a.withdrawn_at)
    .map((a) => {
      const vulns = a.vulnerabilities ?? [];
      const join = (key) =>
        [...new Set(vulns.map((v) => v[key]).filter(Boolean))].join(", ") ||
        null;
      return {
        ghsaId: a.ghsa_id,
        cveId: a.cve_id || null,
        severity: a.severity || "unknown",
        summary: a.summary.trim(),
        publishedAt: a.published_at.slice(0, 10),
        affectedVersions: join("vulnerable_version_range"),
        patchedVersions: join("patched_versions"),
        url: a.html_url,
      };
    })
    .sort(
      (x, y) =>
        y.publishedAt.localeCompare(x.publishedAt) ||
        x.ghsaId.localeCompare(y.ghsaId)
    );
}

export function serialise(advisories) {
  return (
    JSON.stringify(
      { repository: REPO, state: "published", advisories },
      null,
      2
    ) + "\n"
  );
}

async function fetchAll() {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const records = [];
  let url = `${API}?state=published&per_page=100`;
  while (url) {
    const res = await globalThis.fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`${url}: ${res.status} ${await res.text()}`);
    }
    records.push(...(await res.json()));
    const next = /<([^>]+)>;\s*rel="next"/.exec(res.headers.get("link") ?? "");
    url = next ? next[1] : null;
  }
  return records;
}

async function main() {
  const next = serialise(normalise(await fetchAll()));
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (process.argv.includes("--check")) {
    if (next !== current) {
      console.error(
        `${path.relative(process.cwd(), OUT)} is stale; run without --check.`
      );
      process.exit(1);
    }
    console.log("Advisory snapshot is current.");
    return;
  }
  fs.writeFileSync(OUT, next);
  const count = JSON.parse(next).advisories.length;
  console.log(
    `${count} published advisories -> ${path.relative(process.cwd(), OUT)}`
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
