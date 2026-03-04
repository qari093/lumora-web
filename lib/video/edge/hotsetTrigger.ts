export type HotsetTier = "NONE" | "CANDIDATE" | "PROMOTE";

export type HotsetInputs = Readonly<{
  // recent views/min (or any normalized velocity scalar from your ranking layer)
  velocity: number;
  // cache hit ratio 0..1 for HOT aggregator
  cacheHit: number;
  // computed egress pressure 0..1 (0 ok, 1 critical)
  egress: number;
  // operator safety cap: if false, never auto-promote to R2 hotset
  operatorAllowPromote: boolean;
}>;

export type HotsetDecision = Readonly<{
  tier: HotsetTier;
  // how long to keep hotset objects around (seconds); undefined unless PROMOTE
  ttlSec?: number;
  reason: string;
}>;

const clamp01 = (v: number) => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0);

export const HOTSET_TTL_SEC = 6 * 60 * 60; // 6h default hotset retention (can be tuned later)
export const HOTSET_MIN_VELOCITY = 120; // promote only if clearly viral
export const HOTSET_CACHE_HIT_MIN = 0.7; // if cache is already good, less need
export const HOTSET_EGRESS_MIN = 0.6; // if egress pressure is high, promote earlier

export function decideHotset(i: HotsetInputs): HotsetDecision {
  const velocity = Number.isFinite(i.velocity) ? i.velocity : 0;
  const cacheHit = clamp01(i.cacheHit);
  const egress = clamp01(i.egress);

  if (!i.operatorAllowPromote) {
    return { tier: "NONE", reason: "operator_disallow" };
  }

  // Must be viral OR egress critical, and cache isn't already great.
  const viral = velocity >= HOTSET_MIN_VELOCITY;
  const egressCritical = egress >= HOTSET_EGRESS_MIN;
  const cacheWeak = cacheHit < HOTSET_CACHE_HIT_MIN;

  if ((viral || egressCritical) && cacheWeak) {
    return { tier: "PROMOTE", ttlSec: HOTSET_TTL_SEC, reason: viral ? "viral_cache_weak" : "egress_critical_cache_weak" };
  }

  if (viral && !cacheWeak) {
    return { tier: "CANDIDATE", reason: "viral_cache_ok" };
  }

  return { tier: "NONE", reason: "below_threshold" };
}
