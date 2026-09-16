import Link from "next/link";
import { Container, Section, SectionHeader, ButtonLink, Badge, Arrow } from "@/components/ui/primitives";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { ProgramGrid } from "./program-grid";
import { PeopleGrid } from "./people";
import { Activities } from "./activities";
import { Gallery } from "./gallery";
import { ContactOptions } from "./contact-options";
import { CTA } from "./cta";
import { route } from "@/config/routes";
import { presentation as copy } from "@/data/content/presentation";
import { publishableTestimonial } from "@/lib/content";
import type { SchoolContent } from "@/types/content";

export function HomeExperience({ school }: { school: SchoolContent }) {
  const featured = school.programs.filter((item) => item.kind === "featured");
  const testimonial = school.testimonials.find(publishableTestimonial);
  return <>
    <Section className="welcome"><Container className="welcome-grid">
      <div className="welcome-copy"><Badge>{copy.hero.eyebrow}</Badge><p className="school-name">{school.identity.name}</p>
        <h1>{copy.hero.title}<span>{copy.hero.accent}</span></h1><p className="welcome-description">{copy.hero.description}</p>
        <div className="button-row"><ButtonLink href={route("tentang").path}>{copy.hero.primary}<Arrow /></ButtonLink><ButtonLink href={route("spmb").path} variant="secondary">{copy.hero.secondary}</ButtonLink></div>
        <div className="trust-line"><span>RA sejak <strong>{school.foundingYear}</strong></span><span>Ketintang, {school.identity.city}</span></div>
      </div>
      <div className="welcome-photos"><div className="welcome-photo-main"><ResponsiveImage asset={school.schoolPhotos[0]} priority sizes="(max-width: 767px) 70vw, 35vw" /><span className="photo-note">{copy.hero.note}</span></div>
        <div className="welcome-photo-small"><ResponsiveImage asset={school.schoolPhotos[1]} sizes="(max-width: 767px) 40vw, 18vw" /></div>
        <span className="sun-mark" aria-hidden="true">✳</span><span className="photo-stamp">Berilmu<br />Beramal<br />Berakhlaq Mulia</span>
      </div>
    </Container></Section>
    <div className="values-ribbon" aria-hidden="true"><Container><span>Belajar</span><span>✳</span><span>Bermain</span><span>✳</span><span>Bertumbuh</span><span>✳</span><span>Bersama Perwanida</span></Container></div>
    <Section><Container className="identity-section"><div><p className="eyebrow">{copy.about.eyebrow}</p><h2>{copy.about.title}</h2><Link className="text-link" href={route("tentang").path}>{copy.about.link}<Arrow /></Link></div>
      <div className="identity-story"><p className="lead">{school.statement.body[0]}</p><div className="vision-panel"><span className="eyebrow">Visi kami</span><p>{school.vision.body[0]}</p></div></div>
    </Container></Section>
    <Section className="programs-final"><Container><SectionHeader eyebrow={copy.programs.eyebrow} title={copy.programs.title} description={copy.programs.description} action={<Link className="text-link" href={route("program").path}>{copy.programs.link}<Arrow /></Link>} /><ProgramGrid programs={featured} /></Container></Section>
    <Section><Container className="experience-grid"><div className="experience-photo"><ResponsiveImage asset={school.curriculumItems[0].images![0]} sizes="(max-width: 767px) 90vw, 45vw" /><span>{school.curriculumItems[0].title}</span></div>
      <div><p className="eyebrow">{copy.experience.eyebrow}</p><h2>{copy.experience.title}</h2><p className="section-description">{copy.experience.description}</p>
        <ol className="experience-list">{school.schoolPrograms.slice(0,4).map((item,i)=><li key={item.id}><span>0{i+1}</span><h3>{item.title}</h3></li>)}</ol><Link className="text-link" href={route("penunjang").path}>{copy.experience.link}<Arrow /></Link>
      </div></Container></Section>
    <Section className="extra-section"><Container><SectionHeader eyebrow={copy.extra.eyebrow} title={copy.extra.title} description={copy.extra.description} action={<Link className="text-link" href={route("ekstra").path}>{copy.extra.link}<Arrow /></Link>} /><Activities items={school.extracurriculars} /></Container></Section>
    <Section><Container><SectionHeader eyebrow={copy.facilities.eyebrow} title={copy.facilities.title} action={<Link className="text-link" href={route("fasilitas").path}>{copy.facilities.link}<Arrow /></Link>} />
      <div className="facility-preview">{school.facilities.slice(0,3).map((item)=><Link href={route("fasilitas").path+"#"+item.id} key={item.id} className="facility-preview-item">
        {item.images?.[0]&&<ResponsiveImage asset={item.images[0]} sizes="(max-width: 767px) 90vw, 40vw" />}<div><h3>{item.title}</h3><Arrow diagonal /></div>
      </Link>)}</div></Container></Section>
    <Section className="educators-section"><Container><SectionHeader eyebrow={copy.people.eyebrow} title={copy.people.title} action={<Link className="text-link" href={route("guru").path}>{copy.people.link}<Arrow /></Link>} /><PeopleGrid people={[school.teachers[0],...school.teachers.filter(p=>p.role==="Guru Kelas A1"||p.role==="Guru Kelas A2")]} /></Container></Section>
    <Section><Container><SectionHeader eyebrow={copy.gallery.eyebrow} title={copy.gallery.title} action={<Link className="text-link" href={route("galeri").path}>{copy.gallery.link}<Arrow /></Link>} /><Gallery entries={school.gallery} compact /></Container></Section>
    {testimonial&&<Section className="testimonial-section"><Container><p className="eyebrow">{copy.testimonial.eyebrow}</p><h2>{copy.testimonial.title}</h2><div className="testimonial-content"><span className="quote-mark" aria-hidden="true">“</span><blockquote><p>{testimonial.body[0]}</p><footer><strong>{testimonial.title}</strong><span>{testimonial.attribution}</span></footer></blockquote></div></Container></Section>}
    <Section className="news-preview"><Container><div><p className="eyebrow">{copy.news.eyebrow}</p><h2>{copy.news.title}</h2></div><div><p>{copy.news.empty}</p><Link className="text-link" href={route("berita").path}>{copy.news.link}<Arrow /></Link></div></Container></Section>
    <Section className="cta-section"><Container><CTA /></Container></Section>
    <Section><Container className="location-section"><div><p className="eyebrow">{copy.contact.eyebrow}</p><h2>{copy.contact.title}</h2><address>{school.contact.address}</address><a className="text-link" href={school.contact.directionsUrl} target="_blank" rel="noopener noreferrer">{copy.contact.directions}<Arrow diagonal /></a></div><ContactOptions contact={school.contact} /></Container></Section>
  </>;
}

