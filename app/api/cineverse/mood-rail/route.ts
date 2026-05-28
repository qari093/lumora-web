import { NextResponse } from "next/server";
import { createMoodRail } from "@/lib/cineverse/moodRailEngine";

export async function GET() {
  return NextResponse.json({
    ok: true,
    rail: createMoodRail("midnight-cinema", 8)
  });
}
