import Link from "next/link";
import Image from "next/image";
import { route } from "@/config/routes";
import { schoolContent } from "@/data/content/school";
export function Brand() {
  const school=schoolContent.identity;
  return <Link href={route("home").path} className="brand" aria-label={`${school.name} — Home`}>
    {school.logo.src&&<Image src={school.logo.src} alt="" width={56} height={56} className="brand-logo" sizes="56px"/>}
    <span className="brand-wordmark">{school.shortName}<span>{school.city}</span></span>
  </Link>;
}
