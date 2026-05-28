import { NextResponse } from "next/server";
import { createWorldPulse } from "@/lib/world-pulse/worldPulse";

export async function GET() {
  return NextResponse.json({
    ok: true,
    pulse: createWorldPulse()
  });
}
