import { ButtonLink, Arrow } from "@/components/ui/primitives";
import { route } from "@/config/routes";
import { schoolContent } from "@/data/content/school";
import { presentation as copy } from "@/data/content/presentation";
export function CTA() {
  return <aside className="admissions-cta" aria-labelledby="admissions-heading"><span className="cta-sun" aria-hidden="true">✳</span><div><p className="eyebrow">{copy.spmb.eyebrow} · {schoolContent.admissions.academicYear}</p><h2 id="admissions-heading">{copy.spmb.title}</h2><p>{copy.spmb.text}</p></div><div className="admissions-cta-actions"><ButtonLink href={route("spmb").path} variant="light">{copy.spmb.link}<Arrow diagonal /></ButtonLink><a href={schoolContent.contact.whatsappUrl} className="cta-contact">{copy.spmb.whatsapp}<Arrow diagonal/></a></div></aside>;
}
