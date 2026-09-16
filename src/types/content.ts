export type ContentStatus = "verified" | "pending";
export interface SourceReference {
  id: string;
  label: string;
  url?: string;
  accessedAt: string;
}
export interface ContentRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string | null;
  body: readonly string[];
  keywords: readonly string[];
  relatedPage: string;
  updatedAt: string | null;
  status: ContentStatus;
  sourceIds: readonly string[];
  images?: readonly MediaAsset[];
  originalBody?: readonly string[];
  needsVerification?: boolean;
  verificationNote?: string;
  relatedPages?: readonly string[];
}
export interface MediaAsset {
  id: string;
  src: string | null;
  alt: string;
  width: number;
  height: number;
  status: ContentStatus;
  sourceIds: readonly string[];
}
export interface Program extends ContentRecord { kind: "featured" | "supporting" | "curriculum" }
export interface Person extends ContentRecord { role: string | null; photo: MediaAsset | null; group?: string; additionalRoles?: readonly string[] }
export interface Article extends ContentRecord { publishedAt: string | null; image: MediaAsset | null }
export interface GalleryEntry extends ContentRecord { images: readonly MediaAsset[] }
export interface SchoolEvent extends ContentRecord { startsAt: string | null; endsAt: string | null; location: string | null }
export interface Testimonial extends ContentRecord { attribution: string | null; consentConfirmed: boolean; publicationBasis?: "official-public-source"; complete?: boolean }
export interface VideoRecord extends ContentRecord { videoUrl: string; videoId: string; image: MediaAsset | null; availability: "available" | "unavailable" | "unchecked" }
export interface FAQ extends ContentRecord { answer: string | null }
export interface Admissions extends ContentRecord { academicYear: string | null; registrationUrl: string | null; opensAt: string | null; closesAt: string | null; brochureUrl?: string; poster?: MediaAsset; archivedSchedule?: readonly string[] }
export interface SchoolIdentity { id: string; name: string; shortName: string; city: string; logo: MediaAsset; sourceIds: readonly string[] }
export interface SchoolContact extends ContentRecord { address: string; phone: string; mobile: string; email: string; whatsappUrl?: string; directionsUrl?: string }
export interface SchoolContent {
  identity: SchoolIdentity;
  contact: SchoolContact;
  vision: ContentRecord;
  mission: ContentRecord;
  objectives: ContentRecord;
  history: ContentRecord;
  programs: readonly Program[];
  facilities: readonly ContentRecord[];
  extracurriculars: readonly ContentRecord[];
  teachers: readonly Person[];
  staff: readonly Person[];
  committee: readonly Person[];
  gallery: readonly GalleryEntry[];
  articles: readonly Article[];
  events: readonly SchoolEvent[];
  testimonials: readonly Testimonial[];
  admissions: Admissions;
  socialLinks: readonly { id: string; label: string; url: string; sourceIds: readonly string[] }[];
  faq: readonly FAQ[];
  statement: ContentRecord;
  schoolPrograms: readonly ContentRecord[];
  curriculumItems: readonly ContentRecord[];
  videos: readonly VideoRecord[];
  schoolPhotos: readonly MediaAsset[];
  foundingYear: number;
  historyTimeline: readonly { year: string; title: string; text: string; sourceIds: readonly string[] }[];
}
export interface RouteDefinition { id: string; path: string; title: string; category: string; parentId?: string }
export interface NavigationItem { routeId: string; children?: readonly NavigationItem[] }
export interface KnowledgeDocument {
  id: string; title: string; slug: string; category: string; summary: string;
  content: string; keywords: readonly string[]; relatedPage: string;
  updatedAt: string | null; sourceIds: readonly string[];
  needsVerification?: boolean; verificationNote?: string;
}
