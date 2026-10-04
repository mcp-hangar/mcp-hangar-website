import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import {
  AUDIT_EXPORT_FACT,
  DEPLOYMENT_FACT,
  DETERMINISM_FACT,
  PLATFORM_FACT,
  VERDICT_PATH_FACT,
} from "../lib/product-facts";
import { DESCRIPTION } from "../config";

const SITE = "https://mcp-hangar.io";

export const GET: APIRoute = async () => {
  const docs = await getCollection("oss");
  const learn = (await getCollection("learn")).filter((e) => !e.data.draft);
  const securityPages = (await getCollection("security")).sort(
    (a, b) => a.data.order - b.data.order
  );
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  // Categorize docs by path prefix (skip index pages within categories)
  const categorize = (prefix: string) =>
    docs
      .filter((d) => d.id.startsWith(prefix) && !d.id.endsWith("/index"))
      .map((d) => `- [${d.data.title}](${SITE}/docs/${d.id}.md)`)
      .join("\n");

  const gettingStarted = categorize("getting-started/");
  const guides = categorize("guides/");
  const cookbook = categorize("cookbook/");
  const reference = categorize("reference/");
  const architecture = categorize("architecture/");
  const operations = [
    ...docs.filter((d) => d.id.startsWith("operations/")),
    ...docs.filter((d) => d.id.startsWith("observability/")),
    ...docs.filter((d) => d.id.startsWith("runbooks/")),
  ]
    .map((d) => `- [${d.data.title}](${SITE}/docs/${d.id}.md)`)
    .join("\n");
  // One Security section, two sources: the site's `security` collection (the
  // public posture pages) followed by the docs' own security pages. A second
  // `## Security` heading would just be a duplicate key in this file.
  const security = [
    ...securityPages.map(
      (s) =>
        `- [${s.data.title}](${SITE}/security/${s.id}.md) — ${s.data.description}`
    ),
    ...docs
      .filter((d) => d.id.startsWith("security"))
      .map((d) => `- [${d.data.title}](${SITE}/docs/${d.id}.md)`),
  ].join("\n");
  const adr = categorize("adr/");
  const development = categorize("development/");
  const integrations = categorize("integrations/");
  const testing = categorize("testing/");

  const learnEntries = learn
    .map(
      (l) =>
        `- [${l.data.title}](${SITE}/learn/${l.id}.md) — ${l.data.description}`
    )
    .join("\n");

  const blogEntries = posts
    .map(
      (p) =>
        `- [${p.data.title}](${SITE}/blog/${p.id}.md) (${p.data.date.toISOString().split("T")[0]})`
    )
    .join("\n");

  // Standalone docs (not already categorized above)
  const categorizedPrefixes = [
    "getting-started/",
    "guides/",
    "cookbook/",
    "reference/",
    "architecture/",
    "operations/",
    "observability/",
    "runbooks/",
    "security",
    "adr/",
    "development/",
    "integrations/",
    "testing/",
  ];
  const standalone = docs
    .filter(
      (d) =>
        d.id !== "index" && !categorizedPrefixes.some((p) => d.id.startsWith(p))
    )
    .map((d) => `- [${d.data.title}](${SITE}/docs/${d.id}.md)`)
    .join("\n");

  const body = `# MCP Hangar

> ${DESCRIPTION} MCP is the Model Context Protocol. MIT-licensed, self-hosted, no SaaS tier.

## Key facts

- Language: Python (pip install mcp-hangar)
- License: MIT — self-hosted, no SaaS/managed tier
- ${VERDICT_PATH_FACT}
- ${DEPLOYMENT_FACT}
- ${DETERMINISM_FACT}
- Audit export: ${AUDIT_EXPORT_FACT}
- ${PLATFORM_FACT}
- Task relay-with-governance (ADR-014) shipped in 2.0.0; it is not in the 1.6.x line
- GitHub: https://github.com/mcp-hangar/mcp-hangar
- Website: ${SITE}
- Full documentation inlined for machines: ${SITE}/llms-full.txt
- Every page below also exists as markdown at the same path + ".md"

## Getting Started

${gettingStarted}

## Guides

${guides}

## Cookbook

${cookbook}

## Reference

${reference}

## Architecture

${architecture}

## Operations & Observability

${operations}

## Security

${security}

## Architecture Decision Records

${adr}

## Integrations

${integrations}

## Development

${development}

## Testing

${testing}

## Other

${standalone}

## Learn

${learnEntries}

## Blog

${blogEntries}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
