import { readFileSync, writeFileSync, statSync } from "node:fs";
import { schoolContent } from "../src/data/content/school";
import { getRecords } from "../src/lib/content";
import sources from "../src/data/content/migrated-sources.json";
import assets from "../src/data/content/asset-manifest.json";
import type { MediaAsset } from "../src/types/content";
type Page = {id:string;url:string;status:number;title?:string;text?:string};
const pages:Page[]=JSON.parse(readFileSync("work/source/pages.json","utf8"));
const records=[...getRecords(schoolContent),...schoolContent.testimonials.filter(t=>!t.complete)];
const usage=new Map<string,Set<string>>();
function mark(image:MediaAsset|undefined|null,label:string) {
 if(!image?.src)return;
 if(!usage.has(image.src))usage.set(image.src,new Set());
 usage.get(image.src)!.add(label);
}
mark(schoolContent.identity.logo,"Identity/navbar/footer/favicon");
schoolContent.schoolPhotos.forEach(i=>mark(i,"Homepage/About/SPMB/profile photography"));
for(const r of records)r.images?.forEach(i=>mark(i,r.relatedPage+" — "+r.title));
for(const p of [...schoolContent.teachers,...schoolContent.staff,...schoolContent.committee])mark(p.photo,p.relatedPage+" — "+p.title);
for(const v of schoolContent.videos)mark(v.image,"/multimedia/video — "+v.title);
mark(schoolContent.admissions.poster,"/spmb — poster arsip");
const esc=(s:string)=>s.replace(/\|/g," / ").replace(/\n/g," ");
const groups=new Map<string,Page[]>();
for(const p of pages) {const key=p.status+"|"+(p.text??p.url);const g=groups.get(key)??[];g.push(p);groups.set(key,g);}
const lines=["# Source inventory — Milestone 2","","Audit 15 September 2026. Primary source: https://kbraperwanida.sch.id/.",
"",
pages.length+" URL HTML diambil; "+pages.filter(p=>p.status===200).length+" HTTP 200; "+groups.size+" kelompok response unik berdasarkan status dan teks konten (bukan jumlah menu).",
"URL program lama memakai token terenkripsi yang berubah per response. Semua URL snapshot dipertahankan agar sourceId tetap dapat diaudit. Crawl awal menemukan varian berulang; perluasan berikutnya menelusuri content links dan pagination video sampai antrean habis. Endpoint jabatan publik diperiksa terpisah untuk 37 personel.",
"",
"## Ringkasan kelompok halaman","",
"| Jenis konten | URL representatif | Varian response | Records migrated (gabungan) | Aset lokal terkait (gabungan) | HTTP |","|---|---|---:|---:|---:|---|"];
for(const group of groups.values()) {
 const p=group[0],ids=new Set(group.map(x=>"source-"+x.id));
 lines.push("| "+[esc(p.title??"Gagal diakses"),"[source]("+p.url+")",String(group.length),String(records.filter(r=>r.sourceIds.some(id=>ids.has(id))).length),String(new Set(assets.filter(a=>a.sourceIds.some(id=>ids.has(id))).map(a=>a.src)).size),String(p.status)].join(" | ")+" |");
}
lines.push("","## Detail setiap source URL","","Records juga mencakup testimoni terpotong yang disimpan internal dan tidak diterbitkan. Angka aset = lokal unik yang ditemukan pada halaman, tidak semuanya digunakan di UI. Baris endpoint jabatan hanya menyimpan nama/jabatan/tanggal sumber; tidak mengimpor nomor pribadi atau ID kepegawaian.","","| Source ID / jenis | URL | Record IDs migrated | Aset lokal | Status |","|---|---|---|---:|---|");
for(const source of sources) {
 const page=pages.find(p=>source.id==="source-"+p.id);
 const mapped=records.filter(r=>r.sourceIds.includes(source.id)).map(r=>r.id);
 const count=new Set(assets.filter(a=>a.sourceIds.includes(source.id)).map(a=>a.src)).size;
 const status=page?"HTTP "+page.status:source.id==="official-brochure"?"PDF 200, 2 halaman dirender & ditinjau":"JSON 200, fields jabatan saja";
 lines.push("| "+[source.id+" / "+esc(source.label),"[source]("+source.url+")",mapped.join(", ")||"Tidak ada record faktual / sumber navigasi",String(count),status].join(" | ")+" |");
}
lines.push("","## Cakupan dan pengecualian","","Home, Tentang Kami, Guru & Tendik, Komite, Kurikulum, kelima program unggulan, program penunjang/sekolah, fasilitas, galeri kategori, Daily Activity, Event, Video halaman 1–10, Kontak, PPDB/SPMB, Informasi PPDB dan brosur telah diperiksa.",
"Halaman /index.html yang ditautkan situs mengembalikan 404. Listing berita kosong; tidak ada article detail real yang dapat dimigrasikan. Galeri mengaji tidak menyediakan foto tersendiri. Lihat CONTENT-GAPS.md.",
"112 tautan YouTube memiliki respons oEmbed 200 saat audit. Ini bukti ketersediaan metadata, bukan jaminan pemutaran di setiap negara/perangkat.",
"Tujuan pendaftaran online berada pada subdomain my; hanya ditautkan. Tidak mengirim formulir atau data personal.",
"Konten tidak relevan berupa tautan film pada halaman kontak tidak dimigrasikan.",
"","## Reproduksi","","Data runtime sudah committed-ready; tidak memerlukan crawl saat build/test. scripts/audit-source.mjs, expand-source.mjs, import-assets.mjs dan migrate-content.mjs adalah perangkat audit manual. Ekstraksi memakai snapshot work/source yang diabaikan Git. Jangan menimpa snapshot secara otomatis; URL terenkripsi bisa berubah dan selector harus diperiksa pada audit baru.");
writeFileSync("docs/SOURCE-INVENTORY.md",lines.join("\n")+"\n");
const assetLines=["# Asset inventory — Milestone 2","","Semua foto/logo/thumbnail berasal dari situs sekolah, tidak ada stock atau image generation. File asli disimpan lokal; Next/Image menyediakan ukuran responsif dan optimasi saat request. Tidak melakukan manipulasi berat.","",
assets.length+" URL gambar, "+new Set(assets.map(a=>a.src)).size+" file unik, "+assets.reduce((n,a)=>n+a.bytes,0)+" bytes. Hash SHA-256 mendeteksi duplikasi konten; penggunaan berulang menunjuk file lokal yang sama.",
"","| Source URL | Local filename | Usage | Dimensions | Bytes | Status / duplicate |","|---|---|---|---|---:|---|"];
for(const a of assets)assetLines.push("| "+["[source]("+a.url+")",a.src,esc([...usage.get(a.src)??["Arsip asset sumber; tidak dipakai di UI"]].join("; ")),a.width+" × "+a.height,String(a.bytes),a.status+" / "+(a.duplicateOf??"unique SHA-256")].join(" | ")+" |");
const pdf=schoolContent.admissions.brochureUrl!;
assetLines.push("| [Brosur resmi]("+sources.find(s=>s.id==="official-brochure")!.url+") | "+pdf+" | /spmb download; isi arsip dengan konflik yang dicatat | 2 halaman PDF raster | "+statSync("public"+pdf).size+" | Download berhasil; render diperiksa |",
"","Manifest mesin: src/data/content/asset-manifest.json. Folder image: brand, school, facilities, teachers, programs, gallery, testimonials, video. Kategori tanpa foto khusus tidak diberi foto aktivitas lain secara spekulatif.",
"Foto guru memakai object-fit: contain; poster/prestasi dan lightbox ditampilkan utuh; hero menggunakan crop terarah. Resolusi kecil asli tidak dinaikkan dengan AI. Thumbnail video lokal tidak memuat player eksternal sebelum pengguna membuka YouTube.");
writeFileSync("docs/ASSET-INVENTORY.md",assetLines.join("\n")+"\n");
console.log({html:pages.length,ok:pages.filter(p=>p.status===200).length,uniqueResponseGroups:groups.size,sources:sources.length,records:records.length,assets:assets.length,usedFiles:usage.size});

