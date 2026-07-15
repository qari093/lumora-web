import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const ROUTE_DEPRECATED = true;
export const CANONICAL_ROUTE = "/api/live/rooms";

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      error: "ROUTE_DEPRECATED",
      deprecated: true,
      alias: "/api/live/rooms/public",
      canonical: CANONICAL_ROUTE,
      message: "This endpoint has been retired. Use /api/live/rooms."
    },
    {
      status: 410,
      headers: {
        "x-lumora-route-alias": "/api/live/rooms/public",
        "x-lumora-canonical-route": "/api/live/rooms",
        "cache-control": "no-store"
      }
    }
  );
}
