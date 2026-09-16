import Link from "next/link";
import { Brand } from "./brand";
import { Container } from "@/components/ui/primitives";
import { route } from "@/config/routes";
import { schoolContent } from "@/data/content/school";
import type { SchoolContact } from "@/types/content";
export function Footer({ contact }: { contact: SchoolContact }) {
  return <footer className="site-footer"><Container><div className="footer-grid"><div><Brand /><p className="footer-statement">{schoolContent.statement.body[0]}</p><div className="footer-social">{schoolContent.socialLinks.map(item=><a href={item.url} key={item.id} target="_blank" rel="noopener noreferrer">{item.label}</a>)}</div></div>
    <div><h2>Jelajahi</h2><ul>{["tentang","guru","galeri","berita","spmb"].map(id=><li key={id}><Link href={route(id).path}>{route(id).title}</Link></li>)}</ul></div>
    <div className="footer-programs"><h2>Program</h2><ul>{schoolContent.programs.filter(p=>p.kind==="featured").map(item=><li key={item.id}><Link href={item.relatedPage}>{item.title}</Link></li>)}</ul></div>
    <div><h2>Hubungi kami</h2><address><p>{contact.address}</p><a href={`tel:${contact.phone.replace(/\D/g,"")}`}>{contact.phone}</a><a href={contact.whatsappUrl}>{contact.mobile}</a><a href={`mailto:${contact.email}`}>{contact.email}</a></address></div>
    </div><div className="footer-bottom"><span>© {new Date().getFullYear()} {schoolContent.identity.name}</span><span>Berilmu · Beramal · Berakhlaq Mulia</span></div></Container></footer>;
}
