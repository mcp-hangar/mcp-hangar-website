/**
 * The facts behind /compare, read from compare.json and checked before a page
 * is rendered. A check that fails throws, and a throw at import fails the
 * build: a table with a missing cell, an unlinked claim or a link to a commit
 * nobody verified does not ship.
 *
 * Every cell was read in source at the product's pinned commit. To re-verify,
 * move the product's SHAs and `verifiedAt`, re-read each cell, and let the
 * checks below tell you which links still point at the old commit.
 */
import { z } from "astro/zod";
import raw from "./compare.json";

export const VALUES = [
  "yes",
  "partial",
  "enterprise",
  "no",
  "not-found",
  "by-design-no",
] as const;
export type Value = (typeof VALUES)[number];

/** The row set is fixed by the page's brief; a new row is a decision, not an edit. */
export const GROUPS = [
  {
    id: "A",
    label: "What gateway comparisons usually ask",
    rows: [
      ["license", "License and open-core boundary"],
      ["caller-auth", "Caller authentication"],
      ["tool-scoping", "Tool scoping"],
      ["upstream-creds", "Upstream credentials"],
      ["inspection", "Argument and result inspection"],
      ["audit", "Audit of tool calls"],
      ["deployment", "Deployment model"],
    ],
  },
  {
    id: "B",
    label: "Tool contract and call path",
    rows: [
      ["contract-integrity", "Tool contract integrity"],
      ["drift", "Drift detection"],
      ["pin-identity", "Pin bound to upstream identity"],
      ["approval", "Human approval gate"],
      ["egress", "Egress and network enforcement"],
    ],
  },
  {
    id: "C",
    label: "Rows Hangar loses",
    rows: [
      ["llm-gateway", "LLM gateway"],
      ["device-inventory", "Desktop and device MCP inventory"],
      ["runtime-catalog", "Hosted server runtime and catalog UI"],
    ],
  },
] as const;

export type RowId = (typeof GROUPS)[number]["rows"][number][0];
export const ROWS: { id: RowId; label: string; group: string }[] =
  GROUPS.flatMap((g) =>
    g.rows.map(([id, label]) => ({ id: id as RowId, label, group: g.id }))
  );

const sha = z
  .string()
  .regex(/^[0-9a-f]{40}$/, "a full 40-character commit SHA");

const Evidence = z.object({
  url: z.string().url(),
  kind: z.enum(["code", "docs"]),
  sha: sha.optional(),
});

const Product = z.object({
  id: z.string(),
  name: z.string(),
  repo: z.string(),
  license: z.string(),
  verifiedSha: sha,
  verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  version: z.string().optional(),
  /**
   * Further repositories verified for the same product, each at its own
   * commit. Hangar is core plus the operator; one SHA cannot pin both.
   */
  alsoVerified: z
    .array(z.object({ repo: z.string(), sha, version: z.string().optional() }))
    .optional(),
});

const Cell = z.object({
  product: z.string(),
  row: z.string(),
  value: z.enum(VALUES),
  note: z.string().min(1).max(120),
  evidence: z.array(Evidence),
});

const Compare = z.object({
  products: z.array(Product).min(1),
  cells: z.array(Cell),
});

export type Evidence = z.infer<typeof Evidence>;
export type Product = z.infer<typeof Product>;
export type Cell = z.infer<typeof Cell>;
export type CompareData = z.infer<typeof Compare>;

/** Values that make a claim, and so must link the code or docs that make it. */
const NEEDS_EVIDENCE: ReadonlySet<Value> = new Set([
  "yes",
  "partial",
  "enterprise",
  "no",
  "by-design-no",
]);

/** Every repository a product was verified in, with the commit it was read at. */
export const pinsOf = (p: Product) => [
  { repo: p.repo, sha: p.verifiedSha, version: p.version },
  ...(p.alsoVerified ?? []),
];

/**
 * Parse and cross-check. Returns the problems rather than throwing so the unit
 * test can assert on each rule; `loadCompare` throws on any of them.
 */
export function checkCompare(input: unknown): {
  data?: CompareData;
  errors: string[];
} {
  const parsed = Compare.safeParse(input);
  if (!parsed.success) {
    return {
      errors: parsed.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`
      ),
    };
  }
  const data = parsed.data;
  const errors: string[] = [];
  const products = new Map(data.products.map((p) => [p.id, p]));
  const rowIds = new Set<string>(ROWS.map((r) => r.id));
  const seen = new Map<string, number>();

  for (const c of data.cells) {
    const at = `${c.product} x ${c.row}`;
    const p = products.get(c.product);
    if (!p) errors.push(`${at}: unknown product`);
    if (!rowIds.has(c.row)) errors.push(`${at}: unknown row`);
    seen.set(
      `${c.product}|${c.row}`,
      (seen.get(`${c.product}|${c.row}`) ?? 0) + 1
    );

    if (NEEDS_EVIDENCE.has(c.value) && c.evidence.length === 0) {
      errors.push(`${at}: "${c.value}" needs at least one evidence link`);
    }
    if (
      c.value === "enterprise" &&
      !c.evidence.some((e) => e.kind === "docs")
    ) {
      errors.push(
        `${at}: "enterprise" needs the vendor's own docs as evidence`
      );
    }
    if (!p) continue;
    for (const e of c.evidence) {
      if (e.kind !== "code") continue;
      // A code link is a permalink into one of the product's repositories at
      // the commit it was verified at, never a branch.
      const pin = pinsOf(p).find((r) =>
        e.url.startsWith(`https://github.com/${r.repo}/blob/${r.sha}/`)
      );
      if (!pin) {
        errors.push(
          `${at}: code link is not pinned to a verified commit: ${e.url}`
        );
      } else if (e.sha && e.sha !== pin.sha) {
        errors.push(`${at}: evidence sha ${e.sha} does not match its URL`);
      }
    }
  }

  for (const p of data.products) {
    for (const r of ROWS) {
      const n = seen.get(`${p.id}|${r.id}`) ?? 0;
      if (n !== 1)
        errors.push(`${p.id} x ${r.id}: ${n} cells, expected exactly 1`);
    }
  }
  return { data, errors };
}

/** Products whose evidence is older than this get a warning in the build log. */
export const STALE_DAYS = 90;

export function staleProducts(data: CompareData, now = new Date()): Product[] {
  return data.products.filter(
    (p) => (now.getTime() - Date.parse(p.verifiedAt)) / 86_400_000 > STALE_DAYS
  );
}

function loadCompare(): CompareData {
  const { data, errors } = checkCompare(raw);
  if (errors.length || !data) {
    throw new Error(
      `src/data/compare.json failed its checks:\n- ${errors.join("\n- ")}`
    );
  }
  for (const p of staleProducts(data)) {
    console.warn(
      `[compare] ${p.name} was verified on ${p.verifiedAt}, more than ${STALE_DAYS} days ago; re-verify it.`
    );
  }
  return data;
}

export const COMPARE = loadCompare();
export const PRODUCTS = COMPARE.products;

export function cellOf(product: string, row: string): Cell {
  const c = COMPARE.cells.find((x) => x.product === product && x.row === row);
  // Unreachable after loadCompare; kept so a caller never gets undefined.
  if (!c) throw new Error(`no cell for ${product} x ${row}`);
  return c;
}

export const short = (s: string) => s.slice(0, 7);

/**
 * The words a value is shown as. `not-found` is never "No": it says what was
 * searched and where, because absence from a search is not a vendor's word.
 */
export function valueLabel(c: Cell, p: Product): string {
  switch (c.value) {
    case "yes":
      return "yes";
    case "partial":
      return "partial";
    case "enterprise":
      return "enterprise";
    case "no":
      return "no";
    case "by-design-no":
      return "no, by design";
    case "not-found":
      return `no evidence at ${pinsOf(p)
        .map((r) => short(r.sha))
        .join("+")}`;
  }
}

/** The latest verification date across products, for the lede. */
export const VERIFIED_ON = PRODUCTS.map((p) => p.verifiedAt)
  .sort()
  .at(-1)!;
