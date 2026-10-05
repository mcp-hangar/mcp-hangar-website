import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Light is the default, dark is a full variant, and both have to pass the same
 * accessibility bar. The two themes reach the page by two different CSS paths
 * -- the system's preference through a media query, a reader's choice through
 * `data-theme` -- so both paths are exercised, not only one.
 */

const ROUTES = [
  "/",
  "/docs/getting-started/quickstart",
  "/learn",
  "/blog",
  "/security",
  "/search?q=approval",
];

const ground = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

const LIGHT = "rgb(247, 248, 245)";
const DARK = "rgb(17, 20, 24)";

test("light is the default, and the system's dark is followed", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  expect(await ground(page)).toBe(LIGHT);
  await page.emulateMedia({ colorScheme: "dark" });
  expect(await ground(page)).toBe(DARK);
});

test("the toggle switches, says what it will do, and is remembered", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const toggle = page.locator("#theme-toggle");
  await expect(toggle).toHaveAttribute("aria-label", "Switch to dark theme");
  await toggle.click();
  expect(await ground(page)).toBe(DARK);
  await expect(toggle).toHaveAttribute("aria-label", "Switch to light theme");

  // Set before first paint by the inline script in <head>, so a reload under
  // a light system preference still opens dark.
  await page.goto("/learn");
  expect(await ground(page)).toBe(DARK);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("a page renders when storage throws", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("blocked");
      },
    });
  });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.locator("#theme-toggle").click();
  expect(await ground(page)).toBe(DARK);
  expect(errors).toEqual([]);
});

for (const [path, theme] of [
  ["system", "light"],
  ["system", "dark"],
  ["toggle", "light"],
  ["toggle", "dark"],
] as const) {
  test(`WCAG 2 A/AA, ${theme} theme via the ${path}`, async ({ page }) => {
    if (path === "system") {
      await page.emulateMedia({ colorScheme: theme });
    } else {
      // The opposite system preference, so only data-theme can explain it.
      await page.emulateMedia({
        colorScheme: theme === "dark" ? "light" : "dark",
      });
      await page.addInitScript((t) => {
        try {
          localStorage.setItem("theme", t);
        } catch {
          // not reachable in this test
        }
      }, theme);
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    const failures: string[] = [];
    for (const route of ROUTES) {
      await page.goto(route);
      if (route.startsWith("/search")) {
        await expect(
          page.locator(".pagefind-ui__result").first()
        ).toBeVisible();
      }
      expect(await ground(page)).toBe(theme === "dark" ? DARK : LIGHT);
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      for (const v of violations) {
        failures.push(
          `${route} ${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`
        );
      }
    }
    expect(failures).toEqual([]);
  });
}
