import { NextResponse } from "next/server";

export function ratelimitHeaders() {
  // Stable headers for tests; real limiter can wrap this later.
  return {
    "x-ratelimit-limit": "60",
    "x-ratelimit-remaining": "59",
    "x-ratelimit-reset": String(Math.floor(Date.now() / 1000) + 60),
  } as Record<string, string>;
}

export function withLiveHeaders(res: NextResponse) {
  const h = ratelimitHeaders();
  Object.entries(h).forEach(([k, v]) => res.headers.set(k, v));
  res.headers.set("cache-control", "no-store");
  return res;
}

export function liveSseHeaders() {
  return {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-store, no-transform",
    "connection": "keep-alive",
    "x-accel-buffering": "no",
  } as Record<string, string>;
}
