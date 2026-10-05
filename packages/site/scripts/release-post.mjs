#!/usr/bin/env node
/**
 * Draft a blog post for a core release.
 *
 * Reads the GitHub release notes of mcp-hangar/mcp-hangar for one version and
 * the "Upgrade to <version>" section of core's UPGRADE.md at that tag, and
 * writes `src/content/blog/<date>-v<x>-<y>-<z>-release.mdx` with
 * `draft: true`. Nothing builds a draft (see src/lib/blog.ts), so the file can
 * be committed and reviewed before anyone reads it.
 *
 * The output is a starting point, not a post. It carries the release notes
 * grouped the way the release groups them, the upgrade notes verbatim, and
 * `TODO(editor)` markers where a person has to write: the title, the
 * description, the opening, and what to cut. `blog-drafts.test.ts` fails the
 * build on a published post that still contains a marker.
 *
 * Usage:
 *   node scripts/release-post.mjs 2.24.0
 *   node scripts/release-post.mjs 2.24.0 --core ../../../mcp-hangar   read UPGRADE.md from a local clone
 *   node scripts/release-post.mjs 2.24.0 --stdout                     print instead of writing
 *   node scripts/release-post.mjs 2.24.0 --force                      overwrite an existing draft
 *
 * Needs `gh`, authenticated or not (core's releases are public).
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

export const REPO = "mcp-hangar/mcp-hangar";
export const MARKER = "TODO(editor)";
const BLOG = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/content/blog"
);

const VERSION_RE = /^\d+\.\d+\.\d+$/;

/** @typedef {{ scope: string | null, text: string }} ReleaseItem */
/** @typedef {{ title: string, items: ReleaseItem[] }} ReleaseSection */

/**
 * The release body's change sections, in the order the release lists them.
 *
 * release-please writes `## What's Changed` (`## [x.y.z](compare-url)` before
 * 2.7), then one `### <Kind>` per kind of change, each a list of
 * `- **scope:** text ([#n](url))` items, then `## Installation` and
 * `## Links`. Only the change sections are kept; the install block is rendered
 * by the template itself.
 *
 * @param {string} body
 * @returns {ReleaseSection[]}
 */
export function parseReleaseBody(body) {
  const lines = body.replace(/\r\n?/g, "\n").split("\n");
  /** @type {ReleaseSection[]} */
  const sections = [];
  /** @type {ReleaseSection | null} */
  let section = null;
  let item = null;
  let inChanges = false;

  const close = () => {
    if (item && section) section.items.push(finishItem(item));
    item = null;
  };

  for (const line of lines) {
    const h2 = /^##\s+(.*?)\s*$/.exec(line);
    if (h2 && !line.startsWith("###")) {
      close();
      section = null;
      inChanges = !/^(installation|links)\b/i.test(h2[1]);
      continue;
    }
    if (!inChanges) continue;
    const h3 = /^###\s+(.*?)\s*$/.exec(line);
    if (h3) {
      close();
      section = { title: h3[1], items: [] };
      sections.push(section);
      continue;
    }
    if (!section) continue;
    if (/^[-*]\s+/.test(line)) {
      close();
      item = [line.replace(/^[-*]\s+/, "")];
    } else if (item && line.trim() !== "") {
      item.push(line.trim());
    } else if (item && line.trim() === "") {
      close();
    }
  }
  close();
  return sections.filter((s) => s.items.length > 0);
}

/** @param {string[]} lines @returns {ReleaseItem} */
function finishItem(lines) {
  const text = lines.join(" ").replace(/\s+/g, " ").trim();
  const scoped = /^\*\*([\w-]+):\*\*\s*(.*)$/.exec(text);
  return scoped ? { scope: scoped[1], text: scoped[2] } : { scope: null, text };
}

/**
 * The body of core's upgrade notes for one version, or null when there are
 * none.
 *
 * Two heading styles exist in UPGRADE.md: `## Upgrade to 2.24.0`, used since
 * 2.7, and the older `## 2.6.0 — three things to check`. The section runs to
 * the next `## ` heading.
 */
export function extractUpgradeSection(upgradeMd, version) {
  const v = version.replace(/\./g, "\\.");
  const head = new RegExp(
    `^##\\s+(?:Upgrade to\\s+)?v?${v}(?![\\d.])[^\\n]*$`,
    "m"
  );
  const m = head.exec(upgradeMd);
  if (!m) return null;
  const rest = upgradeMd.slice(m.index + m[0].length);
  const next = /^##\s/m.exec(rest);
  const body = (next ? rest.slice(0, next.index) : rest)
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
  return body === "" ? null : body;
}

/**
 * Make Markdown safe to compile as MDX without changing what it says.
 *
 * MDX reads `{` as the start of an expression and `<` as the start of a JSX
 * tag, and release notes use both in prose (`{id}` in a route, `<= 2.19.1` in
 * a range). Outside code spans and fenced blocks they are backslash-escaped;
 * inside code they are literal already and are left alone.
 */
export function escapeMdx(markdown) {
  const out = [];
  let fence = null;
  for (const line of markdown.split("\n")) {
    const f = /^\s*(```+|~~~+)/.exec(line);
    if (fence) {
      out.push(line);
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length)
        fence = null;
      continue;
    }
    if (f) {
      fence = f[1];
      out.push(line);
      continue;
    }
    out.push(
      line
        .split(/(`+[^`]*?`+)/)
        .map((part, i) =>
          i % 2 === 1 ? part : part.replace(/(?<!\\)([{}<])/g, "\\$1")
        )
        .join("")
    );
  }
  return out.join("\n");
}

/** `2.24.0` -> `v2-24-0`, the slug fragment existing release posts use. */
export function slugFor(version, publishedAt) {
  return `${publishedAt.slice(0, 10)}-v${version.replace(/\./g, "-")}-release`;
}

/** The draft, as MDX text. */
export function renderPost({ version, publishedAt, sections, upgrade }) {
  const date = publishedAt.slice(0, 10);
  const [major, minor] = version.split(".");
  const tags = ["mcp", "mcp-hangar", "release"];
  const fm = [
    "---",
    `title: ${JSON.stringify(`MCP Hangar ${version} — ${MARKER}: one line on what this release changes`)}`,
    `date: ${date}`,
    "author: MCP Hangar Team",
    `description: ${JSON.stringify(`${MARKER}: two sentences for the listing, the feed and the link preview.`)}`,
    `tags: [${tags.join(", ")}]`,
    // Nothing builds a draft. Flipping this to false publishes the post.
    "draft: true",
    "---",
  ];

  const body = [
    `{/* Generated by scripts/release-post.mjs from the ${REPO} v${version} release notes and UPGRADE.md at that tag.`,
    `   Rewrite it before publishing: group by what a reader runs into, not by kind of change; cut what nobody`,
    `   operating Hangar will notice; check every claim against CHANGELOG.md at the tag; link the open defect`,
    `   when a feature has a known gap. Remove every ${MARKER} marker, then set draft: false. */}`,
    "",
    `${MARKER}: the opening. What changed for someone running ${major}.${minor}, in one paragraph.`,
    "",
  ];

  for (const section of sections) {
    body.push(`## ${section.title}`, "");
    for (const item of section.items) {
      const scope = item.scope ? `**${item.scope}:** ` : "";
      body.push(`- ${scope}${escapeMdx(item.text)}`);
    }
    body.push("");
  }

  body.push("## Upgrading", "");
  if (upgrade) {
    body.push(escapeMdx(upgrade), "");
  } else {
    body.push(
      `${MARKER}: core's UPGRADE.md has no section for ${version}. Say so in a line, or drop this heading.`,
      ""
    );
  }

  body.push(
    "## Get it",
    "",
    "```bash",
    `pip install --upgrade mcp-hangar==${version}   # or: ghcr.io/mcp-hangar/mcp-hangar:${version}`,
    "```",
    "",
    `Full release notes: [v${version} on GitHub](https://github.com/${REPO}/releases/tag/v${version}).`,
    ""
  );

  return fm.join("\n") + "\n\n" + body.join("\n");
}

function gh(args) {
  return execFileSync("gh", args, { encoding: "utf8", maxBuffer: 32 << 20 });
}

function readUpgrade(ref, core) {
  if (core) {
    return execFileSync("git", ["-C", core, "show", `${ref}:UPGRADE.md`], {
      encoding: "utf8",
      maxBuffer: 32 << 20,
    });
  }
  return gh([
    "api",
    `repos/${REPO}/contents/UPGRADE.md?ref=${ref}`,
    "-H",
    "Accept: application/vnd.github.raw",
  ]);
}

function main() {
  const args = process.argv.slice(2);
  const coreAt = args.indexOf("--core");
  const core = coreAt >= 0 ? args[coreAt + 1] : null;
  const version = args
    .find((a, i) => !a.startsWith("--") && (coreAt < 0 || i !== coreAt + 1))
    ?.replace(/^v/, "");
  if (!version || !VERSION_RE.test(version)) {
    console.error(
      "usage: release-post.mjs <x.y.z> [--core <clone>] [--stdout] [--force]"
    );
    process.exit(2);
  }
  const release = JSON.parse(
    gh([
      "release",
      "view",
      `v${version}`,
      "-R",
      REPO,
      "--json",
      "body,publishedAt,name",
    ])
  );
  // The tag first: that is what the release shipped with. Releases before 2.7
  // got their upgrade notes after the tag, so fall back to main's file.
  const upgrade =
    extractUpgradeSection(readUpgrade(`v${version}`, core), version) ??
    extractUpgradeSection(
      readUpgrade(core ? "origin/main" : "main", core),
      version
    );
  const mdx = renderPost({
    version,
    publishedAt: release.publishedAt,
    sections: parseReleaseBody(release.body),
    upgrade,
  });

  if (args.includes("--stdout")) {
    process.stdout.write(mdx);
    return;
  }
  const out = path.join(BLOG, `${slugFor(version, release.publishedAt)}.mdx`);
  if (fs.existsSync(out) && !args.includes("--force")) {
    console.error(
      `${path.relative(process.cwd(), out)} exists; pass --force to overwrite.`
    );
    process.exit(1);
  }
  fs.writeFileSync(out, mdx);
  console.log(
    `draft -> ${path.relative(process.cwd(), out)}` +
      (upgrade ? "" : ` (no upgrade notes for ${version})`)
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    main();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
