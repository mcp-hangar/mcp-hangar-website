/**
 * /compare as markdown, from the same compare.json the page renders: the
 * llms-full.txt section and the /compare.md mirror both call this, so the
 * machine copy cannot say something the table does not.
 */
import {
  COMPARE,
  GROUPS,
  PRODUCTS,
  ROWS,
  VERIFIED_ON,
  cellOf,
  pinsOf,
  short,
  valueLabel,
} from "../data/compare";

/** The page title, also its retrieval hook: the names people search for. */
export const COMPARE_TITLE =
  "MCP gateways compared: Bifrost, ContextForge, Obot, Docker, Microsoft, Kuadrant, MCP Hangar";

export const COMPARE_DESCRIPTION =
  "Six open-source MCP gateways and MCP Hangar compared on fifteen rows, from caller authentication to tool contract integrity. Every cell links to code or docs at a pinned commit.";

const esc = (s: string) => s.replace(/\|/g, "\\|");

export function compareTable(): string {
  const head = `| Row | ${PRODUCTS.map((p) => p.name).join(" | ")} |`;
  const rule = `|---|${PRODUCTS.map(() => "---").join("|")}|`;
  const body = GROUPS.flatMap((g) => [
    `| **${g.id}. ${esc(g.label)}** |${PRODUCTS.map(() => " ").join("|")}|`,
    ...g.rows.map(
      ([id, label]) =>
        `| ${esc(label)} | ${PRODUCTS.map((p) => valueLabel(cellOf(p.id, id), p)).join(" | ")} |`
    ),
  ]);
  return [head, rule, ...body].join("\n");
}

/** Every cell with its note and evidence, one product at a time. */
export function compareNotes(): string {
  return PRODUCTS.map((p) => {
    const pins = pinsOf(p)
      .map((r) => `${r.repo} at ${r.sha}${r.version ? ` (${r.version})` : ""}`)
      .join("; ");
    const lines = ROWS.map((r) => {
      const c = cellOf(p.id, r.id);
      const links = c.evidence.map((e) => `<${e.url}>`).join(", ");
      return `- ${r.label}: ${valueLabel(c, p)}. ${c.note}${links ? ` Evidence: ${links}` : ""}`;
    });
    return `#### ${p.name}\n\nLicense ${p.license}. Verified ${p.verifiedAt}: ${pins}.\n\n${lines.join("\n")}`;
  }).join("\n\n");
}

export function compareMarkdown(): string {
  const shas = PRODUCTS.map((p) => `${p.name} ${short(p.verifiedSha)}`).join(
    ", "
  );
  return `Open-source MCP gateways and MCP Hangar, compared row by row. Every cell was read in source at a pinned commit (${shas}), last verified ${VERIFIED_ON}. "no" means the vendor states it; "no evidence at <sha>" means the code at that commit was searched and nothing was found. MCP Hangar publishes this table and is one of the products in it.

${compareTable()}

${compareNotes()}

Cells: ${COMPARE.cells.length}. Corrections: https://github.com/mcp-hangar/mcp-hangar-website/issues/new`;
}
