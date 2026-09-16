import type { SchoolContact } from "@/types/content";
import { Arrow } from "@/components/ui/primitives";
export function ContactOptions({ contact }: { contact: SchoolContact }) {
  return <div className="contact-options">
    <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer"><span>WhatsApp sekolah<strong>{contact.mobile}</strong></span><Arrow diagonal /></a>
    <a href={`tel:${contact.phone.replace(/\D/g, "")}`}><span>Telepon sekolah<strong>{contact.phone}</strong></span><Arrow diagonal /></a>
    <a href={`mailto:${contact.email}`}><span>Email<strong>{contact.email}</strong></span><Arrow diagonal /></a>
  </div>;
}

