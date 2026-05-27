import { NextResponse } from "next/server";
import { getFyp94ProductionHealth } from "@/src/lib/fyp94/production2/monitor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const health = getFyp94ProductionHealth();

  return NextResponse.json(health, {
    status: health.ok ? 200 : 503,
    headers: {
      "cache-control": "no-store, no-cache, must-revalidate",
      pragma: "no-cache",
      expires: "0",
    },
  });
}
