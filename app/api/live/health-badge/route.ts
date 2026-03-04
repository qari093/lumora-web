import { _json, _err, _reqId } from "@/lib/live/http";
import { getSeedRooms } from "@/lib/live/rooms";

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
  try {
    const roomsActive = getSeedRooms().length;
    const _listeners = (globalThis as any).__LUMORA_LIVE_SSE_LISTENERS
      ? (globalThis as any).__LUMORA_LIVE_SSE_LISTENERS.size
      : 0;
    const health = { ok: true, ts: Date.now(), roomsActive, listeners };
    const body = { ok: true, ts: Date.now(), requestId: rid, health };
    const res = NextResponse._json(body, { status: 200 });
    res.headers.set("x-request-id", rid);
    res.headers.set("x-lumora-live", "health-badge-v1");
    for (const [k, v] of Object.entries(ratelimitHeaders())) res.headers.set(k, v);
    res.headers.set("cache-control", "no-store");
    return res;
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    const body = { ok: false, ts: Date.now(), requestId: rid, error: { code: "INTERNAL", message: msg } };
    const res = NextResponse._json(body, { status: 500 });
    res.headers.set("x-request-id", rid);
    for (const [k, v] of Object.entries(ratelimitHeaders())) res.headers.set(k, v);
    res.headers.set("cache-control", "no-store");
    return res;
  }
}
