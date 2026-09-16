import Link from "next/link";
import type { ContentRecord, RouteDefinition, SchoolContent } from "@/types/content";
import { Container, Section, SectionHeader, ButtonLink, Arrow, EmptyState } from "@/components/ui/primitives";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { PageHeader } from "@/components/layout/page-header";
import { ProgramGrid } from "./program-grid";
import { PeopleGrid } from "./people";
import { Activities } from "./activities";
import { Gallery } from "./gallery";
import { ContactOptions } from "./contact-options";
import { NewsList } from "./news";
import { VideoLibrary } from "./video-library";
import { route, childrenOf } from "@/config/routes";
import { presentation as copy } from "@/data/content/presentation";

function Prose({ record }: { record: ContentRecord }) {
  return <div className="prose">{record.body.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>;
}
export function AboutPage({ school }: { school: SchoolContent }) {
  return <><Section><Container className="about-intro"><div><p className="eyebrow">Mengenal Perwanida</p><h2>{copy.about.title}</h2><Prose record={school.statement} /><div className="vision-panel"><h3>{school.vision.title}</h3><p>{school.vision.body[0]}</p></div></div><ResponsiveImage asset={school.schoolPhotos[0]} className="about-portrait" sizes="(max-width: 767px) 90vw, 40vw" /></Container></Section>
    <Section className="sage-section"><Container className="mission-grid">{[school.mission,school.objectives].map(record=><div key={record.id}><p className="eyebrow">{school.identity.shortName}</p><h2>{record.title}</h2><ol>{record.body.map((text,i)=><li key={text}><span>0{i+1}</span><p>{text}</p></li>)}</ol></div>)}</Container></Section>
    <Section><Container className="timeline-layout"><div><p className="eyebrow">Perjalanan sekolah</p><h2>Bertumbuh dari masa ke masa.</h2><p className="section-description">Riwayat pendirian, perpindahan, dan akreditasi sesuai catatan sekolah.</p><ResponsiveImage asset={school.schoolPhotos[1]} className="timeline-photo" sizes="(max-width: 767px) 90vw, 30vw" /></div>
      <ol className="history-timeline">{school.historyTimeline.map((event)=><li key={event.year}><span className="timeline-year">{event.year}</span><div><h3>{event.title}</h3><p>{event.text}</p></div></li>)}</ol></Container></Section>
  </>;
}
export function EducatorsPage({ school, committee = false }: { school: SchoolContent; committee?: boolean }) {
  const people = committee ? school.committee : [...school.teachers, ...school.staff];
  const groups = [...new Set(people.map(person=>person.group))];
  return <Section><Container><p className="archive-note">{committee ? "Arsip komite sesuai periode yang tercantum. Hubungi sekolah untuk susunan pengurus tahun ajaran berjalan." : "Daftar pendidik dan tenaga kependidikan mengikuti informasi resmi sekolah. Guru alumni ditampilkan dalam kelompok tersendiri."}</p>
    <nav className="group-jumps" aria-label="Kategori tim">{groups.map((group,i)=><a href={"#team-"+i} key={group}>{group}</a>)}</nav>
    {groups.map((group,i)=><section className="team-group" id={"team-"+i} key={group}><SectionHeader title={group??"Tim Perwanida"} /><PeopleGrid people={people.filter(person=>person.group===group)} /></section>)}
  </Container></Section>;
}
export function ProgramOverview({ school, featuredOnly = false }: { school: SchoolContent; featuredOnly?: boolean }) {
  const curriculum=school.programs.find(item=>item.kind==="curriculum")!;
  return <>{!featuredOnly&&<Section><Container className="program-intro"><div><p className="eyebrow">Pendekatan pendidikan</p><h2>{curriculum.title}</h2><Prose record={curriculum} /><ButtonLink href={curriculum.relatedPage}>Kenali kurikulum<Arrow /></ButtonLink></div>
    <ResponsiveImage asset={school.curriculumItems[1].images![0]} sizes="(max-width: 767px) 90vw, 45vw" /></Container></Section>}
    <Section className="programs-final"><Container><SectionHeader eyebrow={copy.programs.eyebrow} title={copy.programs.title} description={copy.programs.description} /><ProgramGrid programs={school.programs.filter(item=>item.kind==="featured")} /></Container></Section>
    {!featuredOnly&&<Section><Container><SectionHeader title="Program Penunjang" description={school.programs.find(item=>item.kind==="supporting")?.summary??undefined} action={<ButtonLink href={route("penunjang").path}>Jelajahi program<Arrow /></ButtonLink>} /><div className="program-name-grid">{school.schoolPrograms.map(item=><Link key={item.id} href={item.relatedPage+"#"+item.id}>{item.title}<Arrow diagonal /></Link>)}</div></Container></Section>}
  </>;
}
export function ProgramDetail({ school, page }: { school: SchoolContent; page: RouteDefinition }) {
  const record=school.programs.find(item=>item.relatedPage===page.path);
  if(!record)return null;
  const isCurriculum=record.kind==="curriculum",isSupporting=record.kind==="supporting";
  return <><Section><Container className="program-detail-layout"><div><p className="eyebrow">{isCurriculum?"Pendekatan pembelajaran":isSupporting?"Pengalaman anak":"Program unggulan"}</p><h2>{record.title}</h2>{record.body.length?<Prose record={record}/>:<p className="section-description">{copy.programLimited}</p>}
    <div className="button-row"><ButtonLink href={route("kontak").path}>Tanyakan kepada sekolah<Arrow /></ButtonLink><Link className="text-link" href={route("program").path}>{copy.backPrograms}</Link></div></div>
    <aside className="program-aside"><span aria-hidden="true" className="program-aside-mark">✳</span><h3>{school.vision.title}</h3><p>{school.vision.body[0]}</p></aside></Container></Section>
    {isCurriculum&&<Section className="sage-section"><Container><SectionHeader title="Sentra pembelajaran" /><div className="curriculum-grid">{school.curriculumItems.map(item=><article key={item.id}><ResponsiveImage asset={item.images![0]} sizes="(max-width: 767px) 90vw, 45vw" /><h3>{item.title}</h3></article>)}</div></Container></Section>}
    {isSupporting&&<Section className="sage-section"><Container><SectionHeader title="Program sekolah" /><div className="program-name-grid">{school.schoolPrograms.map((item,i)=><article id={item.id} key={item.id}><span className="eyebrow">{String(i+1).padStart(2,"0")}</span><h3>{item.title}</h3></article>)}</div></Container></Section>}
    <Section><Container><SectionHeader title={copy.related} /><ProgramGrid programs={school.programs.filter(item=>item.kind==="featured"&&item.id!==record.id)} /></Container></Section>
  </>;
}
export function FacilitiesPage({ school }: { school: SchoolContent }) {
  return <Section><Container><div className="facilities-editorial">{school.facilities.map((item,i)=><article id={item.id} key={item.id}>
    {item.images?.[0]&&<ResponsiveImage asset={item.images[0]} sizes="(max-width: 767px) 90vw, 45vw" />}
    <div><p className="eyebrow">Ruang & fasilitas · {String(i+1).padStart(2,"0")}</p><h2>{item.title}</h2><Prose record={item} /></div>
  </article>)}</div></Container></Section>;
}
export function GalleryPage({ school, category }: { school: SchoolContent; category: string }) {
  const path=route(category).path;
  const entries=category==="galeri"?school.gallery:school.gallery.filter(item=>item.relatedPage===path||item.relatedPages?.includes(path));
  return <Section><Container><nav className="group-jumps" aria-label="Kategori galeri">{["galeri","ekstra","mengaji","prestasi","agenda"].map(id=><Link key={id} href={route(id).path} aria-current={id===category?"page":undefined}>{route(id).title}</Link>)}</nav>
    {entries.length?<><p className="archive-note">Dokumentasi arsip kegiatan sekolah. Buka foto untuk melihat gambar utuh.</p><Gallery entries={entries} /></>:<EmptyState title={copy.galleryEmpty} description={copy.galleryEmptyText} action={<ButtonLink href={route("kontak").path}>Hubungi sekolah</ButtonLink>} />}
  </Container></Section>;
}
export function AdmissionsPage({ school }: { school: SchoolContent }) {
  const admission=school.admissions;
  return <><Section><Container className="admission-intro"><div><p className="eyebrow">Tahun Ajaran {admission.academicYear}</p><h2>{copy.spmb.title}</h2><Prose record={school.statement} /><p className="notice">{admission.verificationNote}</p>
    <div className="button-row"><a className="button button--primary" href={school.contact.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp sekolah<Arrow diagonal /></a>
      {admission.registrationUrl&&<a className="button button--secondary" href={admission.registrationUrl} target="_blank" rel="noopener noreferrer">Pendaftaran online<Arrow diagonal /></a>}</div>
    {admission.brochureUrl&&<a href={admission.brochureUrl} target="_blank" rel="noopener noreferrer" className="text-link">Baca brosur resmi (PDF)<Arrow diagonal /></a>}
  </div><div className="admission-photo"><ResponsiveImage asset={school.schoolPhotos[0]} sizes="(max-width: 767px) 90vw, 40vw" /></div></Container></Section>
    <Section className="sage-section"><Container className="admission-details"><div><SectionHeader title="Informasi pendaftaran" /><ContactOptions contact={school.contact} />
      <div className="faq-list">{school.faq.map(item=><details key={item.id}><summary>{item.title}</summary><p>{item.answer}</p></details>)}</div></div>
    {admission.poster&&<details className="poster-archive"><summary>Lihat poster dan jadwal arsip 2026–2027</summary><p className="notice">{admission.verificationNote}</p><ul>{admission.archivedSchedule?.map(text=><li key={text}>{text}</li>)}</ul><ResponsiveImage asset={admission.poster} sizes="(max-width: 767px) 90vw, 45vw" /></details>}
    </Container></Section></>;
}
export function ContactPage({ school }: { school: SchoolContent }) {
  return <Section><Container className="contact-page-layout"><div><p className="eyebrow">{copy.contact.eyebrow}</p><h2>{copy.contact.title}</h2><address className="contact-address">{school.contact.address}</address><a className="button button--primary" href={school.contact.directionsUrl} target="_blank" rel="noopener noreferrer">Petunjuk arah<Arrow diagonal /></a>
    <ResponsiveImage asset={school.facilities[1].images![0]} className="contact-location-photo" sizes="(max-width: 767px) 90vw, 45vw" /></div><div><ContactOptions contact={school.contact} /><div className="social-links">{school.socialLinks.map(item=><a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">{item.label}<Arrow diagonal /></a>)}</div></div></Container></Section>;
}
export function CorePage({ page, school, videoPage=1 }: { page: RouteDefinition; school: SchoolContent; videoPage?: number }) {
  let content;
  if(page.id==="tentang") content=<AboutPage school={school}/>;
  else if(page.id==="guru"||page.id==="komite")content=<EducatorsPage school={school} committee={page.id==="komite"}/>;
  else if(page.id==="program"||page.id==="unggulan")content=<ProgramOverview school={school} featuredOnly={page.id==="unggulan"}/>;
  else if(page.category==="program")content=<ProgramDetail school={school} page={page}/>;
  else if(page.id==="fasilitas")content=<FacilitiesPage school={school}/>;
  else if(page.id==="ekstra")content=<Section><Container><SectionHeader title={copy.extra.title} description={copy.extra.description}/><Activities items={school.extracurriculars}/></Container></Section>;
  else if(page.category==="galeri")content=<GalleryPage school={school} category={page.id}/>;
  else if(page.category==="berita")content=<Section><Container><nav className="group-jumps" aria-label="Kategori berita">{["berita","daily","event"].map(id=><Link href={route(id).path} key={id}>{route(id).title}</Link>)}</nav><NewsList articles={school.articles.filter(item=>page.id==="berita"||item.category===(page.id==="daily"?"Daily Activity":"Event"))}/></Container></Section>;
  else if(page.category==="multimedia")content=<Section><Container><VideoLibrary videos={school.videos.filter(item=>item.availability!=="unavailable")} page={videoPage}/></Container></Section>;
  else if(page.id==="spmb")content=<AdmissionsPage school={school}/>;
  else if(page.id==="kontak")content=<ContactPage school={school}/>;
  else content=<Section><Container><div className="profile-overview"><ResponsiveImage asset={school.schoolPhotos[1]} sizes="(max-width: 767px) 90vw, 40vw"/><div><Prose record={school.statement}/><nav className="profile-links">{childrenOf(page.id).map(child=><Link key={child.id} href={child.path}>{child.title}<Arrow diagonal/></Link>)}</nav></div></div></Container></Section>;
  return <><PageHeader page={page}/>{content}</>;
}

