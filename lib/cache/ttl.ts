/**
 * Tiny TTL cache (process-local) for cache-first APIs.
 * - No deps
 * - Safe for server runtimes; in Edge, process-local cache may be per-isolate.
 */
export type CacheGet<T> = (key: string) => Promise<T | null>;
export type CacheSet<T> = (key: string, value: T, ttlMs: number) => Promise<void>;

type Entry = { exp: number; json: string };

const g = globalThis as any;
const store: Map<string, Entry> = g.__LUMORA_TTL_CACHE__ ?? (g.__LUMORA_TTL_CACHE__ = new Map());

export async function ttlGet<T>(key: string): Promise<T | null> {
  const e = store.get(key);
  if (!e) return null;
  if (Date.now() > e.exp) {
    store.delete(key);
    return null;
  }
  try {
    return JSON.parse(e.json) as T;
  } catch {
    store.delete(key);
    return null;
  }
}

export async function ttlSet<T>(key: string, value: T, ttlMs: number): Promise<void> {
  const exp = Date.now() + Math.max(250, ttlMs | 0);
  store.set(key, { exp, json: JSON.stringify(value) });
}
