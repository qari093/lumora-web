type Bucket = { tokens: number; resetAt: number; };
const buckets: Map<string, Bucket> = new Map();

/**
 * Simple token-bucket limiter in memory (per-process).
 * key: e.g. "<route>::<ip>"
 * capacity: max tokens allowed in a window
 * windowMs: window length
 * cost: tokens to spend (default 1)
 * returns an object describing allowance & wait seconds
 */
export function takeToken(key: string, capacity: number, windowMs: number, cost = 1) {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    b = { tokens: capacity, resetAt: now + windowMs };
  }
  const allowed = b.tokens >= cost;
  if (allowed) b.tokens -= cost;
  buckets.set(key, b);
  const waitSec = allowed ? 0 : Math.ceil((b.resetAt - now) / 1000);
  return { ok: allowed, remaining: Math.max(0, b.tokens), resetAt: b.resetAt, waitSec };
}

export function clientIp(req: Request): string {
  // Best-effort; Next edge/node provides headers
  try {
    // @ts-ignore - compatible with both runtime types
    const ip = (req as any).ip || "";
    if (ip) return String(ip);
  } catch {}
  try {
    const h = (req as any).headers ?? new Headers();
    const xff = h.get?.("x-forwarded-for") || (h instanceof Headers ? h.get("x-forwarded-for") : null);
    if (xff) return xff.split(",")[0].trim();
  } catch {}
  return "0.0.0.0";
}
