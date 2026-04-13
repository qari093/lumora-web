export type RateLimitInput = {
  key?: string | null;
  limit?: number | null;
  windowMs?: number | null;
  requestCount?: number | null;
};

export type RateLimitResult =
  | {
      ok: true;
      state: {
        key: string;
        limit: number;
        windowMs: number;
        requestCount: number;
        remaining: number;
        allowed: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateRateLimit(input: RateLimitInput): RateLimitResult {
  const key = typeof input.key === "string" ? input.key.trim() : "";
  const limit =
    typeof input.limit === "number" && Number.isFinite(input.limit)
      ? Math.trunc(input.limit)
      : NaN;
  const windowMs =
    typeof input.windowMs === "number" && Number.isFinite(input.windowMs)
      ? Math.trunc(input.windowMs)
      : NaN;
  const requestCount =
    typeof input.requestCount === "number" && Number.isFinite(input.requestCount)
      ? Math.trunc(input.requestCount)
      : NaN;

  if (!key) return { ok: false, reason: "missing_key" };
  if (!Number.isFinite(limit) || limit <= 0) return { ok: false, reason: "invalid_limit" };
  if (!Number.isFinite(windowMs) || windowMs <= 0) return { ok: false, reason: "invalid_window_ms" };
  if (!Number.isFinite(requestCount) || requestCount < 0) {
    return { ok: false, reason: "invalid_request_count" };
  }

  const remaining = Math.max(0, limit - requestCount);
  const allowed = requestCount < limit;

  return {
    ok: true,
    state: {
      key,
      limit,
      windowMs,
      requestCount,
      remaining,
      allowed,
    },
  };
}
