import { withSafeLive } from "@/lib/live/withSafeLive";
import { NextResponse } from "next/server";
import { rateLimitHeaders } from "@/lib/live/rateLimitHeaders";
import { emitLiveEvent } from "@/src/lib/live/eventBus";
import { touchHubFromEvent } from "@/src/lib/live/portalHubStore";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return withSafeLive(async () => {
  /* LIVE_RL_POST_V0 */
  const ip = getClientIp(req);
  const key = `live:mic:post:${ip}`;
  const rl = rateLimitOrNull({ key, limit: 240, windowMs: 60000 });
  if (!rl) return new Response("rate_limited", { status: 429, headers: { "retry-after": "60", "cache-control": "no-store" } });
  const rlMeta = { limit: 240, remaining: rl.remaining, resetAt: rl.resetAt };
  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 }, { headers: rateLimitHeaders(rlMeta) });
  }

  const roomId = typeof body?.roomId === "string" ? body.roomId.trim() : "";
  if (!roomId) return NextResponse.json({ ok: false, error: "roomId_required" }, { status: 400 }, { headers: rateLimitHeaders(rlMeta) });

  const enabled = !!body?.enabled;
  const levelRaw = body?.level;
  const level = typeof levelRaw === "number" && isFinite(levelRaw) ? Math.max(0, Math.min(1, levelRaw)) : 0;
  const speaking = !!body?.speaking;

  emitLiveEvent(roomId, {
    type: "mic",
    roomId,
    payload: { enabled, level, speaking },
    ts: new Date().toISOString(),
  });

  touchHubFromEvent(roomId, "mic");

  return NextResponse.json({ ok: true, ts: new Date().toISOString() }, { headers: rateLimitHeaders(rlMeta) });
}
