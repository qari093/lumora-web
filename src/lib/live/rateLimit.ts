type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function now() {
  return Date.now();
}

export function getClientIp(req: Request): string {
  const h = req.headers;
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim() || "unknown";
  const xrip = h.get("x-real-ip");
  if (xrip) return xrip.trim() || "unknown";
  return "unknown";
}

export function rateLimitOrNull(opts: {
  key: string;
  limit: number;
  windowMs: number;
}): { remaining: number; resetAt: number } | null {
  const t = now();
  const b = buckets.get(opts.key);

  if (!b || t >= b.resetAt) {
    const nb: Bucket = { count: 1, resetAt: t + opts.windowMs };
    buckets.set(opts.key, nb);
    return { remaining: Math.max(0, opts.limit - 1), resetAt: nb.resetAt };
  }

  if (b.count >= opts.limit) return null;
  b.count += 1;
  return { remaining: Math.max(0, opts.limit - b.count), resetAt: b.resetAt };
}

export function rateLimitHeaders(meta: { limit: number; remaining: number; resetAt: number }) {
  const resetSec = Math.ceil(meta.resetAt / 1000);
  return {
    "x-ratelimit-limit": String(meta.limit),
    "x-ratelimit-remaining": String(meta.remaining),
    "x-ratelimit-reset": String(resetSec),
    "cache-control": "no-store",
  } as Record<string, string>;
}
