import {readFile,writeFile} from "node:fs/promises";
import {load} from "cheerio";
const pages=JSON.parse(await readFile("work/source/pages.json","utf8")), videos=new Map();
for(const p of pages.filter(p=>p.status===200&&new URL(p.url).pathname==="/video")){
 const $=load(await readFile("work/source/"+p.id+".html","utf8"));
 $('section a[href*="youtu"]').each((_,e)=>{const url=$(e).attr("href");videos.set(url,{url});});
}
const results=[];
const items=[...videos.values()];
for(let i=0;i<items.length;i+=6){
 await Promise.all(items.slice(i,i+6).map(async ({url})=>{
  try{const r=await fetch("https://www.youtube.com/oembed?format=json&url="+encodeURIComponent(url),{signal:AbortSignal.timeout(10000)});
   results.push({url,status:r.status,availability:r.ok?"available":[401,403,404].includes(r.status)?"unavailable":"unchecked"});
  }catch(error){results.push({url,status:0,availability:"unchecked",error:String(error)});}
 }));
 console.log("Checked",Math.min(i+6,items.length),"/",items.length);
}
await writeFile("src/data/content/video-availability.json",JSON.stringify(results,null,2));
console.log(results.reduce((a,v)=>{a[v.availability]=(a[v.availability]??0)+1;return a;},{}));
