export type RateLimitInput = {
  hits?: number;
  limit?: number;
  windowSeconds?: number;
};

export type RateLimitResult = {
  allowed: boolean;
  hits: number;
  limit: number;
  remaining: number;
  windowSeconds: number;
};

export function evaluateRateLimit(input: RateLimitInput): RateLimitResult {
  const hits = Math.max(0, input.hits ?? 0);
  const limit = Math.max(1, input.limit ?? 30);
  const windowSeconds = Math.max(1, input.windowSeconds ?? 60);

  const allowed = hits < limit;
  const remaining = Math.max(0, limit - hits - (allowed ? 1 : 0));

  return {
    allowed,
    hits,
    limit,
    remaining,
    windowSeconds,
  };
}
