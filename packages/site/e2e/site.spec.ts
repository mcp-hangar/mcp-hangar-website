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

test("hydrated code block copies the complete code", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const block = page
    .locator("astro-island")
    .filter({ has: page.getByRole("button", { name: "Copy to clipboard" }) })
    .first();
  await expect(block).not.toHaveAttribute("ssr");
  const code = await block.locator("code").innerText();
  await block.hover();
  await block.getByRole("button", { name: "Copy to clipboard" }).click();
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
