import { NextResponse } from "next/server";
import { createAutoMemoryReel } from "@/lib/gmar/autoMemoryReel";

export async function GET() {
  return NextResponse.json({
    ok: true,
    reel: createAutoMemoryReel("player-1")
  });
}
