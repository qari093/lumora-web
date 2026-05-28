import { NextResponse } from "next/server";
import { lumoraRuntimePortals } from "@/lib/runtime/lumoraRuntimeSummary";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      ok: true,
      status: "mounted",
      portals: lumoraRuntimePortals,
      total: lumoraRuntimePortals.length,
      checkedAt: new Date().toISOString()
    },
    { headers: { "cache-control": "no-store" } }
  );
}
