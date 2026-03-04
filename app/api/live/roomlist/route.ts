import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function requestId() {
  return `req_${Date.now().toString(36)}_${Math.random().toString(16).slice(2, 10)}`;
}
function ratelimitHeaders() {
  const now = Math.floor(Date.now() / 1000);
  return {
    "x-ratelimit-limit": "60",
    "x-ratelimit-remaining": "59",
    "x-ratelimit-reset": String(now + 60),
  };
}

export async function GET() {
  const rid = requestId();
  const body = { ok: false, ts: Date.now(), requestId: rid, error: { code: "ROUTE_DEPRECATED", message: "Route deprecated" } };
  const res = NextResponse.json(body, { status: 410 });
  res.headers.set("x-request-id", rid);
  for (const [k, v] of Object.entries(ratelimitHeaders())) res.headers.set(k, v);
  res.headers.set("cache-control", "no-store");
  return res;
}
