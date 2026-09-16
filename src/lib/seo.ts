import type { Metadata } from "next";
import { site } from "@/config/site";
import { schoolContent } from "@/data/content/school";
import type { RouteDefinition } from "@/types/content";
export function pageMetadata(page: RouteDefinition): Metadata {
  const program=schoolContent.programs.find(item=>item.relatedPage===page.path);
  const descriptions: Record<string,string> = {
    home: `${schoolContent.identity.name}: kenali visi, program unggulan, kegiatan, pendidik, fasilitas, dan informasi SPMB.`,
    tentang: "Visi, misi, tujuan dan perjalanan Perwanida: pendirian RA pada 1999, KB pada 2000, serta riwayat akreditasi.",
    guru: "Kenali kepala sekolah, guru kelompok bermain, guru kelas dan sentra, tenaga kependidikan, guru UMMI, ekstrakurikuler serta alumni Perwanida.",
    komite: "Arsip komite dan POMG KB-RA Perwanida menurut tahun ajaran yang tercantum pada sumber sekolah.",
    fasilitas: "Jelajahi ruang belajar ber AC, halaman sekolah, perpustakaan, UKS, aula dan fasilitas lainnya di KB-RA Perwanida.",
    ekstra: "Futsal, Menyanyi, Menari, Melukis, Rebana, Wushu dan Drumband: kegiatan ekstrakurikuler KB-RA Perwanida.",
    galeri: "Dokumentasi asli kegiatan, prestasi dan agenda KB-RA Perwanida dalam galeri foto.",
    kontak: `Alamat, telepon, WhatsApp dan email ${schoolContent.identity.name} di Ketintang, Surabaya.`,
    spmb: "Informasi resmi SPMB tahun ajaran 2026–2027, brosur, pendaftaran online dan kontak sekolah untuk konfirmasi penerimaan.",
    program: "Kurikulum, lima program unggulan, serta program penunjang KB-RA Perwanida Surabaya.",
    unggulan: "Character Building, Cinta Budaya Indonesia, Gerakan Literasi, Green School dan Mengaji Metode UMMI di Perwanida.",
    berita: "Informasi dan kanal kabar sekolah KB-RA Perwanida Surabaya.",
    daily: "Kanal Daily Activity: informasi kegiatan harian dari KB-RA Perwanida.",
    event: "Kanal Event: kabar acara dan kegiatan KB-RA Perwanida Surabaya.",
    video: "Arsip video pembelajaran, doa, hadist dan kegiatan resmi KB-RA Perwanida.",
    multimedia: "Jelajahi koleksi multimedia dan video resmi KB-RA Perwanida.",
    mengaji: "Galeri mengaji dan akses informasi pembelajaran UMMI KB-RA Perwanida.",
    prestasi: "Dokumentasi arsip prestasi anak-anak KB-RA Perwanida sesuai sumber resmi sekolah.",
    agenda: "Dokumentasi agenda kegiatan Perwanida; informasi arsip sesuai periode pada gambar resmi.",
    profil: "Mengenal KB-RA Perwanida melalui profil sekolah, tim pendidik, komite dan fasilitas.",
  };
  const description=descriptions[page.id]??program?.summary?.slice(0,180)??`Kenali ${page.title}, bagian dari program ${site.name}.`;
  const image=(page.id==="fasilitas"||page.id==="kontak")?schoolContent.facilities[1].images?.[0]:schoolContent.schoolPhotos[0];
  const canonical=site.url?new URL(page.path,site.url).toString():page.path;
  return {
    title:page.title,description,alternates:{canonical},
    openGraph:{type:"website",title:`${page.title} | ${site.name}`,description,siteName:site.name,locale:site.locale,
      url:site.url?canonical:undefined,images:site.url&&image?.src?[{url:new URL(image.src,site.url).toString(),width:image.width,height:image.height,alt:image.alt}]:undefined},
  };
}
