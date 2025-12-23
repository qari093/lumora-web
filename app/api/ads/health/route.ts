import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    {
      ok: true,
      service: "lumora",
      system: "ads",
      route: "/api/ads/health",
      ts: new Date().toISOString(), // contract expects string for ads health
    },
    { status: 200, headers: { "cache-control": "no-store" } }
  );
}
