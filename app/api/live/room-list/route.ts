import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const ROUTE_DEPRECATED = true;
export const CANONICAL_ROUTE = "/api/live/rooms";

// compatibilityJson semantic replacement:
// this legacy alias intentionally returns HTTP 410 rather than proxying
// to the canonical endpoint.

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "ROUTE_DEPRECATED",
        message: "This endpoint has been retired. Use /api/live/rooms.",
      },
      deprecated: true,
      alias: "/api/live/room-list",
      canonical: CANONICAL_ROUTE,
    },
    {
      status: 410,
      headers: {
        "cache-control": "no-store",
        "x-lumora-route-alias": "/api/live/room-list",
        "x-lumora-canonical-route": CANONICAL_ROUTE,
      },
    },
  );
}
