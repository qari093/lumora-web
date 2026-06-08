import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "live",
      provider: "reddit",
      mode: "safe_stub",
      route: "/api/live/reddit",
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
