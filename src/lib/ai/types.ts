import type { RetrievedKnowledgeDocument } from "@/lib/knowledge/retrieve";

export type ConciergeRole = "user" | "assistant";
export interface ConciergeHistoryItem { role: ConciergeRole; content: string }
export interface ConciergeSource { title: string; href: string }
export interface ConciergeAction { label: string; href: string }
export interface ConciergeResponse {
  answer: string;
  sources: readonly ConciergeSource[];
  fallback: boolean;
  suggestedActions: readonly ConciergeAction[];
}
export interface GenerateAnswerInput {
  message: string;
  history: readonly ConciergeHistoryItem[];
  documents: readonly RetrievedKnowledgeDocument[];
  systemInstruction: string;
}
export interface AIProvider { generateAnswer(input: GenerateAnswerInput): Promise<string> }
