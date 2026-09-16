import { test, expect } from "@playwright/test";

const answer = { answer: "KB-RA Perwanida memiliki kegiatan ekstrakurikuler Wushu. Silakan lihat halaman ekstrakurikuler untuk daftar lengkap.", sources: [{ title: "Ekstrakurikuler", href: "/galeri/ekstrakurikuler" }], fallback: false, suggestedActions: [] };
const fallback = { answer: "Informasi tersebut belum tersedia di website Perwanida.", sources: [], fallback: true, suggestedActions: [{ label: "Hubungi Admin Perwanida", href: "https://wa.me/6280000000000" }] };
const unavailable = { answer: "Maaf, Sahabat Perwanida sedang tidak dapat menjawab. Anda tetap dapat mencari informasi melalui menu website atau menghubungi sekolah.", sources: [], fallback: true, suggestedActions: [{ label: "Hubungi Admin Perwanida", href: "https://wa.me/6280000000000" }] };

async function mockAnswer(page: import("@playwright/test").Page, body: unknown = answer) {
  await page.route("**/api/concierge", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify(body) }));
}

test("Concierge is only mounted in the main website shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".concierge-trigger")).toHaveCount(0);
  await page.screenshot({ path: "test-results/milestone-4/entrance-no-chat.png", fullPage: true });
  await page.goto("/home");
  await expect(page.locator(".concierge-trigger")).toBeVisible();
  await page.screenshot({ path: "test-results/milestone-4/home-closed.png", fullPage: true });
});

test("Desktop chat opens, answers with server sources, and survives route navigation plus refresh", async ({ page }) => {
  await mockAnswer(page); await page.setViewportSize({ width: 1440, height: 900 }); await page.goto("/home");
  const trigger = page.getByRole("button", { name: "Butuh bantuan?" }); await trigger.click();
  const dialog = page.getByRole("dialog"); await expect(dialog).toBeVisible(); await expect(dialog).toContainText("Asisten AI Perwanida");
  await page.screenshot({ path: "test-results/milestone-4/home-open.png", fullPage: true });
  await page.getByLabel("Tulis pertanyaan Anda").fill("Ada ekstrakurikuler wushu?"); await page.getByRole("button", { name: "Kirim" }).click();
  await expect(dialog).toContainText("kegiatan ekstrakurikuler Wushu"); await expect(dialog.getByRole("link", { name: "Ekstrakurikuler" })).toHaveAttribute("href", "/galeri/ekstrakurikuler");
  await page.screenshot({ path: "test-results/milestone-4/desktop-answer.png", fullPage: true });
  await dialog.getByRole("link", { name: "Ekstrakurikuler" }).click(); await expect(page).toHaveURL(/\/galeri\/ekstrakurikuler$/);
  await page.getByRole("button", { name: "Butuh bantuan?" }).click(); await expect(page.getByRole("dialog")).toContainText("kegiatan ekstrakurikuler Wushu");
  await page.keyboard.press("Escape"); await page.reload(); await page.getByRole("button", { name: "Butuh bantuan?" }).click(); await expect(page.getByRole("dialog")).toContainText("kegiatan ekstrakurikuler Wushu");
  await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).not.toBeVisible(); await expect(trigger).toBeFocused();
});

test("Fallback and unavailable states remain useful", async ({ page }) => {
  await mockAnswer(page, fallback); await page.goto("/home"); await page.getByRole("button", { name: "Butuh bantuan?" }).click();
  await page.getByLabel("Tulis pertanyaan Anda").fill("Berapa biaya masuk?"); await page.getByRole("button", { name: "Kirim" }).click();
  await expect(page.getByRole("dialog")).toContainText("Informasi tersebut belum tersedia"); await expect(page.getByRole("link", { name: "Hubungi Admin Perwanida" })).toBeVisible();
  await page.screenshot({ path: "test-results/milestone-4/fallback.png", fullPage: true });
  await page.unroute("**/api/concierge"); await mockAnswer(page, unavailable); await page.getByLabel("Tulis pertanyaan Anda").fill("Apa fasilitas sekolah?"); await page.getByRole("button", { name: "Kirim" }).click();
  await expect(page.getByRole("dialog")).toContainText("sedang tidak dapat menjawab"); await page.screenshot({ path: "test-results/milestone-4/api-unavailable.png", fullPage: true });
});

test("Mobile panel is a usable bottom sheet and answer stays visible", async ({ page }) => {
  await mockAnswer(page); await page.setViewportSize({ width: 390, height: 844 }); await page.goto("/home");
  await page.getByRole("button", { name: "Butuh bantuan?" }).click(); const dialog = page.getByRole("dialog"); await expect(dialog).toBeVisible();
  const dialogBox = await dialog.boundingBox(); expect(dialogBox!.height).toBeGreaterThan(500); expect(dialogBox!.y + dialogBox!.height).toBeLessThanOrEqual(844);
  await page.screenshot({ path: "test-results/milestone-4/mobile-open.png", fullPage: true });
  await page.getByLabel("Tulis pertanyaan Anda").fill("Ada ekstrakurikuler wushu?"); await page.getByRole("button", { name: "Kirim" }).click(); await expect(dialog).toContainText("kegiatan ekstrakurikuler Wushu");
  await page.screenshot({ path: "test-results/milestone-4/mobile-answer.png", fullPage: true });
});
