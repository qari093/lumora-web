import { NextResponse } from "next/server";
import { getLiveRooms } from "@/src/live/runtime/liveRooms";
import { rateLimitHeaders } from "@/src/lib/live/ratelimitHeaders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "lumora-live",
      route: "/api/live/rooms",
      rooms: getLiveRooms(),
    },
    {
      status: 200,
      headers: {
        ...rateLimitHeaders(),
        "cache-control": "no-store",
      },
    },
  );
}
