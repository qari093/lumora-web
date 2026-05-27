export interface OptimizedCachePolicy {
  ttlSeconds: number;
  staleWhileRevalidateSeconds: number;
  mode: "normal" | "aggressive";
}

export function buildOptimizedCachePolicy(input: {
  feature: "dashboard" | "whisper" | "constellation" | "ritual";
  cacheHitRatio: number;
}): OptimizedCachePolicy {
  const aggressive = input.cacheHitRatio < 0.6;

  if (input.feature === "ritual") {
    return { ttlSeconds: aggressive ? 86400 : 21600, staleWhileRevalidateSeconds: 604800, mode: aggressive ? "aggressive" : "normal" };
  }

  if (input.feature === "dashboard") {
    return { ttlSeconds: aggressive ? 300 : 60, staleWhileRevalidateSeconds: aggressive ? 1800 : 300, mode: aggressive ? "aggressive" : "normal" };
  }

  return { ttlSeconds: aggressive ? 3600 : 900, staleWhileRevalidateSeconds: aggressive ? 86400 : 3600, mode: aggressive ? "aggressive" : "normal" };
}
