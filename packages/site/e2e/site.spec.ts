import { expect, test } from "@playwright/test";

test("landing, documentation and blog load without browser errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of ["/", "/docs/getting-started/quickstart", "/blog"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("install command copies the complete code", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const button = page.getByRole("button", {
    name: "Copy pip install command to clipboard",
  });
  const code = await button.locator(".start-copy-text").innerText();
  await button.click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(code);
});

test("mobile navigation and documentation drawer open and close", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator("#nav-mobile-toggle");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#nav-mobile-menu")).toBeVisible();
  await toggle.click();
  await expect(page.locator("#nav-mobile-menu")).toBeHidden();

  await page.goto("/docs/getting-started/quickstart");
  await page
    .getByRole("button", { name: "Toggle documentation navigation" })
    .click();
  await expect(page.locator("#docs-mobile-sidebar")).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page
    .locator("#docs-mobile-backdrop")
    .click({ position: { x: 380, y: 100 } });
  await expect(page.locator("#docs-mobile-sidebar")).toBeHidden();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

// A phone-width page must not scroll sideways. This regressed invisibly: a
// snippet inside a card made the card as wide as its longest line of YAML,
// because a grid item defaults to `min-width: auto` and will not shrink below
// its content -- so the card's own `overflow-x-auto` never got a chance, and
// the whole homepage was 154px wider than a 390px viewport. Nothing in the
// desktop layout showed it.
test("no page scrolls sideways at phone width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  const offenders: string[] = [];
  for (const route of [
    "/",
    "/docs/getting-started/quickstart",
    "/learn",
    "/blog",
    "/security",
  ]) {
    await page.goto(route);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
    );
    if (overflow > 0) offenders.push(`${route} is ${overflow}px too wide`);
  }
  expect(offenders).toEqual([]);
});
