import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import fs from "node:fs/promises";
import path from "node:path";
import { stripSvg } from "../../lib/strip-svg";
import advisoryData from "../../data/security-advisories.json";

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getCollection("security");
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as {
    entry: {
      id: string;
      data: {
        title: string;
        description: string;
        updated: Date;
        order: number;
      };
      body?: string;
    };
  };

  // Read original MDX source
  const mdxPath = path.resolve(`src/content/security/${entry.id}.mdx`);
  let body: string;
  try {
    const raw = await fs.readFile(mdxPath, "utf-8");
    // Strip frontmatter
    const fmEnd = raw.indexOf("---", raw.indexOf("---") + 3);
    body = fmEnd > 0 ? raw.slice(fmEnd + 3).trim() : raw;
    // Strip import/export statements (MDX-specific) and leading h1 (already in header)
    body = body
      .replace(/^(import|export)\s+.*$/gm, "")
      .replace(/^#\s+.+\n*/m, "")
      .trim();
  } catch {
    body = entry.body || "";
  }
  // Machines get prose, not diagrams.
  body = stripSvg(body);

  // The advisory list is data, not prose, so the generic rule below would
  // drop it. Machines get it as a markdown list instead.
  body = body.replace(/<AdvisoryList\s*\/>/g, () =>
    advisoryData.advisories
      .map(
        (a) =>
          `- [${a.ghsaId}](${a.url}) (${a.severity}, ${a.publishedAt}): ${a.summary}. ` +
          (a.patchedVersions
            ? `Fixed in ${a.patchedVersions}.`
            : `Affects ${a.affectedVersions ?? "see advisory"}.`)
      )
      .join("\n")
  );

  // Unwrap MDX components — same rule as the learn mirror: opening and closing
  // tags of capitalised components go, their children stay; self-closing
  // components carry no prose and are dropped.
  body = body
    .replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*\/>\s*/g, "")
    .replace(/<\/?([A-Z][A-Za-z0-9]*)\b[^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const updated = entry.data.updated.toISOString().split("T")[0];

  const header = [
    `# ${entry.data.title}`,
    "",
    `> ${entry.data.description}`,
    "",
    `Updated: ${updated}`,
    `Source: https://mcp-hangar.io/security/${entry.id}`,
    "",
    "---",
    "",
  ].join("\n");

  return new Response(`${header}${body}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
