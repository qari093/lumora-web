export function rateLimitHeaders() {
  return {
    "x-ratelimit-limit": "1000",
    "x-ratelimit-remaining": "999",
  };
}
