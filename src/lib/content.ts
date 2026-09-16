import { schoolContent } from "@/data/content/school";
import type { ContentRecord, KnowledgeDocument, SchoolContent, Testimonial } from "@/types/content";
import { route } from "@/config/routes";

export interface ContentRepository { getSchool(): Promise<SchoolContent> }
const localRepository: ContentRepository = { async getSchool() { return schoolContent; } };
export const contentRepository: ContentRepository = localRepository;

export const publishableTestimonial = (item: Testimonial) =>
  item.status === "verified" && item.complete !== false && (item.consentConfirmed || item.publicationBasis === "official-public-source");

export function getRecords(content: SchoolContent): ContentRecord[] {
  return [content.vision, content.mission, content.objectives, content.history, content.statement,
    content.contact, ...content.programs, ...content.schoolPrograms, ...content.curriculumItems,
    ...content.facilities, ...content.extracurriculars, ...content.teachers, ...content.staff,
    ...content.committee, ...content.gallery, ...content.articles, ...content.videos,
    ...content.events, ...content.testimonials.filter(publishableTestimonial), content.admissions, ...content.faq];
}
export function recordsForPage(content: SchoolContent, path: string) {
  return getRecords(content).filter((item) => (item.relatedPage === path || item.relatedPages?.includes(path)) && item.status === "verified");
}
// Pure data projection. No provider, RAG, network request, embedding or AI integration.
export function toKnowledgeDocuments(content: SchoolContent): KnowledgeDocument[] {
  const identity: KnowledgeDocument = {
    id: content.identity.id, title: content.identity.name, slug: content.identity.id,
    category: "identitas", summary: content.identity.name, content: content.identity.name,
    keywords: [content.identity.city], relatedPage: route("home").path, updatedAt: null, sourceIds: content.identity.sourceIds,
  };
  return [identity, ...getRecords(content).filter((item) => item.status === "verified").map((item) => {
    const person = [...content.teachers, ...content.staff, ...content.committee].find((entry) => entry.id === item.id);
    const faq = content.faq.find((entry) => entry.id === item.id);
    const event = content.events.find((entry) => entry.id === item.id);
    const video = content.videos.find((entry) => entry.id === item.id);
    const extra = [
      ...(item.id === content.contact.id ? [content.contact.address, content.contact.phone, content.contact.mobile, content.contact.email] : []),
      person?.role, person?.group, ...(person?.additionalRoles ?? []), faq?.answer,
      event?.startsAt, event?.endsAt, event?.location, video?.videoUrl,
      ...(item.id === content.admissions.id ? [content.admissions.academicYear, content.admissions.registrationUrl] : []),
      ...(item.images ?? []).map((image) => image.alt),
    ].filter((value): value is string => Boolean(value));
    const body = [...item.body, ...extra];
    return {
      id: item.id, title: item.title, slug: item.slug, category: item.category,
      summary: item.summary ?? item.title, content: body.length ? body.join("\n\n") : item.title,
      keywords: item.keywords, relatedPage: item.relatedPage, updatedAt: item.updatedAt, sourceIds: item.sourceIds,
      needsVerification: item.needsVerification, verificationNote: item.verificationNote,
    };
  })];
}
