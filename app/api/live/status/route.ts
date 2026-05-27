import { NextResponse } from "next/server";
import { getLivePortalConfig } from "@/src/live/activation/livePortalConfig";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "lumora-live",
    route: "/api/live/status",
    live: getLivePortalConfig(),
  });
}
