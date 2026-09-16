import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function scrollUntilAllImagesLoad(page: import("@playwright/test").Page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  let previous = -1;
  while (true) {
    const state = await page.evaluate(() => ({ y: window.scrollY, height: document.documentElement.scrollHeight, viewport: window.innerHeight }));
    if (state.y === previous || state.y + state.viewport >= state.height) break;
    previous = state.y;
    await page.evaluate((distance) => window.scrollBy(0, distance), Math.max(260, Math.floor(state.viewport * 0.75)));
    await page.waitForTimeout(180);
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0), undefined, { timeout: 15_000 });
}

test("Production security headers and concierge API rejection paths are present", async ({ page, request }) => {
  const home = await page.goto("/home");
  const headers = home!.headers();
  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
  const get = await request.get("/api/concierge"); expect(get.status()).toBe(405);
  const wrongType = await request.post("/api/concierge", { headers: { "content-type": "text/plain" }, data: "halo" }); expect(wrongType.status()).toBe(415);
  const malformed = await request.post("/api/concierge", { headers: { "content-type": "application/json" }, data: { history: [] } });
  expect(malformed.status()).toBe(400); expect(malformed.headers()["cache-control"]).toContain("no-store");
});

test("Release accessibility covers key pages and concierge states", async ({ page }) => {
  for (const path of ["/", "/home", "/profil/tentang-kami", "/program", "/profil/guru-tendik", "/galeri", "/spmb", "/kontak"]) {
    await page.goto(path); await expect(new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze(), path).resolves.toMatchObject({ violations: [] });
  }
  await page.goto("/home"); await page.getByRole("button", { name: "Butuh bantuan?" }).click();
  await expect(new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).resolves.toMatchObject({ violations: [] });
  await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("Published links have safe protocols and new tabs have rel protection", async ({ page }) => {
  for (const path of ["/home", "/kontak", "/multimedia"]) {
    await page.goto(path);
    const unsafe = await page.locator("a").evaluateAll((links) => links.filter((link) => {
      const anchor = link as HTMLAnchorElement;
      const href = link.getAttribute("href") ?? "";
      return href.toLowerCase().startsWith("javascript:") || (anchor.target === "_blank" && !/\bnoopener\b/i.test(anchor.rel));
    }).map((link) => link.outerHTML));
    expect(unsafe, path).toEqual([]);
  }
});

test("Unknown website route renders exactly one inherited site shell", async ({ page }) => {
  await page.goto("/route-tidak-ada");
  await expect(page.locator(".site-header")).toHaveCount(1);
  await expect(page.locator(".site-footer")).toHaveCount(1);
  await expect(page.locator(".concierge-trigger")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
});

for (const [name, path] of [["teachers-scrolled", "/profil/guru-tendik"], ["home-scrolled", "/home"], ["gallery-scrolled", "/galeri"]] as const) test(`Lazy images load after incremental viewport scrolling: ${name}`, async ({ page }) => {
  const pageErrors: string[] = []; const failedImages: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => { if (response.request().resourceType() === "image" && response.status() >= 400) failedImages.push(response.url()); });
  await page.goto(path); await scrollUntilAllImagesLoad(page);
  await expect(page.locator("img")).not.toHaveCount(0);
  await page.screenshot({ path: `test-results/milestone-5-final/${name}.png`, fullPage: true });
  expect(failedImages).toEqual([]); expect(pageErrors).toEqual([]);
});

test("Final release screenshots span entrance, core pages, concierge, and 404", async ({ page }) => {
  const shots: [string, string][] = [["entrance-desktop", "/"], ["home-desktop", "/home"], ["about", "/profil/tentang-kami"], ["program", "/program"], ["teachers", "/profil/guru-tendik"], ["gallery", "/galeri"], ["spmb", "/spmb"], ["not-found", "/route-tidak-ada"]];
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const [name, path] of shots) { await page.goto(path); await page.screenshot({ path: `test-results/milestone-5/${name}.png`, fullPage: true }); }
  await page.goto("/home"); await page.getByRole("button", { name: "Butuh bantuan?" }).click(); await page.getByLabel("Tulis pertanyaan Anda").fill("Ada perpustakaan?"); await page.getByRole("button", { name: "Kirim" }).click(); await expect(page.getByRole("dialog")).toContainText("perpustakaan", { ignoreCase: true }); await page.screenshot({ path: "test-results/milestone-5/concierge-desktop-answer.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [name, path] of [["entrance-mobile", "/"], ["home-mobile", "/home"]] as [string, string][]) { await page.goto(path); await page.screenshot({ path: `test-results/milestone-5/${name}.png`, fullPage: true }); }
  await page.goto("/home"); await page.getByRole("button", { name: "Butuh bantuan?" }).click(); await page.getByLabel("Tulis pertanyaan Anda").fill("Ada perpustakaan?"); await page.getByRole("button", { name: "Kirim" }).click(); await expect(page.getByRole("dialog")).toContainText("perpustakaan", { ignoreCase: true }); await page.screenshot({ path: "test-results/milestone-5/concierge-mobile-answer.png", fullPage: true });
});
