import { describe, expect, it } from "vitest";
import raw from "../data/compare.json";
import {
  COMPARE,
  ROWS,
  checkCompare,
  pinsOf,
  staleProducts,
  valueLabel,
} from "../data/compare";

/**
 * The rules compare.json is held to. The same `checkCompare` runs when the page
 * imports the data, so a build fails on any of these; the test pins each rule
 * down so a change to one is a decision, not an accident.
 */

const clone = () => structuredClone(raw) as typeof raw;
const firstCode = (d: typeof raw) =>
  d.cells.find((c) => c.evidence.some((e) => e.kind === "code"))!;

describe("compare.json", () => {
  it("passes its own checks", () => {
    expect(checkCompare(raw).errors).toEqual([]);
  });

  it("has one cell per product and row", () => {
    expect(COMPARE.cells).toHaveLength(COMPARE.products.length * ROWS.length);
  });

  it("fails on a missing cell", () => {
    const d = clone();
    d.cells.pop();
    expect(checkCompare(d).errors.join("\n")).toMatch(
      /0 cells, expected exactly 1/
    );
  });

  it("fails on a duplicate cell", () => {
    const d = clone();
    d.cells.push(d.cells[0]);
    expect(checkCompare(d).errors.join("\n")).toMatch(
      /2 cells, expected exactly 1/
    );
  });

  it.each(["yes", "partial", "no", "enterprise", "by-design-no"])(
    "fails on a %s cell without evidence",
    (value) => {
      const d = clone();
      Object.assign(d.cells[0], { value, evidence: [] });
      expect(checkCompare(d).errors.join("\n")).toMatch(
        /needs at least one evidence/
      );
    }
  );

  it("allows a not-found cell without evidence", () => {
    const d = clone();
    Object.assign(d.cells[0], { value: "not-found", evidence: [] });
    expect(checkCompare(d).errors).toEqual([]);
  });

  it("fails on a note over 120 characters", () => {
    const d = clone();
    d.cells[0].note = "x".repeat(121);
    expect(checkCompare(d).errors.length).toBeGreaterThan(0);
  });

  it("fails on a code link to a branch instead of the verified commit", () => {
    const d = clone();
    const c = firstCode(d);
    const e = c.evidence.find((x) => x.kind === "code")!;
    e.url = e.url.replace(/blob\/[0-9a-f]{40}\//, "blob/main/");
    expect(checkCompare(d).errors.join("\n")).toMatch(
      /not pinned to a verified commit/
    );
  });

  it("fails on enterprise without the vendor's docs", () => {
    const d = clone();
    const c = firstCode(d);
    Object.assign(c, {
      value: "enterprise",
      evidence: c.evidence.filter((x) => x.kind === "code"),
    });
    expect(checkCompare(d).errors.join("\n")).toMatch(/vendor's own docs/);
  });

  it("every code link names a commit the product was verified at", () => {
    for (const c of COMPARE.cells) {
      const p = COMPARE.products.find((x) => x.id === c.product)!;
      for (const e of c.evidence.filter((x) => x.kind === "code")) {
        expect(pinsOf(p).some((r) => e.url.includes(`/blob/${r.sha}/`))).toBe(
          true
        );
      }
    }
  });

  it("never shows not-found as a plain no", () => {
    for (const c of COMPARE.cells.filter((x) => x.value === "not-found")) {
      const p = COMPARE.products.find((x) => x.id === c.product)!;
      expect(valueLabel(c, p)).toMatch(/^no evidence at [0-9a-f]{7}/);
    }
  });

  it("warns, not fails, on a product verified more than 90 days ago", () => {
    const later = new Date(
      Date.parse(COMPARE.products[0].verifiedAt) + 91 * 86_400_000
    );
    expect(staleProducts(COMPARE, later).length).toBeGreaterThan(0);
    expect(
      staleProducts(COMPARE, new Date(COMPARE.products[0].verifiedAt))
    ).toEqual([]);
  });
});
