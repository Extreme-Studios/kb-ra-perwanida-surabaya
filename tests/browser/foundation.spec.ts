import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { routes } from "../../src/config/routes";

test("All routes, metadata, root entrance, missing route and no fabricated integrations", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => { if (response.status() >= 500) errors.push(`HTTP ${response.status()}: ${response.url()}`); });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Masuk ke Perwanida", exact: true })).toBeVisible();
  for (const route of routes) {
    const response = await page.goto(route.path);
    expect(response?.status(), route.path).toBe(200);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/KB-RA Perwanida Surabaya/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }
  const missing = await page.goto("/not-a-real-page");
  expect(missing?.status()).toBe(404);
  expect(errors).toEqual([]);
});
test("Responsive layout at every requested viewport", async ({ page }) => {
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 950 });
    for (const path of ["/home", "/program/unggulan", "/kontak"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, `${path} at ${width}`).toBe(false);
    }
    await page.goto("/home");
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
  }
});
test("Desktop nested dropdown works by click and keyboard, closes on Escape and blur", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/home");
  const nav = page.getByRole("navigation", { name: "Navigasi utama", exact: true });
  const program = nav.getByRole("button", { name: "Program", exact: true });
  await program.focus();
  await page.keyboard.press("Enter");
  await expect(program).toHaveAttribute("aria-expanded", "true");
  await nav.getByRole("link", { name: "Mengaji Metode UMMI", exact: true }).click();
  await expect(page).toHaveURL(/mengaji-metode-ummi$/);
  await program.click();
  await page.keyboard.press("Escape");
  await expect(program).toHaveAttribute("aria-expanded", "false");
  await expect(program).toBeFocused();
  await program.click();
  await page.locator("h1").click({ position: { x: 8, y: 8 } });
  await expect(program).toHaveAttribute("aria-expanded", "false");
});
test("Mobile menu focus containment, nested links, route close and Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/home");
  const opener = page.getByRole("button", { name: "Buka menu" });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await dialog.locator("summary").filter({ hasText: /^Program$/ }).click();
  await dialog.getByRole("link", { name: "Mengaji Metode UMMI", exact: true }).click();
  await expect(page).toHaveURL(/mengaji-metode-ummi$/);
  await expect(dialog).not.toBeVisible();
  await opener.click();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await opener.click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});
test("Basic accessibility, skip link, menu and reduced motion", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/home");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Lewati ke konten utama" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
    const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(audit.violations).toEqual([]);
    if (width === 390) {
      await page.getByRole("button", { name: "Buka menu" }).click();
      const menuAudit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(menuAudit.violations).toEqual([]);
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/home");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
});
