import { NextRequest, NextResponse } from "next/server";
import { enforceVideoGenDailyCap } from "@/app/_server/videoGenCap";

export async function POST(req: NextRequest) {
  const cap = await enforceVideoGenDailyCap(req);
  if (!cap.ok) {
    return NextResponse.json(
      { ok: false, error: "video_gen_daily_cap_reached", cap: cap.cap, day: cap.day },
      { status: 429, headers: { "Retry-After": String(cap.retryAfterSec) } },
    );
  }
  return NextResponse.json({ ok: true, remaining: cap.remaining, cap: cap.cap, day: cap.day }, { status: 200 });
}
