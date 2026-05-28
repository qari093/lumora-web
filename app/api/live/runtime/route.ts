import { NextResponse } from "next/server";
import { evaluateLiveSafety } from "@/lib/live/liveSafety";

export async function GET() {
  return NextResponse.json({
    ok: true,
    liveRuntime: "active",
    safety: evaluateLiveSafety(0.42)
  });
}
