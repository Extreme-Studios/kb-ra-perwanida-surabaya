import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {entranceTiming} from "../../src/data/content/entrance";

test("Entrance root, metadata, assets, responsive viewports and accessible hotspots",async({page})=>{
 test.setTimeout(90000);
 const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});
 expect((await page.goto("/"))?.status()).toBe(200);
 await expect(page).toHaveTitle("KB-RA Perwanida Surabaya");
 await expect(page.locator("h1")).toHaveCount(1);
 await expect(page.locator(".site-header")).toHaveCount(0);
 await expect(page.locator(".entrance-hotspot")).toHaveCount(4);
 for(const [width,height] of [[320,640],[375,812],[390,844],[430,932],[768,1024],[1024,768],[1280,800],[1440,900],[1920,1080],[844,390]]){
  await page.setViewportSize({width,height});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),String(width)).toBe(true);
  const button=page.getByRole("button",{name:"Masuk ke Perwanida",exact:true});
  const box=await button.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(44);
  if(height>=640)expect(box!.y+box!.height).toBeLessThanOrEqual(height);
  for(const hotspot of await page.locator(".entrance-hotspot").all()){const rect=await hotspot.boundingBox();expect(rect!.height).toBeGreaterThanOrEqual(44);}
 }
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});
  expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
 }
 for(const img of await page.locator("img").all()){await expect(img).toHaveJSProperty("complete",true);expect(await img.evaluate((i:HTMLImageElement)=>i.naturalWidth)).toBeGreaterThan(0);}
 expect(errors).toEqual([]);
});

test("Click, native history Back, Space and Enter; repeat entry is usable",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"Masuk ke Perwanida",exact:true}).click();
 await expect(page.locator(".entrance")).toHaveAttribute("data-entering","true");
 await expect(page).toHaveURL(/\/home$/);
 await page.goBack();
 await expect(page).toHaveURL("http://localhost:3215/");
 await expect(page.locator(".entrance")).toHaveAttribute("data-entering","false");
 for(const key of ["Space","Enter"]){
  await page.getByRole("button",{name:"Masuk ke Perwanida",exact:true}).focus();
  await page.keyboard.press(key);
  await expect(page).toHaveURL(/\/home$/);
  await page.goBack();
  await expect(page.locator(".entrance")).toHaveAttribute("data-entering","false");
 }
 await page.goto("/profil/guru-tendik");await page.reload();await expect(page.locator(".person-card")).toHaveCount(37);
 await page.goto("/home");await expect(page.locator(".welcome")).toBeVisible();await expect(page.locator(".entrance")).toHaveCount(0);
});

test("Hotspot info, focus return, keyboard trapping and real contextual navigation",async({page})=>{
 await page.goto("/");
 for(const id of ["program","fasilitas","galeri","spmb"]){
  const opener=page.locator(".entrance-hotspot-"+id);await opener.click();
  const dialog=page.getByRole("dialog");await expect(dialog).toBeVisible();
  await expect(dialog.locator("h2")).not.toBeEmpty();
  if(id==="spmb"){await expect(dialog).toContainText("2026-2027");await expect(dialog).toContainText("Hubungi sekolah");await expect(dialog).not.toContainText("masih dibuka");}
  for(let i=0;i<5;i++){await page.keyboard.press("Tab");expect(await dialog.evaluate(e=>e.contains(document.activeElement))).toBe(true);}
  expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");await expect(dialog).not.toBeVisible();await expect(opener).toBeFocused();
 }
 await page.locator(".entrance-hotspot-program").click();
 await page.getByRole("link",{name:"Lihat lebih lanjut"}).click();
 await expect(page).toHaveURL(/\/program$/);await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("Touch entry and hotspot on mobile",async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 const page=await context.newPage();await page.goto("http://localhost:3215/");
 await page.locator(".entrance-hotspot-fasilitas").tap();await expect(page.getByRole("dialog")).toBeVisible();
 await page.getByRole("button",{name:"Tutup informasi"}).tap();
 await page.getByRole("button",{name:"Masuk ke Perwanida",exact:true}).tap();await expect(page).toHaveURL(/\/home$/);await context.close();
});

test("Reduced motion removes transforms and uses short transition",async({page})=>{
 await page.emulateMedia({reducedMotion:"reduce"});await page.goto("/");
 await page.mouse.move(400,450);
 expect(await page.locator(".entrance-photograph").evaluate(e=>getComputedStyle(e).transform)).toBe("none");
 expect(entranceTiming.reduced).toBeLessThan(200);expect(entranceTiming.normal).toBeGreaterThanOrEqual(500);expect(entranceTiming.normal).toBeLessThanOrEqual(900);
 await page.getByRole("button",{name:"Masuk ke Perwanida",exact:true}).click();
 await expect(page).toHaveURL(/\/home$/);
});

test("No-JavaScript fallback has a real link and functional native form",async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const page=await context.newPage();await page.goto("http://localhost:3215/");
 await expect(page.getByRole("link",{name:"Masuk ke Perwanida →",exact:true})).toHaveAttribute("href","/home");
 await page.getByRole("button",{name:"Masuk ke Perwanida",exact:true}).click();
 await expect(page).toHaveURL(/\/home\/?(?:\?)?$/);
 await page.goto("http://localhost:3215/");await page.getByRole("link",{name:"Masuk ke Perwanida →",exact:true}).click();await expect(page).toHaveURL(/\/home$/);await context.close();
});

test("Entrance screenshots: desktop, mobile, open hotspot and reduced motion",async({page})=>{
 for(const [name,width,height,motion] of [["desktop",1440,900,"no-preference"],["mobile",390,844,"no-preference"],["reduced-motion",1440,900,"reduce"]] as const){
  await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:motion});await page.goto("/");
  for(const img of await page.locator("img").all())await expect(img).toHaveJSProperty("complete",true);
  await page.screenshot({path:"test-results/milestone-3/"+name+".png",fullPage:true});
 }
 await page.emulateMedia({reducedMotion:"no-preference"});
 await page.locator(".entrance-hotspot-spmb").click();
 await page.screenshot({path:"test-results/milestone-3/hotspot-desktop.png",fullPage:true});
});

