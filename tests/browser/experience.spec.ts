import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { routes } from "../../src/config/routes";

async function loadImages(page: Page) {
  for (const image of await page.locator("main img").all()) {
    if (!await image.isVisible()) continue;
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty("complete", true);
    expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  }
}
test("Core pages: all widths, images, accessible content and internal destinations", async ({page}) => {
  test.setTimeout(180000);
  const paths=["/home","/profil/tentang-kami","/program","/profil/guru-tendik","/profil/fasilitas","/galeri","/galeri/ekstrakurikuler","/berita","/spmb","/kontak","/multimedia/video"];
  const errors:string[]=[];
  page.on("pageerror",e=>errors.push(e.message));
  page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});
  const titles=new Set<string>(),descriptions=new Set<string>();
  for(const path of paths) {
    await page.goto(path);
    titles.add(await page.title());
    descriptions.add(await page.locator('meta[name="description"]').getAttribute("content")??"");
    for(const width of [320,375,390,430,768,1024,1280,1440,1920]) {
      await page.setViewportSize({width,height:1000});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path+" "+width).toBe(true);
    }
    await loadImages(page);
    const links=await page.locator('a[href^="/"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute("href")!));
    for(const link of links) {
      const pathOnly=link.split(/[?#]/)[0];
      expect(pathOnly.startsWith("/documents/") || routes.some(route=>route.path===pathOnly),link).toBe(true);
    }
    for(const width of [390,1440]) {
      await page.setViewportSize({width,height:1000});
      const audit=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();
      expect(audit.violations,path+" "+width).toEqual([]);
    }
    await expect(page.locator("main")).not.toContainText(/Milestone|lorem ipsum|Preview fondasi|Gemini/);
  }
  expect(titles.size).toBe(paths.length);
  expect(descriptions.size).toBe(paths.length);
  expect(errors).toEqual([]);
});
test("Gallery opens, traps focus, switches photo, closes and restores focus",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/galeri");
  const opener=page.getByRole("button",{name:/Buka foto:/}).first();
  await opener.click();
  const dialog=page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("1 / 4");
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toContainText("2 / 4");
  for(let i=0;i<8;i++){await page.keyboard.press("Tab");expect(await dialog.evaluate(e=>e.contains(document.activeElement))).toBe(true);}
  expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  expect(await page.evaluate(()=>document.body.style.overflow)).not.toBe("hidden");
  await opener.click();
  await page.getByRole("button",{name:"Tutup foto"}).click();
  await expect(opener).toBeFocused();
});
test("Real content: complete people, activities, archive video, news gap and SPMB document",async({page,request})=>{
  await page.goto("/profil/guru-tendik");
  await expect(page.locator(".person-card")).toHaveCount(37);
  await page.goto("/galeri/ekstrakurikuler");
  await expect(page.locator(".activity")).toHaveCount(7);
  for(const body of await page.locator(".activity-body").all()) expect((await body.textContent())!.trim().length).toBeGreaterThan(20);
  for(const summary of await page.locator(".activity summary").all()) {
    await summary.click();
    await summary.click();
  }
  await page.goto("/multimedia/video?page=10");
  await expect(page.locator(".video-card")).toHaveCount(4);
  expect((await page.goto("/multimedia/video?page=11"))?.status()).toBe(404);
  await page.goto("/berita");
  await expect(page.getByRole("heading",{name:"Artikel belum tersedia"})).toBeVisible();
  expect((await page.goto("/berita/artikel-fiktif"))?.status()).toBe(404);
  await page.goto("/spmb");
  const brochure=page.getByRole("link",{name:/Baca brosur resmi/});
  const response=await request.get((await brochure.getAttribute("href"))!);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  await expect(page.getByRole("link",{name:"Pendaftaran online",exact:true})).toHaveAttribute("href","https://my.kbraperwanida.sch.id/formulir");
  await page.goto("/kontak");
  await expect(page.locator('main a[href="https://wa.me/6285606432431"]')).toBeVisible();
});
test("Final full-page screenshots with loaded photography",async({page})=>{
  test.setTimeout(120000);
  const shots=[
    ["home-desktop","/home",1440],["home-mobile","/home",390],["about","/profil/tentang-kami",1440],
    ["program","/program",1440],["guru-tendik","/profil/guru-tendik",1440],["gallery","/galeri",1440],["spmb","/spmb",1440]
  ] as const;
  for(const [name,path,width] of shots) {
    await page.setViewportSize({width,height:1000});
    await page.goto(path);
    await loadImages(page);
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:"test-results/milestone-2/"+name+".png",fullPage:true});
  }
});
