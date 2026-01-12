/**
 * Lumora Offline Videos — Public Surface
 * Keep this file SMALL and stable. Tests and external callers import from:
 *   import * as OfflineVideos from "../../src/lib/offline/videos";
 */

export { signFrame, verifyFrame } from "./p2p_chunk_protocol";

/**
 * Best-effort in-memory seen-cache used for replay protection in offline/P2P flows.
 * Contract:
 *  - call(id) returns true if id has been seen before, else false and records it
 *  - reset() clears
 *  - size() returns current count
 */
export type SeenCache = {
  seen: (id: string) => boolean;
  reset: () => void;
  size: () => number;
};

export function createInMemorySeenCache(maxEntries: number = 50_000): SeenCache {
  const m = new Map<string, number>();
  const seen = (id: string): boolean => {
    const key = String(id || "");
    if (!key) return false;
    if (m.has(key)) return true;
    m.set(key, Date.now());
    // simple bounded eviction (oldest insertion)
    if (m.size > maxEntries) {
      const first = m.keys().next();
      if (!first.done) m.delete(first.value);
    }
    return false;
  };
  const reset = () => m.clear();
  const size = () => m.size;
  return { seen, reset, size };
}

/**
 * Best-effort token-bucket rate limiter (in-memory, per-process).
 * Returns a structured decision suitable for tests and future wiring.
 */
export type RateLimitDecision = {
  ok: boolean;
  remaining: number;
  resetMs: number;
  reason?: "rate_limited" | "invalid";
};

const __rl = new Map<string, { tokens: number; lastMs: number }>();

export function rateLimitConsume(
  key: string,
  opts?: { capacity?: number; refillPerSec?: number; nowMs?: number }
): RateLimitDecision {
  const k = String(key || "");
  if (!k) return { ok: false, remaining: 0, resetMs: 0, reason: "invalid" };

  const capacity = Math.max(1, Math.floor(opts?.capacity ?? 10));
  const refillPerSec = Math.max(0.0001, Number(opts?.refillPerSec ?? 5));
  const nowMs = Number.isFinite(opts?.nowMs as any) ? Number(opts?.nowMs) : Date.now();

  const st = __rl.get(k) ?? { tokens: capacity, lastMs: nowMs };
  const elapsed = Math.max(0, nowMs - st.lastMs);
  const refill = (elapsed / 1000) * refillPerSec;
  st.tokens = Math.min(capacity, st.tokens + refill);
  st.lastMs = nowMs;

  if (st.tokens >= 1) {
    st.tokens -= 1;
    __rl.set(k, st);
    return { ok: true, remaining: Math.floor(st.tokens), resetMs: 0 };
  }

  // estimate reset time until 1 token available
  const need = 1 - st.tokens;
  const waitMs = Math.ceil((need / refillPerSec) * 1000);
  __rl.set(k, st);
  return { ok: false, remaining: 0, resetMs: waitMs, reason: "rate_limited" };
}

/**
 * Alias exports for compatibility with older call sites/tests.
 * Keep these as const aliases (no re-export duplication).
 */
export const p2pConsumeRateLimit = rateLimitConsume;
export const seenCacheCreate = createInMemorySeenCache;
