import { createHash } from "node:crypto";

export interface RateLimitStore { check(identifier: string, now?: number): boolean }
export interface MemoryRateLimitOptions { windowMs?: number; maxRequests?: number }

/** Per-process fallback. Replace this store with a platform/KV implementation for multi-instance hosting. */
export class MemoryRateLimitStore implements RateLimitStore {
  private readonly requests = new Map<string, number[]>();
  private readonly windowMs: number;
  private readonly maxRequests: number;
  constructor({ windowMs = 5 * 60 * 1000, maxRequests = 15 }: MemoryRateLimitOptions = {}) { this.windowMs = windowMs; this.maxRequests = maxRequests; }
  check(identifier: string, now = Date.now()) {
    const recent = (this.requests.get(identifier) ?? []).filter((time) => now - time < this.windowMs);
    if (recent.length >= this.maxRequests) { this.requests.set(identifier, recent); return false; }
    this.requests.set(identifier, [...recent, now]);
    return true;
  }
  clear() { this.requests.clear(); }
}

const store = new MemoryRateLimitStore();
export function privacyPreservingClientKey(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}
export function checkConciergeRateLimit(clientKey: string, now = Date.now()) { return store.check(privacyPreservingClientKey(clientKey), now); }
export function resetConciergeRateLimitForTests() { store.clear(); }
