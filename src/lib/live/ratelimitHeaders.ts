export function rateLimitHeaders() {
  const now = Math.floor(Date.now() / 1000);

  return {
    "x-ratelimit-limit": "1000",
    "x-ratelimit-remaining": "999",
    "x-ratelimit-reset": String(now + 60),
  };
}
