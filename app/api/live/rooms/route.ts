import { NextResponse } from "next/server";
import { getLiveRooms } from "@/src/live/runtime/liveRooms";
import { rateLimitHeaders } from "@/src/lib/live/ratelimitHeaders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function createRequestId(): string {
  const random = Math.random().toString(16).slice(2, 10);
  return `req_${Date.now().toString(36)}_${random}`;
}

export function GET() {
  const requestId = createRequestId();
  const rooms = getLiveRooms();

  return NextResponse.json(
    {
      ok: true,
      service: "lumora-live",
      route: "/api/live/rooms",
      requestId,
      rooms,
      activeRooms: rooms.length,
      ts: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        ...rateLimitHeaders(),
        "x-request-id": requestId,
        "cache-control": "no-store",
      },
    },
  );
}
