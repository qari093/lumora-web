import type { LumoraSignal } from "@/types/lumora.signal";

export type SignalCacheEntry = {
  key: string;
  signals: LumoraSignal[];
  createdAt: number;
  expiresAt: number;
};

const CACHE = new Map<string, SignalCacheEntry>();

export function getSignalCache(key: string): SignalCacheEntry | null {
  const entry = CACHE.get(key);
  if (!entry) return null;

  if (Date.now() >= entry.expiresAt) {
    CACHE.delete(key);
    return null;
  }

  return entry;
}

export function setSignalCache(
  key: string,
  signals: LumoraSignal[],
  ttlMs = 60_000
): SignalCacheEntry {
  const now = Date.now();
  const entry: SignalCacheEntry = {
    key,
    signals: Array.isArray(signals) ? signals : [],
    createdAt: now,
    expiresAt: now + ttlMs,
  };
  CACHE.set(key, entry);
  return entry;
}

export function clearSignalCache(key?: string) {
  if (key) {
    CACHE.delete(key);
    return;
  }
  CACHE.clear();
}

export function listSignalCacheKeys(): string[] {
  return Array.from(CACHE.keys()).sort();
}
