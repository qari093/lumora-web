export type HotKey = Readonly<{
  // canonical content identifier (video id, trailer id, etc)
  contentId: string;
  // normalized variant id (e.g., "hls_720p", "hls_1080p")
  variant: string;
}>;

export type HotLevel = 0 | 1 | 2; // 0=OFF, 1=HOT, 2=HOTSET

export type HotAggregatorPolicy = Readonly<{
  level: HotLevel;
  // how long the aggregator stays valid before requiring a refresh
  ttlSec: number;
  // short TTL for segment signatures minted under the aggregator
  segmentTtlSec: number;
  // max signed segments minted per token (DoS guard)
  maxSegments: number;
}>;

export type HotAggregatorDecision = Readonly<{
  ok: true;
  key: HotKey;
  policy: HotAggregatorPolicy;
  // stable cache key (safe for KV/Redis)
  cacheKey: string;
}>;

export type HotAggregatorReject = Readonly<{
  ok: false;
  error: "key_invalid" | "policy_invalid";
  detail?: string;
}>;

export const HOT_TTL_DEFAULT_SEC = 900; // 15m
export const HOTSET_TTL_DEFAULT_SEC = 3600; // 1h
export const SEGMENT_TTL_DEFAULT_SEC = 60; // 60s segment URLs
export const SEGMENT_TTL_MAX_SEC = 120;
export const MAX_SEGMENTS_DEFAULT = 90;

// Conservative: allow only URL-safe tokens for IDs
const SAFE_RE = /^[A-Za-z0-9._~-]+$/;

export function hotCacheKey(k: HotKey): string {
  return `hot:${k.contentId}:${k.variant}`;
}

export function isValidHotKey(k: HotKey): boolean {
  return (
    !!k &&
    typeof k.contentId === "string" &&
    typeof k.variant === "string" &&
    k.contentId.length > 0 &&
    k.variant.length > 0 &&
    k.contentId.length <= 96 &&
    k.variant.length <= 48 &&
    SAFE_RE.test(k.contentId) &&
    SAFE_RE.test(k.variant)
  );
}

export function normalizeHotLevel(x: unknown): HotLevel {
  if (x === 2 || x === "2" || x === "HOTSET" || x === "hotset") return 2;
  if (x === 1 || x === "1" || x === "HOT" || x === "hot") return 1;
  return 0;
}

export function decideHotAggregator(input: {
  key: HotKey;
  level?: unknown;
  ttlSec?: unknown;
  segmentTtlSec?: unknown;
  maxSegments?: unknown;
}): HotAggregatorDecision | HotAggregatorReject {
  const key = input.key;
  if (!isValidHotKey(key)) return { ok: false, error: "key_invalid" };

  const level = normalizeHotLevel(input.level);

  const ttlFallback = level === 2 ? HOTSET_TTL_DEFAULT_SEC : HOT_TTL_DEFAULT_SEC;
  const ttlRaw = input.ttlSec == null ? ttlFallback : Number(input.ttlSec);
  const ttlSec = Number.isFinite(ttlRaw) ? Math.max(30, Math.min(86400, Math.floor(ttlRaw))) : ttlFallback;

  const segRaw = input.segmentTtlSec == null ? SEGMENT_TTL_DEFAULT_SEC : Number(input.segmentTtlSec);
  const segmentTtlSec = Number.isFinite(segRaw)
    ? Math.max(10, Math.min(SEGMENT_TTL_MAX_SEC, Math.floor(segRaw)))
    : SEGMENT_TTL_DEFAULT_SEC;

  const msRaw = input.maxSegments == null ? MAX_SEGMENTS_DEFAULT : Number(input.maxSegments);
  const maxSegments = Number.isFinite(msRaw) ? Math.max(10, Math.min(500, Math.floor(msRaw))) : MAX_SEGMENTS_DEFAULT;

  const policy: HotAggregatorPolicy = { level, ttlSec, segmentTtlSec, maxSegments };

  // policy invariant: segment TTL must be strictly less than aggregator TTL
  if (!(policy.segmentTtlSec < policy.ttlSec)) {
    return { ok: false, error: "policy_invalid", detail: "segment_ttl_must_be_lt_aggregator_ttl" };
  }

  return { ok: true, key, policy, cacheKey: hotCacheKey(key) };
}
