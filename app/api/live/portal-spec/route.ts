import { withSafeLive } from "@/lib/live/withSafeLive";
import { NextResponse } from "next/server";
import { rateLimitHeaders } from "@/lib/live/rateLimitHeaders";
import { LIVE_PORTAL_SPEC_V2 } from "@/src/lib/live/portalSpec";

export const runtime = "nodejs";

export async function GET(req: Request) {
  return withSafeLive(async () => {
  /* LIVE_RL_V0 */
  const ip = getClientIp(req);
  const url = new URL(req.url);
  const roomKey = url.searchParams.get("roomId") || "";
  const key = `live:spec:get:${ip}:${roomKey}`;
  const rl = rateLimitOrNull({ key, limit: 60, windowMs: 60000 });
  if (!rl) return new Response("rate_limited", { status: 429, headers: { "retry-after": "60", "cache-control": "no-store" } });
  const rlMeta = { limit: 60, remaining: rl.remaining, resetAt: rl.resetAt };
  return NextResponse.json({ ok: true, spec: LIVE_PORTAL_SPEC_V2, ts: new Date().toISOString() }, { headers: rateLimitHeaders(rlMeta) });
}
