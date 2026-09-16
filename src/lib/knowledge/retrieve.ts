import { schoolContent } from "@/data/content/school";
import { toKnowledgeDocuments } from "@/lib/content";
import type { KnowledgeDocument } from "@/types/content";

export interface RetrievedKnowledgeDocument extends KnowledgeDocument {
  score: number;
}

export interface RetrievalResult {
  documents: readonly RetrievedKnowledgeDocument[];
  normalizedQuery: string;
}

const stopWords = new Set([
  "ada", "adalah", "apa", "apakah", "atau", "bagaimana", "bisa", "buka", "dan", "di", "dengan", "dimana", "hari", "ini", "itu", "jadi", "kalo", "ke", "kah", "lagi", "masih", "mau", "punya", "saja", "saya", "sekolah", "sih", "tentang", "untuk", "yang",
]);

const aliases: Record<string, readonly string[]> = {
  ppdb: ["spmb", "pendaftaran"],
  pendaftaran: ["spmb", "daftar"],
  daftar: ["spmb", "pendaftaran"],
  ngaji: ["mengaji", "ummi"],
  ustadz: ["guru", "pendidik"],
  ustadzah: ["guru", "pendidik"],
  pengajar: ["guru", "pendidik"],
  guru: ["pendidik"],
  ruangan: ["fasilitas"],
  ruang: ["fasilitas"],
  kelas: ["ruang", "belajar"],
  lokasi: ["alamat", "kontak"],
  alamat: ["lokasi", "kontak"],
  wa: ["whatsapp", "kontak"],
  whatsapp: ["wa", "kontak"],
  ekskul: ["ekstrakurikuler"],
};

const unsupportedTopics = /\b(biaya|harga|tarif|bayar|pembayaran|uang\s+(masuk|gedung|sekolah))\b/i;
const outOfScopeTopics = /\b(cuaca|ramalan|saham|kripto|politik|resep|permainan)\b/i;
const unsafeRequest = /\b(system\s*prompt|ignore\s+(all|previous)|api\s*key|kunci\s*api|developer\s*message|instruksi\s*(rahasia|sistem)|jailbreak)\b/i;
const featuredProgramQuestion = /\b(program\s+unggulan|unggulan)\b/i;

function normalized(value: string) {
  return value
    .toLocaleLowerCase("id-ID")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokens(value: string) {
  return normalized(value).split(" ").filter((token) => token && !stopWords.has(token) && (token.length > 1 || token === "b"));
}

function queryTokens(query: string) {
  const direct = tokens(query);
  return [...new Set([...direct, ...direct.flatMap((token) => aliases[token] ?? [])])];
}

function fieldHasToken(field: string, token: string) {
  return tokens(field).includes(token);
}

function scoreDocument(document: KnowledgeDocument, query: string, queryWords: readonly string[]) {
  const title = normalized(document.title);
  const category = normalized(document.category);
  const keywords = normalized(document.keywords.join(" "));
  const summary = normalized(document.summary);
  const content = normalized(document.content);
  const phrase = normalized(query);
  let score = phrase.length >= 4 && title.includes(phrase) ? 60 : 0;
  if (phrase.length >= 4 && content.includes(phrase)) score += 24;
  if (/\b(alamat|lokasi|kontak|whatsapp|nomor)\b/i.test(query) && document.id === schoolContent.contact.id) score += 30;
  if (/\bguru\s+kelompok\s+b\b/i.test(query) && content.includes("guru kelompok b")) score += 30;

  for (const token of queryWords) {
    if (fieldHasToken(title, token)) score += 18;
    if (fieldHasToken(keywords, token)) score += 14;
    if (fieldHasToken(category, token)) score += 22;
    if (fieldHasToken(summary, token)) score += 4;
    if (fieldHasToken(content, token)) score += 3;
  }
  return score;
}

export function isUnsafeConciergeRequest(query: string) {
  return unsafeRequest.test(query);
}

export function retrieveKnowledge(query: string, limit = 6): RetrievalResult {
  const normalizedQuery = normalized(query);
  if (!normalizedQuery || unsupportedTopics.test(query) || outOfScopeTopics.test(query) || isUnsafeConciergeRequest(query)) {
    return { documents: [], normalizedQuery };
  }

  const directWords = tokens(query);
  const queryWords = queryTokens(query);
  if (!queryWords.length) return { documents: [], normalizedQuery };
  const knowledgeDocuments = toKnowledgeDocuments(schoolContent).filter((document) => document.id !== schoolContent.identity.id);
  if (featuredProgramQuestion.test(query)) {
    const featuredIds = new Set(schoolContent.programs.filter((program) => program.kind === "featured").map((program) => program.id));
    const documents = knowledgeDocuments
      .filter((document) => featuredIds.has(document.id))
      .map((document, index) => ({ ...document, score: 100 - index }))
      .slice(0, limit);
    return { documents, normalizedQuery };
  }
  const peopleQuestion = /\b(guru|ustadz|ustadzah|pengajar|pendidik)\b/i.test(query);

  const documents = knowledgeDocuments
    .filter((document) => !peopleQuestion || document.category === "pendidik" || document.category === "tenaga-kependidikan")
    .map((document) => ({ ...document, score: scoreDocument(document, query, queryWords) }))
    .filter((document) => {
      const matchingDirectWords = queryWords.filter((token) =>
        fieldHasToken([document.title, document.category, document.keywords.join(" "), document.summary, document.content].join(" "), token),
      );
      return document.score >= 20 && matchingDirectWords.length >= Math.ceil(directWords.length / 2);
    })
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title, "id"))
    .slice(0, limit);

  return { documents, normalizedQuery };
}
