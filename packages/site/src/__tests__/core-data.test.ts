import { describe, expect, it } from "vitest";
import core from "../data/core.json";
import { GATES, STAGE_NAMES } from "../lib/gate-path";
import { HERO_RECORD, PATH_RECORD } from "../lib/home-records";
import { VERSION_TAG } from "../config";

/**
 * The home page draws core's gate path and quotes core's records. Both come
 * from src/data/core.json (scripts/core-data.py), and this holds the page to
 * it: every gate core runs is drawn, in core's order, nothing core does not
 * run is drawn, and every code a record on the page shows is one core emits.
 */

describe("core.json", () => {
  // Not "equals": the nightly sync moves VERSION on its own and CI has no
  // clone of core to re-extract from, so a strict match would fail every bot
  // PR. The page names the tag it was generated from instead, and this holds
  // that tag to a real release no newer than the one advertised.
  it("was extracted from a release no newer than the one advertised", () => {
    const parts = (v: string) => v.replace(/^v/, "").split(".").map(Number);
    const [a, b] = [parts(core.core.tag), parts(VERSION_TAG)];
    expect(a).toHaveLength(3);
    const cmp = a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
    expect(cmp).toBeLessThanOrEqual(0);
    expect(core.core.commit).toMatch(/^[0-9a-f]{40}$/);
  });

  it("carries a record core's exporters wrote", () => {
    expect(core.record.leef).toMatch(/^LEEF:2\.0\|MCP Hangar\|/);
    expect(JSON.parse(core.record.jsonl).event_type).toBe(
      "ToolInvocationDenied"
    );
  });
});

describe("the gate path", () => {
  it("draws every gate core runs, in core's order", () => {
    expect(GATES.map((g) => g.name)).toEqual(core.gates.map((g) => g.name));
  });

  it("describes no gate core does not run", () => {
    expect(STAGE_NAMES.sort()).toEqual(core.gates.map((g) => g.name).sort());
  });

  it("names only codes core emits", () => {
    const known = new Set([...core.gateReasons, ...core.tenantBudgetReasons]);
    for (const g of GATES) for (const c of g.codes) expect(known).toContain(c);
  });
});

describe("the records on the home page", () => {
  const fields = (reason = "") =>
    Object.fromEntries(
      [...reason.matchAll(/(\w+)=(\S+)/g)].map((m) => [m[1], m[2]])
    );
  const rows = [...HERO_RECORD, ...PATH_RECORD];

  it.each(rows.map((r) => [r.call, r.verdict, r.reason ?? ""]))(
    "%s %s: %s uses core's vocabulary",
    (_call, _verdict, reason) => {
      const f = fields(reason);
      if (f.gate) expect(core.gates.map((g) => g.name)).toContain(f.gate);
      if (f.reason)
        expect([...core.gateReasons, ...core.tenantBudgetReasons]).toContain(
          f.reason
        );
      if (f.state) expect(core.approvalStates).toContain(f.state);
      if (f.l7_verdict) expect(core.l7Verdicts).toContain(f.l7_verdict);
      if (f.policy_id) expect(f.policy_id).toMatch(/^sha256:[0-9a-f]{1,64}$/);
    }
  );

  it("shows all three verdicts in the hero", () => {
    expect(new Set(HERO_RECORD.map((r) => r.verdict))).toEqual(
      new Set(["allow", "hold", "deny"])
    );
  });

  it("quotes, in the exported record, the refusal the path record shows", () => {
    const refused = PATH_RECORD.find((r) =>
      r.reason?.includes("tool_not_in_access_policy")
    )!;
    const tool = refused.call.split(".")[1];
    expect(core.record.leef).toContain(`action=${tool}`);
    expect(core.record.leef).toContain("gateReason=tool_not_in_access_policy");
  });
});
