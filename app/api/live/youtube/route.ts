import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "live",
      provider: "youtube",
      mode: "safe_stub",
      route: "/api/live/youtube",
      status: "guarded",
      items: []
    },
    {
      status: 200,
      headers: {
        "cache-control": "no-store"
      }
    }
  );
}
