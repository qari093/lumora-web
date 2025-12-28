export function rateLimitHeaders() {
  const limit = 60;
  const remaining = 59;
  const reset = Math.floor(Date.now() / 1000) + 60;
  return {
    "x-ratelimit-limit": String(limit),
    "x-ratelimit-remaining": String(remaining),
    "x-ratelimit-reset": String(reset),
  } as Record<string, string>;
}
