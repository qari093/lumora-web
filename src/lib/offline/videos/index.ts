// Canonical Offline Videos public surface.
// Keep this file stable: it is the import target for the rest of the app and for tests.

export * from "./p2p_chunk_protocol";

/** Best-effort in-memory replay cache config. */
export type OfflineSeenCacheCfg = { ttlMs?: number; max?: number };

/**
 * In-memory replay/duplicate detector.
 * `seen(id)` returns true if id was already seen within TTL window.
 */
export function createInMemorySeenCache(cfg: OfflineSeenCacheCfg = {}) {
  const ttlMs = Math.max(1, Number(cfg.ttlMs ?? 5 * 60_000));
  const max = Math.max(8, Number(cfg.max ?? 4096));
  const map = new Map<string, number>();

  function gc(now: number) {
    for (const [k, t] of map) {
      if (now - t > ttlMs) map.delete(k);
    }
    while (map.size > max) {
      const it = map.keys().next();
      if (it.done) break;
      map.delete(it.value);
    }
  }

  return {
    seen(id: string) {
      const now = Date.now();
      const key = String(id || "");
      if (!key) return false;
      gc(now);
      const had = map.has(key);
      map.set(key, now);
      return had;
    },
    _size() {
      return map.size;
    },
    _clear() {
      map.clear();
    },
  };
}

// Alias kept for legacy callers/tests.
export const seenCacheCreate = createInMemorySeenCache;

export type OfflineRateLimitCfg = { key: string; limit: number; windowMs: number };
export type OfflineRateLimitDecision = { ok: boolean; retryAfterMs: number; remaining: number };

type __RateState = { resetAt: number; count: number };
const __rlStore: Map<string, __RateState> = new Map();

function __normDecision(x: any, fallbackRemaining: number): OfflineRateLimitDecision {
  const ok = typeof x?.ok === "boolean" ? x.ok : true;
  const retryAfterMs = Number.isFinite(Number(x?.retryAfterMs)) ? Number(x.retryAfterMs) : 0;
  const remaining = Number.isFinite(Number(x?.remaining)) ? Number(x.remaining) : Math.max(0, fallbackRemaining);
  return { ok, retryAfterMs: Math.max(0, retryAfterMs), remaining: Math.max(0, remaining) };
}

/**
 * Minimal token bucket-ish helper (dependency-free).
 * Always returns a stable shape: { ok, retryAfterMs, remaining }.
 */
export function rateLimitConsume(cfg: OfflineRateLimitCfg, nowMs: number = Date.now()): OfflineRateLimitDecision {
  const key = String(cfg?.key || "");
  const limit = Math.max(1, Number(cfg?.limit ?? 1));
  const windowMs = Math.max(1, Number(cfg?.windowMs ?? 1000));

  if (!key) return __normDecision({ ok: true, retryAfterMs: 0, remaining: limit }, limit);

  const cur = __rlStore.get(key);
  if (!cur || nowMs >= cur.resetAt) {
    const resetAt = nowMs + windowMs;
    __rlStore.set(key, { resetAt, count: 1 });
    return __normDecision({ ok: true, retryAfterMs: 0, remaining: Math.max(0, limit - 1) }, limit - 1);
  }

  if (cur.count >= limit) {
    const ra = Math.max(0, cur.resetAt - nowMs);
    return __normDecision({ ok: false, retryAfterMs: ra, remaining: 0 }, 0);
  }

  cur.count += 1;
  __rlStore.set(key, cur);
  return __normDecision({ ok: true, retryAfterMs: 0, remaining: Math.max(0, limit - cur.count) }, limit - cur.count);
}

// Alias kept for legacy callers/tests.
export const p2pConsumeRateLimit = rateLimitConsume;
