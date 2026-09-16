import { schoolContent } from "@/data/content/school";
import { isUnsafeConciergeRequest, retrieveKnowledge } from "@/lib/knowledge/retrieve";
import { GeminiProvider } from "./gemini";
import { conciergeSystemInstruction } from "./prompt";
import type { AIProvider, ConciergeHistoryItem, ConciergeResponse } from "./types";

export const unavailableAnswer = "Maaf, Sahabat Perwanida sedang tidak dapat menjawab. Anda tetap dapat mencari informasi melalui menu website atau menghubungi sekolah.";
export const unavailableInformationAnswer = "Informasi tersebut belum tersedia di website Perwanida.";

const latestNewsQuestion = /\b(berita|kabar|informasi)\b.*\b(terbaru|terkini)\w*\b|\b(terbaru|terkini)\w*\b.*\b(berita|kabar|informasi)\b/i;

function latestNewsResponse(): ConciergeResponse | null {
  const newestArticle = schoolContent.articles
    .filter((article) => article.publishedAt && !Number.isNaN(Date.parse(article.publishedAt)))
    .sort((left, right) => Date.parse(right.publishedAt!) - Date.parse(left.publishedAt!))[0];
  if (newestArticle?.publishedAt) {
    const publishedAt = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(new Date(newestArticle.publishedAt));
    return {
      answer: `Berita terbaru yang tersedia di website Perwanida adalah “${newestArticle.title}”, diterbitkan pada ${publishedAt}.`,
      sources: [{ title: newestArticle.title, href: newestArticle.relatedPage }],
      fallback: false,
      suggestedActions: [],
    };
  }

  const datedGalleryItem = schoolContent.gallery.find((item) => /\b(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+\d{4}\b/i.test(item.title));
  if (!datedGalleryItem) return null;

  return {
    answer: `Saat ini belum ada artikel berita yang dipublikasikan di website Perwanida. Konten kegiatan yang memiliki penanda waktu terbaru di website adalah “${datedGalleryItem.title}”. Tanggal hari tidak tercantum pada sumber, sehingga yang dapat dipastikan adalah ${datedGalleryItem.title.replace(/^EVENT\s+/i, "")}.`,
    sources: [{ title: "Galeri", href: datedGalleryItem.relatedPage }],
    fallback: false,
    suggestedActions: [],
  };
}

function adminAction() {
  return schoolContent.contact.whatsappUrl ? [{ label: "Hubungi Admin Perwanida", href: schoolContent.contact.whatsappUrl }] : [];
}
function sourcesFor(documents: ReturnType<typeof retrieveKnowledge>["documents"]) {
  return [...new Map(documents.map((document) => [document.relatedPage, { title: document.title, href: document.relatedPage }])).values()].slice(0, 3);
}
function verificationNotice(documents: ReturnType<typeof retrieveKnowledge>["documents"]) {
  return documents.find((document) => document.needsVerification)?.verificationNote;
}
export interface ConciergeServiceOptions { provider?: AIProvider | null }

export async function answerConcierge(message: string, history: readonly ConciergeHistoryItem[], options: ConciergeServiceOptions = {}): Promise<ConciergeResponse> {
  if (isUnsafeConciergeRequest(message)) {
    return { answer: unavailableInformationAnswer, sources: [], fallback: true, suggestedActions: adminAction() };
  }
  if (latestNewsQuestion.test(message)) {
    const response = latestNewsResponse();
    if (response) return response;
  }
  const retrieval = retrieveKnowledge(message);
  if (!retrieval.documents.length) {
    return { answer: unavailableInformationAnswer, sources: [], fallback: true, suggestedActions: adminAction() };
  }
  const provider = options.provider === undefined
    ? (process.env.GEMINI_API_KEY?.trim() ? new GeminiProvider(process.env.GEMINI_API_KEY.trim()) : null)
    : options.provider;
  const sources = sourcesFor(retrieval.documents);
  if (!provider) return { answer: unavailableAnswer, sources, fallback: true, suggestedActions: adminAction() };
  try {
    const generated = await provider.generateAnswer({ message, history, documents: retrieval.documents, systemInstruction: conciergeSystemInstruction });
    const note = verificationNotice(retrieval.documents);
    const answer = note && !generated.includes(note) ? `${generated}\n\nCatatan: ${note}` : generated;
    return { answer, sources, fallback: false, suggestedActions: [] };
  } catch {
    return { answer: unavailableAnswer, sources, fallback: true, suggestedActions: adminAction() };
  }
}
