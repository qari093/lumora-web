import type { CachePolicy, FeatureClass } from "./types";

export function cachePolicyForFeature(feature: FeatureClass, key: string): CachePolicy {
  switch (feature) {
    case "dashboard":
      return { key, ttlSeconds: 60, staleWhileRevalidateSeconds: 300 };
    case "whisper":
      return { key, ttlSeconds: 3600, staleWhileRevalidateSeconds: 86400 };
    case "constellation":
      return { key, ttlSeconds: 900, staleWhileRevalidateSeconds: 3600 };
    case "economy":
      return { key, ttlSeconds: 300, staleWhileRevalidateSeconds: 900 };
    case "mythic":
      return { key, ttlSeconds: 86400, staleWhileRevalidateSeconds: 604800 };
    default:
      return { key, ttlSeconds: 60, staleWhileRevalidateSeconds: 300 };
  }
}
