export function isExpired(ts: number, ttlMs: number): boolean {
  return Date.now() - ts > ttlMs;
}
