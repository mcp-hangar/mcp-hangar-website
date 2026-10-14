#!/usr/bin/env node
/**
 * Compare the site's advertised version with PyPI (#336).
 *
 * `VERSION` in src/config.ts is the one place the site takes a version from:
 * the hero, the footer, the quick start, the structured data and llms.txt all
 * read it. sync-core-version.yml moves it when core releases. This checks the
 * value against what `pip install mcp-hangar` actually resolves to:
 *
 * - not a published, unyanked, stable release on PyPI: exit 1. The site would
 *   advertise an install that does not produce it.
 * - older than PyPI's latest: a warning, exit 0. A release lands before its
 *   sync PR does, and a pull request opened in that window is not at fault.
 *   `--strict` makes it an error, for a run that should already be current.
 *
 * Usage:
 *   node scripts/check-version.mjs [--strict]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const config = fs.readFileSync(
  path.join(here, "..", "src", "config.ts"),
  "utf8"
);
const match = config.match(/export const VERSION = "([^"]+)";/);
if (!match) {
  console.error("check-version: no `export const VERSION` in src/config.ts");
  process.exit(1);
}
const site = match[1];
const strict = process.argv.includes("--strict");

const response = await globalThis.fetch(
  "https://pypi.org/pypi/mcp-hangar/json"
);
if (!response.ok) {
  console.error(`check-version: PyPI answered ${response.status}`);
  process.exit(1);
}
const pypi = await response.json();
const latest = pypi.info.version;
const files = pypi.releases[site];

if (!files || files.length === 0 || files.every((f) => f.yanked)) {
  console.error(
    `check-version: the site advertises ${site}, which is not a release on PyPI (latest is ${latest})`
  );
  process.exit(1);
}
if (/[a-z]/i.test(site)) {
  console.error(
    `check-version: the site advertises the prerelease ${site}; pip install does not resolve to it`
  );
  process.exit(1);
}
if (site !== latest) {
  const line = `the site advertises ${site}; PyPI's latest is ${latest}. sync-core-version.yml opens the bump`;
  if (strict) {
    console.error(`check-version: ${line}`);
    process.exit(1);
  }
  console.log(`::warning::${line}`);
} else {
  console.log(`check-version: ${site} is PyPI's latest`);
}
