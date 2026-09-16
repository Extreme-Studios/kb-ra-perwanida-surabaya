import { schoolContent } from "@/data/content/school";
import { isUnsafeConciergeRequest, retrieveKnowledge } from "@/lib/knowledge/retrieve";
import { GeminiProvider } from "./gemini";
import { conciergeSystemInstruction } from "./prompt";
import type { AIProvider, ConciergeHistoryItem, ConciergeResponse } from "./types";

export const unavailableAnswer = "Maaf, Sahabat Perwanida sedang tidak dapat menjawab. Anda tetap dapat mencari informasi melalui menu website atau menghubungi sekolah.";
export const unavailableInformationAnswer = "Informasi tersebut belum tersedia di website Perwanida.";

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
