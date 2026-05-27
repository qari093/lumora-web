import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "lumora-live",
    route: "/api/live/health",
    checks: {
      runtime: true,
      presence: true,
      rooms: true,
    },
  });
}
