import { checkConciergeRateLimit } from "@/lib/ai/rate-limit";
import { answerConcierge } from "@/lib/ai/service";
import type { ConciergeHistoryItem } from "@/lib/ai/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const maxMessageLength = 1200;
const maxHistoryItems = 8;
const noStore = { "Cache-Control": "no-store" };

function cleanText(value: unknown, maxLength = maxMessageLength) {
  if (typeof value !== "string") return null;
  const text = value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  return text && text.length <= maxLength ? text : null;
}
function parseHistory(value: unknown): ConciergeHistoryItem[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > maxHistoryItems) return null;
  const items: ConciergeHistoryItem[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const candidate = item as Record<string, unknown>;
    const content = cleanText(candidate.content);
    if ((candidate.role !== "user" && candidate.role !== "assistant") || !content) return null;
    items.push({ role: candidate.role, content });
  }
  return items;
}
function response(body: unknown, init?: ResponseInit) { return Response.json(body, { ...init, headers: { ...noStore, ...init?.headers } }); }

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return response({ error: "Content-Type harus application/json." }, { status: 415 });
  const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  if (!checkConciergeRateLimit(clientKey)) return response({ error: "Terlalu banyak permintaan. Coba lagi beberapa menit lagi." }, { status: 429 });
  let payload: unknown;
  try { payload = await request.json(); } catch { return response({ error: "Permintaan tidak valid." }, { status: 400 }); }
  if (!payload || typeof payload !== "object") return response({ error: "Permintaan tidak valid." }, { status: 400 });
  const candidate = payload as Record<string, unknown>;
  const message = cleanText(candidate.message);
  const history = parseHistory(candidate.history);
  if (!message || !history) return response({ error: "Permintaan tidak valid." }, { status: 400 });
  return response(await answerConcierge(message, history));
}
