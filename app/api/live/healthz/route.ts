import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "live",
      route: "/api/live/healthz",
      status: "healthy",
      checkedAt: new Date().toISOString()
    },
    {
      status: 200,
      headers: {
        "cache-control": "no-store"
      }
    }
  );
}
