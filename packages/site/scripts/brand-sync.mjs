#!/usr/bin/env node
/**
 * Pull the brand's own files into this repo at a pinned commit.
 *
 * The site cannot import from `mcp-hangar/brand` at build time — it is a
 * separate repository, and its assets are CC BY-ND, not an npm package. So the
 * few files the site's identity actually depends on are vendored here, and
 * this script is how they get refreshed.
 *
 * What is vendored is deliberately small:
 *
 *   generators/hangar_brand/geometry.py   the gate's path data and the palette
 *   marks/favicon.svg                     the one asset served verbatim
 *
 * Everything else — lockups, social art, the status walls — is consumed as a
 * finished asset when a page needs it, not tracked here.
 *
 * `brand.test.ts` reads the vendored copies and fails if the site has drifted
 * from them. That is the point of the pin: before it, the mark and the favicon
 * were hand-redrawn approximations, and both had quietly become closed gates —
 * the brand's sign for a refusal — on a product whose nav is not a refusal.
 *
 * This reads a local checkout rather than fetching over HTTP, because the
 * brand repository is private: the raw.githubusercontent URLs its own README
 * advertises 404 for anyone without access, CI included. The test is what runs
 * in CI, and it needs no network.
 *
 * Usage:
 *   node scripts/brand-sync.mjs                       re-pull the pinned commit
 *   node scripts/brand-sync.mjs --commit <sha>        move the pin, then pull
 *   node scripts/brand-sync.mjs --repo ~/src/brand    read a checkout elsewhere
 *                              (or set BRAND_REPO)
 */
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const lockPath = path.join(root, "brand.lock.json");
const lock = JSON.parse(await readFile(lockPath, "utf8"));

const arg = (name) => {
  const at = process.argv.indexOf(`--${name}`);
  return at === -1 ? undefined : process.argv[at + 1];
};

const die = (message) => {
  console.error(`brand-sync: ${message}`);
  process.exit(1);
};

const repo = path.resolve(
  arg("repo") ?? process.env.BRAND_REPO ?? path.join(root, "../../../brand")
);
const commit = arg("commit") ?? lock.commit;

// A branch name would make the pin meaningless: this file exists so that "what
// the site was built against" is something you can name.
if (!/^[0-9a-f]{40}$/.test(commit))
  die(`--commit needs a full 40-character SHA, got ${commit}`);

const git = (...args) =>
  execFileSync("git", ["-C", repo, ...args], { encoding: "buffer" });

try {
  git("cat-file", "-e", `${commit}^{commit}`);
} catch {
  die(
    `${repo} has no commit ${commit.slice(0, 10)} — wrong checkout, or it needs a fetch`
  );
}

// A pin nobody else can resolve is not a pin. Catching it here beats finding
// out when someone clones this repo and cannot reproduce the assets.
try {
  git("merge-base", "--is-ancestor", commit, "origin/main");
} catch {
  console.warn(
    `brand-sync: warning — ${commit.slice(0, 10)} is not on origin/main; pin something pushed`
  );
}

for (const file of lock.files) {
  const body = git("show", `${commit}:${file}`);

  const vendored = path.join(root, lock.vendorDir, file);
  await mkdir(path.dirname(vendored), { recursive: true });
  await writeFile(vendored, body);

  const served = lock.serves[file];
  if (served) await writeFile(path.join(root, served), body);

  console.log(
    `brand-sync: ${file} -> ${lock.vendorDir}/${file}${served ? `, ${served}` : ""}`
  );
}

// Rewritten as text rather than re-serialised: `JSON.stringify` reflows the
// whole file and then loses the fight with Prettier on the next format check.
if (commit !== lock.commit) {
  const source = await readFile(lockPath, "utf8");
  await writeFile(lockPath, source.replace(lock.commit, commit));
  console.log(
    `brand-sync: pin moved ${lock.commit.slice(0, 10)} -> ${commit.slice(0, 10)}`
  );
}
