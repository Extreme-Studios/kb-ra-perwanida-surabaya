import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
const pages=JSON.parse(await readFile("work/source/pages.json","utf8"));
const references=new Map();
for(const p of pages.filter(p=>p.status===200))for(const raw of p.images??[]){
 try{const url=new URL(raw);if(url.hostname!=="kbraperwanida.sch.id")continue;
 if(!url.pathname.startsWith("/files/")&&!url.pathname.includes("logo-kb-ra"))continue;
 const key=url.href;if(!references.has(key))references.set(key,{url:key,sourceIds:[]});
 references.get(key).sourceIds.push("source-"+p.id);
 }catch{}
}
const groups={guru:"teachers",komite:"teachers",item_fasilitas:"facilities",tentang_kami:"school",galeri_kegiatan:"gallery",galeri_prestasi:"gallery",galeri_agenda:"gallery",galeri_extrakurikuler:"extracurriculars",item_kurikulum:"programs",video:"video",testimoni:"testimonials",background_header:"school"};
const manifest=[], hashes=new Map();
const refs=[...references.values()];
for(let i=0;i<refs.length;i+=4){
 await Promise.all(refs.slice(i,i+4).map(async entry=>{
  try{
   const response=await fetch(entry.url,{signal:AbortSignal.timeout(25000)});if(!response.ok)throw new Error("HTTP "+response.status);
   const bytes=Buffer.from(await response.arrayBuffer());const meta=await sharp(bytes).metadata();
   if(!meta.width||!meta.height)throw new Error("Invalid image");
   const hash=createHash("sha256").update(bytes).digest("hex");
   const pathname=decodeURIComponent(new URL(entry.url).pathname);
   const group=pathname.includes("logo-kb-ra")?"brand":groups[pathname.split("/")[2]]??"gallery";
   const stem=pathname.split("/").pop().replace(/\.[^.]+$/,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(-70);
   const extension=meta.format==="jpeg"?"jpg":meta.format;
   const duplicateOf=hashes.get(hash);
   const src=duplicateOf??"/images/"+group+"/"+stem+"-"+hash.slice(0,8)+"."+extension;
   if(!duplicateOf){hashes.set(hash,src);await mkdir("public/images/"+group,{recursive:true});await writeFile("public"+src,bytes);}
   manifest.push({...entry,sourceIds:[...new Set(entry.sourceIds)],id:"asset-"+hash.slice(0,12),src,width:meta.width,height:meta.height,bytes:bytes.length,hash,status:"verified",duplicateOf:duplicateOf??null});
  }catch(error){manifest.push({...entry,status:"pending",error:String(error),src:null});}
 }));
 console.log("Assets",Math.min(i+4,refs.length)+"/"+refs.length);
}
await mkdir("src/data/content",{recursive:true});
await writeFile("src/data/content/asset-manifest.json",JSON.stringify(manifest,null,2));
const selected=manifest.filter(a=>a.src&&(/\/school\/|\/gallery\/|\/facilities\/|\/brand\//.test(a.src)));
const thumbs=await Promise.all(selected.map(async(a,i)=>({input:await sharp("public"+a.src).resize(220,150,{fit:"contain",background:"#ffffff"}).png().toBuffer(),left:(i%5)*220,top:Math.floor(i/5)*180})));
const labels=selected.map((a,i)=>'<text x="'+((i%5)*220+5)+'" y="'+(Math.floor(i/5)*180+170)+'" font-size="14">'+i+' '+a.src.split("/")[2]+'</text>').join("");
await mkdir("work",{recursive:true});
await sharp({create:{width:1100,height:Math.ceil(selected.length/5)*180,channels:3,background:"#eeeeee"}}).composite([...thumbs,{input:Buffer.from('<svg width="1100" height="'+Math.ceil(selected.length/5)*180+'">'+labels+'</svg>'),left:0,top:0}]).png().toFile("work/assets-contact-sheet.png");
await writeFile("work/selected-assets.json",JSON.stringify(selected.map((a,i)=>({index:i,src:a.src,url:a.url})),null,2));
console.log("Unique",hashes.size,"failed",manifest.filter(a=>!a.src).length);
