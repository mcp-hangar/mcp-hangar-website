import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Record from "../components/Record.astro";
import VerdictChip from "../components/VerdictChip.astro";

/**
 * The verdict record is the site's motif, so its contract is tested: a real
 * table with a name, one row per verdict, and the verdict as a word -- never
 * colour alone.
 */

const render = async (component: unknown, props: Record<string, unknown>) =>
  (await AstroContainer.create()).renderToString(component as never, {
    props,
  });

describe("Record", () => {
  it("renders a named, keyboard-reachable table of verdicts", async () => {
    const html = await render(Record, {
      label: "Three calls",
      source: "batch_call_refused",
      rows: [
        { time: "15:15:02", verdict: "allow", call: "github.get_issue" },
        {
          time: "15:15:04",
          verdict: "hold",
          call: "payments.refund",
          reason: "approval pending",
        },
        {
          time: "15:15:07",
          verdict: "deny",
          call: "github.create_issue",
          reason: "reason=tool_not_in_access_policy",
        },
      ],
    });
    expect(html).toMatch(/role="region"[^>]*aria-label="Three calls"/);
    expect(html).toContain('tabindex="0"');
    expect(html).toContain("<caption");
    expect(
      html.match(/<tbody[^>]*>[\s\S]*<\/tbody>/)![0].match(/<tr/g)
    ).toHaveLength(3);
    for (const word of ["allow", "hold", "deny"]) {
      expect(html).toMatch(new RegExp(`>\\s*${word}\\s*<`));
    }
    expect(html).toContain("tool_not_in_access_policy");
    expect(html).toContain("batch_call_refused");
  });
});

describe("VerdictChip", () => {
  it.each(["allow", "deny", "hold"])("says %s in words", async (verdict) => {
    const html = await render(VerdictChip, { verdict });
    expect(html).toMatch(new RegExp(`>\\s*${verdict}`));
    expect(html).toContain(`text-${verdict}`);
  });
});
