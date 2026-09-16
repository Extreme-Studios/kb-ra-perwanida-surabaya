import { load } from "cheerio";
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const origin = "https://kbraperwanida.sch.id";
await mkdir("work/source", {recursive:true});
const queue = [origin + "/"];
const visited = new Set();
const pages = [];
const semanticLinks = new Set();
const clean = text => text.replace(/\s+/g, " ").trim();
while (queue.length && visited.size < 150) {
  const batch = queue.splice(0, 3).filter(url => !visited.has(url));
  batch.forEach(url => visited.add(url));
  await Promise.all(batch.map(async url => {
    try {
      const response = await fetch(url, {signal:AbortSignal.timeout(25000)});
      const html = await response.text();
      const $ = load(html);
      const id = createHash("sha256").update(url).digest("hex").slice(0,12);
      await writeFile("work/source/" + id + ".html", html);
      const links = [...new Set($("a[href]").map((_,el)=>{ try { return new URL($(el).attr("href"), url).href.split("#")[0]; } catch { return ""; } }).get())];
      const images = [...new Set($("img").map((_,el)=>{try{return new URL($(el).attr("src"),url).href;}catch{return "";}}).get())];
      const backgrounds = [...html.matchAll(/(?:url\(['"]?|data-background=["'])([^'")]+\.(?:jpg|jpeg|png|webp))/gi)].map(m=>new URL(m[1],url).href);
      const body = $("body").clone(); body.find("script,style,header,footer,nav").remove();
      const page = {id, url, status:response.status, title:clean($("title").text()), text:clean(body.text()), links, images:[...new Set([...images,...backgrounds])]};
      pages.push(page);
      // The source regenerates encrypted menu tokens on each response. Crawl the
      // shared navigation once; deduplicate encrypted content links by label/image.
      const scope = url === origin + "/" ? $("body") : body;
      for (const element of scope.find("a[href]").toArray()) {
        const link = new URL($(element).attr("href"), url).href.split("#")[0];
        const parsed = new URL(link);
        if (parsed.hostname.replace(/^www\./,"") !== "kbraperwanida.sch.id" || !["https:","http:"].includes(parsed.protocol)) continue;
        if (/\.(jpg|jpeg|png|gif|webp|pdf|css|js|ico|zip)$/i.test(parsed.pathname) || /logout|login|admin|delete/i.test(parsed.pathname)) continue;
        const normalized = origin + parsed.pathname + parsed.search;
        const semanticKey = parsed.pathname.includes("/eyJ") ? parsed.pathname.split("/eyJ")[0] + "|" + clean($(element).text()) + "|" + ($(element).find("img").attr("src") ?? "") : normalized;
        if (semanticLinks.has(semanticKey)) continue;
        semanticLinks.add(semanticKey);
        if (!visited.has(normalized) && !queue.includes(normalized)) queue.push(normalized);
      }
      console.log(response.status, url, images.length + " images", page.text.length + " chars");
    } catch(error) { pages.push({url,status:0,error:String(error)}); console.log("FAILED",url,String(error)); }
  }));
}
await writeFile("work/source/pages.json", JSON.stringify(pages,null,2));
console.log("TOTAL",pages.length,"REMAINING",queue.length);
