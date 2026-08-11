import { NextResponse } from "next/server";
import { liveRateLimitHeaders } from "@/lib/live/rateLimitHeaders";

export function jsonLive<T extends Record<string, unknown>>(
  body: T,
  requestId: string,
  status: number = 200,
  extraHeaders: Record<string, string> = {}
) {
  const headers = {
    ...liveRateLimitHeaders(),
    "cache-control": "no-store",
    "x-request-id": requestId,
    ...extraHeaders,
  };
  return NextResponse.json({ ...body, requestId }, { status, headers });
}
