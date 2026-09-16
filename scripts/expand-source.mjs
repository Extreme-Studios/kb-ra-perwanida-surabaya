import { load } from "cheerio";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const pages = JSON.parse(await readFile("work/source/pages.json","utf8"));
const seenContent=new Set();
const unique=pages.filter(p=>{if(p.status!==200||seenContent.has(p.text))return false;seenContent.add(p.text);return true;});
const origin="https://kbraperwanida.sch.id";
const visited=new Set(pages.map(p=>p.url));
const semantic=new Set();
const queue=[];
async function discover(p) {
 const $=load(await readFile("work/source/"+p.id+".html","utf8"));
 $("header,footer,nav,script,style").remove();
 $("a[href]").each((_,el)=>{
  const href=$(el).attr("href"); if(!href||href.startsWith("#")||href.startsWith("javascript:"))return;
  const u=new URL(href,p.url); if(u.hostname!=="kbraperwanida.sch.id"||/\.(png|jpg|jpeg|pdf|gif|webp)$/i.test(u.pathname)||u.pathname.endsWith("index.html"))return;
  const key=u.pathname.includes("eyJ")?u.pathname.split("/eyJ")[0]+"|"+$(el).text().trim()+"|"+($(el).find("img").attr("src")??""):u.href;
  if(!visited.has(u.href)&&!semantic.has(key)){semantic.add(key);visited.add(u.href);queue.push(u.href);}
 });
}
for(const p of unique)await discover(p);
let n=0;
while(queue.length&&n<160){
 const batch=queue.splice(0,3);
 await Promise.all(batch.map(async url=>{
  n++;
  try{
   const response=await fetch(url,{signal:AbortSignal.timeout(20000)});const html=await response.text();const $=load(html);
   const id=createHash("sha256").update(url).digest("hex").slice(0,12);
   await writeFile("work/source/"+id+".html",html);
   const b=$("body").clone(); b.find("script,style,header,footer,nav").remove();
   const p={id,url,status:response.status,title:$("title").text().trim(),text:b.text().replace(/\s+/g," ").trim(),
    links:$("a[href]").map((_,el)=>{try{return new URL($(el).attr("href"),url).href;}catch{return "";}}).get(),
    images:[...new Set($("img").map((_,el)=>new URL($(el).attr("src"),url).href).get())]};
   pages.push(p);if(response.ok)await discover(p);
   console.log(p.status,url.slice(0,100),p.text.length);
  }catch(error){pages.push({url,status:0,error:String(error)});}
 }));
}
const ids=[...new Set((await readFile("work/source/c2926c412af4.html","utf8")).matchAll(/modalJabatanGuru\((\d+)\)/g).map(m=>m[1]))];
const roles=[];
for(let i=0;i<ids.length;i+=3)await Promise.all(ids.slice(i,i+3).map(async id=>{
 const url=origin+"/guru-detail-jabatan/"+id;
 try{const response=await fetch(url,{signal:AbortSignal.timeout(15000)}); const data=await response.json();roles.push({id,url,status:response.status,data});}catch(error){roles.push({id,url,status:0,error:String(error)});}
}));
await writeFile("work/source/pages.json",JSON.stringify(pages,null,2));
await writeFile("work/source/roles.json",JSON.stringify(roles,null,2));
console.log("ADDED",n,"REMAINING",queue.length,"ROLES",roles.length);
