import { withSafeLive } from "@/lib/live/withSafeLive";
import { rateLimitHeaders } from "@/lib/live/rateLimitHeaders";
import { makeRequestId } from "@/lib/live/requestId";
import { list, ensure } from "@/lib/live/roomStateStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withSafeLive(async () => {
  const requestId = makeRequestId();
  ensure("demo-room");

  const rooms = list().map((r) => ({
    roomId: r.roomId,
    title: r.title ?? r.roomId,
    isLive: Boolean(r.isLive),
    viewerCount: Number.isFinite(r.viewerCount as number) ? (r.viewerCount as number) : 0,
    updatedAt: r.updatedAt,
    lastEventAt: r.lastEventAt,
  }));

  const activeRooms = rooms.reduce((n, r) => n + (r.isLive ? 1 : 0), 0);

  return new Response(
    JSON.stringify({
      ok: true,
      marker: "live-rooms",
      requestId,
      rooms,
      activeRooms,
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
