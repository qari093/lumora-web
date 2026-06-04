import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      deprecated: true,
      error: {
        code: "ROUTE_DEPRECATED",
        message: "Use /api/live/rooms",
      },
      canonical: "/api/live/rooms",
      route: "/api/live/rooms/list",
      ts: Date.now(),
    },
    {
      status: 410,
      headers: {
        "x-lumora-deprecated-route": "/api/live/rooms/list",
        "x-lumora-canonical-route": "/api/live/rooms",
        "cache-control": "no-store",
      },
    },
  );
}
