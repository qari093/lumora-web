import { NextResponse } from "next/server";
import { rateLimitHeaders } from "@/src/lib/live/ratelimitHeaders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const ROUTE_DEPRECATED = true;
export const CANONICAL_ROUTE = "/api/live/rooms";

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "ROUTE_DEPRECATED",
        message: "This endpoint has been retired. Use /api/live/rooms.",
      },
      deprecated: true,
      alias: "/api/live/rooms/public",
      canonical: CANONICAL_ROUTE,
    },
    {
      status: 410,
      headers: {
        ...rateLimitHeaders(),
        "x-lumora-route-alias": "/api/live/rooms/public",
        "x-lumora-canonical-route": CANONICAL_ROUTE,
        "cache-control": "no-store",
      },
    },
  );
}
