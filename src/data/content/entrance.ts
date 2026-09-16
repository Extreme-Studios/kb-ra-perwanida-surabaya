import type { SchoolContent, MediaAsset } from "@/types/content";
import { route } from "@/config/routes";

export const entranceCopy = {
  welcome: "Assalamu’alaikum. Selamat datang.",
  lead: "Satu langkah, banyak cerita.",
  invitation: "Mari mengenal tempat anak belajar, bermain, dan bertumbuh.",
  enter: "Masuk ke Perwanida",
  hint: "Klik atau tap untuk membuka gerbang",
  explore: "Kenali sebelum melangkah",
  direct: "Langsung ke website",
  detail: "Lihat lebih lanjut",
  close: "Tutup informasi",
};
export const entranceTiming = { normal: 700, reduced: 120 } as const;
export interface EntranceHotspot { id:string; title:string; summary:string; href:string; sourceIds:readonly string[]; needsVerification?:boolean }
export interface EntranceData {
  name:string; shortName:string; city:string; logo:MediaAsset; photo:MediaAsset;
  photoCaption:string; vision:string; homeHref:string; hotspots:EntranceHotspot[];
}
// Server-side projection: no parallel facts and no full school dataset in the client bundle.
export function getEntranceData(school:SchoolContent):EntranceData {
  const courtyard=school.facilities.find(item=>item.id==="facility-playground");
  if(!courtyard?.images?.[0]?.src)throw new Error("Entrance requires the verified courtyard photograph.");
  const featured=school.programs.filter(item=>item.kind==="featured");
  return {
    name:school.identity.name,shortName:school.identity.shortName,city:school.identity.city,
    logo:school.identity.logo,photo:courtyard.images[0],photoCaption:courtyard.title,
    vision:school.vision.body[0],homeHref:route("home").path,
    hotspots:[
      {id:"program",title:route("program").title,summary:featured.map(item=>item.title).join(", ")+".",href:route("program").path,sourceIds:featured.flatMap(item=>item.sourceIds)},
      {id:"fasilitas",title:route("fasilitas").title,summary:courtyard.summary??courtyard.title,href:route("fasilitas").path,sourceIds:courtyard.sourceIds},
      {id:"galeri",title:"Galeri",summary:school.gallery.map(item=>item.title).join(" · ")+".",href:route("galeri").path,sourceIds:school.gallery.flatMap(item=>item.sourceIds)},
      {id:"spmb",title:route("spmb").title,summary:`Informasi SPMB ${school.admissions.academicYear}. ${school.admissions.verificationNote??""}`,href:route("spmb").path,sourceIds:school.admissions.sourceIds,needsVerification:school.admissions.needsVerification},
    ],
  };
}

