import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * On a phone a record wraps between `key=value` fields, never inside one, and
 * never makes the page or its own frame scroll sideways. It used to break
 * `reason=tool_not_in_access_policy` as `…_acces` / `s_policy`.
 */

test.use({ viewport: { width: 390, height: 844 } });

for (const scheme of ["light", "dark"] as const) {
  test(`records fit a 390px phone in the ${scheme} theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");

    const layout = await page.evaluate(() => {
      const frames = [...document.querySelectorAll(".record-frame")];
      // A field split across lines has client rects on more than one line.
      // Checked per whitespace-separated token of the text, not per element,
      // so it holds whatever markup the record uses.
      const split: string[] = [];
      for (const cell of document.querySelectorAll(".record-call")) {
        const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          for (const m of (node.textContent ?? "").matchAll(/\S+/g)) {
            const range = document.createRange();
            range.setStart(node, m.index);
            range.setEnd(node, m.index + m[0].length);
            const tops = [...range.getClientRects()].map((r) =>
              Math.round(r.top)
            );
            if (new Set(tops).size > 1) split.push(m[0]);
          }
        }
      }
      return {
        page: document.documentElement.scrollWidth,
        frames: frames.length,
        scrolling: frames.filter((f) => f.scrollWidth > f.clientWidth).length,
        split,
      };
    });

    expect(layout.frames).toBeGreaterThan(0);
    expect(layout.page).toBeLessThanOrEqual(390);
    expect(layout.scrolling).toBe(0);
    expect(layout.split).toEqual([]);

    // The phone layout changes how the table is displayed; it stays a table.
    const results = await new AxeBuilder({ page }).include(".record").analyze();
    expect(results.violations).toEqual([]);
    await expect(page.getByRole("table").first()).toBeVisible();
  });
}
