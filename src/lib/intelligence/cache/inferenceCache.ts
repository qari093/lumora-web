export type InferenceCacheValue = {
  key: string;
  payload: unknown;
  createdAt: number;
  expiresAt: number;
};

const INFERENCE_CACHE = new Map<string, InferenceCacheValue>();

export function getInferenceCache(key: string): InferenceCacheValue | null {
  const entry = INFERENCE_CACHE.get(key);
  if (!entry) return null;

  if (Date.now() >= entry.expiresAt) {
    INFERENCE_CACHE.delete(key);
    return null;
  }

  return entry;
}

export function setInferenceCache(
  key: string,
  payload: unknown,
  ttlMs = 5 * 60 * 1000
): InferenceCacheValue {
  const now = Date.now();
  const entry: InferenceCacheValue = {
    key,
    payload,
    createdAt: now,
    expiresAt: now + ttlMs,
  };
  INFERENCE_CACHE.set(key, entry);
  return entry;
}

export function clearInferenceCache(key?: string) {
  if (key) {
    INFERENCE_CACHE.delete(key);
    return;
  }
  INFERENCE_CACHE.clear();
}

export function listInferenceCacheKeys(): string[] {
  const now = Date.now();
  for (const [key, value] of INFERENCE_CACHE.entries()) {
    if (now >= value.expiresAt) INFERENCE_CACHE.delete(key);
  }
  return Array.from(INFERENCE_CACHE.keys()).sort();
}
