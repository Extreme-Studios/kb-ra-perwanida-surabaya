import type { Metadata } from "next";
import { Entrance } from "@/components/entrance/entrance";
import { contentRepository } from "@/lib/content";
import { getEntranceData } from "@/data/content/entrance";
import { site } from "@/config/site";
export const metadata:Metadata={
  title:{absolute:site.name},
  description:"Kenali KB-RA Perwanida Surabaya: profil sekolah, program, fasilitas, galeri dan informasi SPMB.",
  alternates:{canonical:"/"},
  openGraph:{title:site.name,description:"Mengenal KB-RA Perwanida Surabaya melalui lingkungan, program dan kegiatan sekolah.",type:"website"},
};
export default async function EntryPage(){
  return <Entrance data={getEntranceData(await contentRepository.getSchool())}/>;
}

