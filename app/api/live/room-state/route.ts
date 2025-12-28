import { withSafeLive } from "@/lib/live/withSafeLive";
import { rateLimitHeaders } from "@/lib/live/rateLimitHeaders";
import { makeRequestId } from "@/lib/live/requestId";
import { get, ensure } from "@/lib/live/roomStateStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withSafeLive(async (req: Request) => {
  const requestId = makeRequestId();
  const url = new URL(req.url);
  const roomId = String(url.searchParams.get("roomId") || "demo-room");
  ensure(roomId);
  const state = get(roomId);

  return new Response(
    JSON.stringify({
      ok: true,
      marker: "live-room-state",
      requestId,
      roomId,
      state: {
        roomId: state.roomId,
        title: state.title ?? state.roomId,
        isLive: Boolean(state.isLive),
        viewerCount: Number.isFinite(state.viewerCount as number) ? (state.viewerCount as number) : 0,
        updatedAt: state.updatedAt,
        lastEventAt: state.lastEventAt,
      },
      lastEventAt: state.lastEventAt,
      ts: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "x-request-id": requestId,
        ...rateLimitHeaders(),
      },
    }
  );
});
