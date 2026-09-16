// Deterministic extraction from archived official HTML, never from rendered UI copy.
import { readFile, writeFile } from "node:fs/promises";
import { load } from "cheerio";
const pages=JSON.parse(await readFile("work/source/pages.json","utf8"));
const assets=JSON.parse(await readFile("src/data/content/asset-manifest.json","utf8"));
const roles=JSON.parse(await readFile("work/source/roles.json","utf8"));
const clean=s=>s.replace(/\s+/g," ").trim();
const slug=s=>s.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const byPath=path=>pages.find(p=>new URL(p.url).pathname===path&&p.status===200);
async function dom(p){return load(await readFile("work/source/"+p.id+".html","utf8"));}
const sid=p=>"source-"+p.id;
function media(url,alt,p){
 const key=new URL(url,p.url).href;const asset=assets.find(a=>a.url===key);
 if(!asset?.src)return null;
 return {id:asset.id,src:asset.src,alt,width:asset.width,height:asset.height,status:"verified",sourceIds:[sid(p)]};
}
function record(id,title,path,category,p,body=[],images=[]){
 return {id,slug:id,title,category,summary:body[0]??null,body,keywords:[title],relatedPage:path,relatedPages:[],updatedAt:null,status:"verified",sourceIds:[sid(p)],images:images.filter(Boolean)};
}
const hp=byPath("/"), home=await dom(hp), ap=byPath("/about"), about=await dom(ap);
const sectionList=heading=>about("h2").filter((_,e)=>clean(about(e).text())===heading).parent().find("li").map((_,e)=>clean(about(e).text())).get();
const historyOriginal=about(".about-section li").map((_,e)=>clean(about(e).text())).get().slice(6);
const historyBody=historyOriginal.map(t=>t.replace(/\s*\(24 TH\)/,"").replace(/ dengan jumlah peserta didik sekarang 204 siswa\./,"."));
const schoolPhotos=home(".about-section img").map((i,e)=>media(home(e).attr("src"),i===0?"Ustadzah mendampingi anak-anak dalam kegiatan di Perwanida":"Anak dan ustadzah dalam dokumentasi kegiatan Perwanida",hp)).get();
const logo=media(home('header img[src*="logo-kb-ra"]').first().attr("src"),"Logo asli KB-RA Perwanida",hp);
const tp=byPath("/guru-dan-tendik"), teachersDOM=await dom(tp), people=[];
teachersDOM(".our-teachers > .container > .row").each((_,row)=>{
 const group=clean(teachersDOM(row).prev(".sec-title").text());
 teachersDOM(row).find(".teachers-block-one").each((_,el)=>{
  const box=teachersDOM(el), name=clean(box.find("h3").text()),role=clean(box.find(".designation").text());
  const originalId=box.find("[onclick]").attr("onclick")?.match(/\d+/)?.[0];
  const extra=roles.find(r=>r.id===originalId&&r.status===200);
  const person={...record("person-"+originalId,name,"/profil/guru-tendik","pendidik",tp),role,group,photo:media(box.find("img").attr("src"),name+" — "+role,tp),
   additionalRoles:extra?.data.jabatan.map(j=>j.jabatan)??[],updatedAt:extra?.data.guru.updated_at??null,
   needsVerification:true,verificationNote:group==="Guru Alumni"?"Arsip guru alumni sesuai periode pada sumber.":"Susunan dan jabatan mengikuti website sekolah; konfirmasi untuk tahun ajaran berjalan."};
  // Deliberately do not import personal phone numbers or personnel IDs from the public role response.
  if (extra) person.sourceIds.push("source-role-" + originalId);
  people.push(person);
 });
});
const cp=byPath("/komite"), committeeDOM=await dom(cp),committee=[];
committeeDOM(".our-teachers > .container > .row").each((_,row)=>{
 const group=clean(committeeDOM(row).prev(".sec-title").text());
 committeeDOM(row).find(".teachers-block-one").each((_,el)=>{
  const box=committeeDOM(el),name=clean(box.find("h3").text());
  committee.push({...record("committee-"+slug(name),name,"/profil/komite","komite",cp),role:clean(box.find(".designation").text()),group,
   photo:media(box.find("img").attr("src"),name,cp),needsVerification:true,verificationNote:"Arsip komite "+group+". Bukan konfirmasi pengurus tahun ajaran berjalan."});
 });
});
const fp=byPath("/all-fasilitas"), facilityDOM=await dom(fp);
const facilities=facilityDOM(".service-block-one").map((i,el)=>{
 const box=facilityDOM(el),title=clean(box.find("h3").text()),text=clean(box.find("p").text());
 return record(["facility-classroom","facility-playground","facility-library"][i]??"facility-"+slug(title),title,"/profil/fasilitas","fasilitas",fp,text&&text!=="-"?[text]:[],[media(box.find("img").attr("src"),title,fp)]);
}).get();
const extras=home(".service-section .service-block-one").map((_,el)=>{
 const box=home(el),title=clean(box.find("h3").text());
 const r=record("extra-"+slug(title),title,"/galeri/ekstrakurikuler","ekstrakurikuler",hp,[clean(box.find(".text").text())]);
 if(title==="Futsal"){const a=assets.find(a=>/galeri_kegiatan.*Futsal/i.test(a.url));if(a)r.images=[media(a.url,"Anak bermain futsal di halaman Perwanida",hp)];}
 return r;
}).get();
const kp=byPath("/kurikulum"), kd=await dom(kp);
const curriculum=record("program-kurikulum","Kurikulum","/program/kurikulum","program",kp,[clean(kd(".service-block-one h3").text())]);
curriculum.needsVerification=true;curriculum.verificationNote="Rujukan kurikulum mengikuti informasi pada website sekolah.";
const curriculumItems=kd(".classes-section .inner-block").map((_,e)=>{
 const b=kd(e),t=clean(b.find("h3").text());return record("curriculum-"+slug(t),t,"/program/kurikulum","kurikulum",kp,[],[media(b.find("img").attr("src"),t,kp)]);
}).get();
const featured=[["character","Character Building","character-building"],["budaya","Cinta Budaya Indonesia","cinta-budaya-indonesia"],["literasi","Gerakan Literasi","gerakan-literasi"],["green","Green School","green-school"],["ummi","Mengaji Metode UMMI","mengaji-metode-ummi"]];
const programs=[];
for(const [id,title,path] of featured){
 const p=pages.find(p=>p.status===200&&p.url.includes("/program-pokok/")&&p.text.includes(title)),$=await dom(p);
 const text=clean($(".service-block-one h3").first().text());
 programs.push({...record("program-"+id,title,"/program/unggulan/"+path,"program",p,text&&text!=="-"?[text]:[]),kind:"featured"});
}
const pp=byPath("/program-penunjang"),pd=await dom(pp);
programs.push({...curriculum,kind:"curriculum"},{...record("program-penunjang","Program Penunjang","/program/penunjang","program",pp,[clean(pd(".service-block-one h3").text())]),kind:"supporting"});
const sp=byPath("/all-program-sekolah"),sd=await dom(sp);
const schoolPrograms=sd(".offer-section h3").map((_,e)=>{const t=clean(sd(e).text());return record("school-program-"+slug(t),t,"/program/penunjang","program-sekolah",sp);}).get();
const gallery=[];
for(const path of ["/galeri-kegiatan","/galeri-extrakurikuler","/galeri-prestasi","/galeri-agenda"]){
 const p=byPath(path),$=await dom(p);
 $("section img").each((i,el)=>{
  const image=$(el),nearest=image.closest(".inner-box,.inner-block,.gallery-block-one,.gallery-block-two,.gallery-block");
  let title=clean(nearest.find("h3,h4,h5").first().text());
  if(!title)title=path==="/galeri-agenda"?"EVENT FEBRUARI 2025":path==="/galeri-prestasi"?"Dokumentasi prestasi Perwanida":"Dokumentasi kegiatan Perwanida";
  const asset=media(image.attr("src"),title,p);if(!asset)return;
  // Same source photo can appear in multiple categories; keep one record with related pages.
  const existing=gallery.find(g=>g.images[0].id===asset.id);
  const related=path==="/galeri-agenda"?"/galeri/agenda":path==="/galeri-prestasi"?"/galeri/prestasi":"/galeri";
  if(existing){existing.sourceIds.push(sid(p));existing.relatedPages.push(related);if(!title.startsWith("Gambar")&&!title.startsWith("Dokumentasi")){existing.title=title;existing.images[0].alt=title;}return;}
  gallery.push({...record("gallery-"+asset.id,title,related,"galeri",p,[],[asset]),needsVerification:/2025|prestasi/i.test(title),verificationNote:"Dokumentasi arsip; tanggal kegiatan tidak selalu dicantumkan."});
 });
}
const testimonials=home(".testimonial-style-two .testimonial-block-two").map((i,el)=>{
 const b=home(el),name=clean(b.find("h5").text()),text=clean(b.find(".text").text());
 return {...record("testimonial-"+slug(name),name,"/home","testimoni",hp,[text]),attribution:clean(b.find(".designation").text()),consentConfirmed:false,publicationBasis:"official-public-source",complete:i===0,needsVerification:i!==0,verificationNote:i===0?"Dipublikasikan pada website resmi sekolah.":"Teks sudah terpotong pada HTML sumber; tidak ditampilkan sebagai kutipan lengkap."};
}).get();
const videos=[];
const videoPages=pages.filter(p=>p.status===200&&new URL(p.url).pathname==="/video");
for(const p of videoPages){
 const $=await dom(p);$(".classes-section .inner-block").each((_,el)=>{
  const b=$(el),videoUrl=b.find('a[href*="youtu"]').attr("href");if(!videoUrl)return;
  const u=new URL(videoUrl),videoId=u.hostname==="youtu.be"?u.pathname.slice(1):u.searchParams.get("v")??u.pathname.split("/").pop();
  if(videos.some(v=>v.videoId===videoId))return;
  const title=clean(b.find("h3").text()),text=clean(b.find(".text").text());
  videos.push({...record("video-"+videoId,title,"/multimedia/video","video",p,text?[text]:[]),videoUrl,videoId,image:media(b.find("img").attr("src"),title,p),availability:"unchecked",needsVerification:true,verificationNote:"Arsip video dari website resmi; tanggal publikasi tidak dicantumkan."});
 });
}
const ip=byPath("/informasi-ppdb"),ipd=await dom(ip);
const info=byPath("/information-ppdb");
const posterAsset=assets.find(a=>a.url.includes("/information_ppdb/")&&a.src);
const contact=record("school-contact","Kontak Sekolah","/kontak","kontak",byPath("/kontak"));
Object.assign(contact,{address:"Jl. Ketintang Madya V No. 92-K, Ketintang, Surabaya, Jawa Timur 60231",phone:"(031) 8271187",mobile:"085606432431",email:"kbraperwanida@gmail.com",whatsappUrl:"https://wa.me/6285606432431",directionsUrl:"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent("Jl. Ketintang Madya V No. 92-K, Ketintang, Surabaya, Jawa Timur 60231")});
contact.sourceIds.push(sid(info));
const data={
 identity:{id:"kb-ra-perwanida-surabaya",name:"KB-RA Perwanida Surabaya",shortName:"KB-RA Perwanida",city:"Surabaya",logo,sourceIds:[sid(hp)]},
 contact,
 vision:record("school-vision","Visi","/profil/tentang-kami","profil",ap,["Terwujudnya Generasi Islam yang Berilmu, Beramal dan Berakhlaq Mulia."]),
 mission:record("school-mission","Misi","/profil/tentang-kami","profil",ap,sectionList("MISI")),
 objectives:record("school-objectives","Tujuan","/profil/tentang-kami","profil",ap,sectionList("TUJUAN")),
 history:{...record("school-history","Sejarah Sekolah","/profil/tentang-kami","profil",ap,historyBody),originalBody:historyOriginal,needsVerification:true,verificationNote:"Sumber mencantumkan usia 24 TH dan jumlah siswa 'sekarang 204' tanpa tanggal rujukan. Angka tersebut disimpan sebagai arsip, bukan statistik terkini."},
 programs,facilities,extracurriculars:extras,teachers:people.filter(p=>p.group!=="Tenaga Kependidikan"),staff:people.filter(p=>p.group==="Tenaga Kependidikan"),committee,gallery,articles:[],events:[],testimonials,
 admissions:{...record("school-admissions","Sistem Penerimaan Murid Baru","/spmb","spmb",ip,["Tahun Ajaran 2026-2027"]),academicYear:"2026-2027",registrationUrl:ipd('a[href*="my.kbraperwanida"]').attr("href"),opensAt:null,closesAt:null,brochureUrl:"/documents/brosur-spmb-2026-2027.pdf",poster:posterAsset?media(posterAsset.url,"Poster resmi SPMB 2026–2027; jadwal arsip pendaftaran inden 05–30 November 2025 dan reguler 05 Januari 2026",info):undefined,
  archivedSchedule:["Pendaftaran Inden: 05 - 30 November 2025.","Pendaftaran Reguler: 05 Januari 2026."],needsVerification:true,verificationNote:"Jadwal pada poster sudah berlalu. Hubungi sekolah untuk status penerimaan, ketersediaan tempat dan ketentuan yang berlaku.",sourceIds:[sid(ip),sid(info),"official-brochure"]},
 socialLinks:home("footer .footer-social a").map((_,e)=>{const url=home(e).attr("href"),label=url.includes("facebook")?"Facebook":url.includes("instagram")?"Instagram":url.includes("twitter")?"X / Twitter":"YouTube";return {id:slug(label),label,url,sourceIds:[sid(hp)]};}).get(),
 faq:[{...record("faq-registration","Bagaimana mendapatkan informasi pendaftaran?","/spmb","faq",ip),answer:"Hubungi sekolah melalui kontak resmi atau kunjungi tautan pendaftaran online.",sourceIds:[sid(ip),sid(info)]},
 {...record("faq-location","Di mana lokasi sekolah?","/kontak","faq",byPath("/kontak")),answer:contact.address}],
 statement:record("school-statement","Komitmen Perwanida","/profil/tentang-kami","profil",hp,[clean(home(".about-section .text").text())]),
 schoolPrograms,curriculumItems,videos,schoolPhotos,foundingYear:1999,
 historyTimeline:[
 {year:"1999",title:"Raudhatul Athfal Perwanida berdiri",text:historyBody[0]+" "+historyBody[1],sourceIds:[sid(ap)]},
 {year:"2000",title:"Kelompok Bermain didirikan",text:historyBody[2],sourceIds:[sid(ap)]},
 {year:"2006",title:"Bertumbuh di Ketintang Madya V/92K",text:historyBody[3],sourceIds:[sid(ap)]},
 ...[["2008","RA"],["2019","RA"],["2024","KB"]].map(([year,unit],i)=>({year,title:"Akreditasi "+unit+" — nilai A",text:historyBody[i+4],sourceIds:[sid(ap)]})),
 ],
};
await writeFile("src/data/content/migrated.ts",'import type { SchoolContent } from "@/types/content";\nexport const migratedContent = '+JSON.stringify(data,null,2)+' as const satisfies SchoolContent;\n');
const sources=pages.map(p=>({id:sid(p),label:p.title??"Sumber tidak tersedia",url:p.url,accessedAt:"2026-09-15"}));
sources.push(...roles.filter(r=>r.status===200).map(r=>({id:"source-role-"+r.id,label:"Jabatan pendidik (endpoint publik)",url:r.url,accessedAt:"2026-09-15"})));
sources.push({id:"official-brochure",label:"Brosur resmi yang ditautkan halaman SPMB",url:"https://kbraperwanida.sch.id/files/information_ppdb/20251105072329-690a9901aeb49-brochure.pdf",accessedAt:"2026-09-15"});
await writeFile("src/data/content/migrated-sources.json",JSON.stringify(sources,null,2));
await writeFile("work/migration-summary.json",JSON.stringify({people:people.length,teachers:data.teachers.length,staff:data.staff.length,facilities:facilities.length,extras:extras.length,schoolPrograms:schoolPrograms.length,featured:5,gallery:gallery.length,videos:videos.length,testimonials:testimonials.length,mission:data.mission.body.length,history:historyBody.length},null,2));
console.log(await readFile("work/migration-summary.json","utf8"));
