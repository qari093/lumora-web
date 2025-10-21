export type HitType = "imp" | "click";
export type HitKey = { type: HitType; cid: string; rid: string; ip: string; ua: string };
export type HitRecord = { count: number; firstAt: number; lastAt: number; expAt: number };

declare global {
  // eslint-disable-next-line no-var
  var __AD_TRACK: Map<string, HitRecord> | undefined;
}

const store: Map<string, HitRecord> = (globalThis.__AD_TRACK ||= new Map());
const TTL_MS = 24 * 60 * 60 * 1000; // 24h

function keyToStr(k: HitKey): string {
  return [k.type, k.cid, k.rid, k.ip, normalizeUa(k.ua)].join("::");
}

function normalizeUa(ua: string) {
  return (ua || "").slice(0, 160).toLowerCase();
}

export function recordHit(k: HitKey, now = Date.now()) {
  prune(now);
  const ks = keyToStr(k);
  const prev = store.get(ks);
  if (!prev) {
    const rec: HitRecord = { count: 1, firstAt: now, lastAt: now, expAt: now + TTL_MS };
    store.set(ks, rec);
    return { deduped: false as const, rec };
  }
  // Idempotent semantics: treat same key within TTL as duplicate; increment a soft counter but flag deduped
  prev.count = Math.min(prev.count + 1, 10_000);
  prev.lastAt = now;
  return { deduped: true as const, rec: prev };
}

export function metricsSnapshot(now = Date.now()) {
  prune(now);
  let imps = 0, clicks = 0;
  for (const [k, v] of store.entries()) {
    if (k.startsWith("imp::")) imps += v.count > 0 ? 1 : 0;
    else if (k.startsWith("click::")) clicks += v.count > 0 ? 1 : 0;
  }
  return { keys: store.size, imps, clicks };
}

/** NEW: dump all keys for aggregation/reporting (dev-use only). */
export function dumpAll(now = Date.now()): Array<{ key: string; rec: HitRecord }> {
  prune(now);
  return Array.from(store.entries()).map(([key, rec]) => ({ key, rec }));
}

function prune(now = Date.now()) {
  for (const [k, v] of store.entries()) {
    if (v.expAt <= now) store.delete(k);
  }
}
