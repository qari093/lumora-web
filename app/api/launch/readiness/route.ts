import { NextResponse } from "next/server";
import { getLaunchReadiness } from "@/lib/launch/getLaunchReadiness";

export async function GET() {
  try {
    const readiness = getLaunchReadiness();
    return NextResponse.json({ ok: true, source: "lumora_launch_readiness_v1", readiness });
  } catch {
    return NextResponse.json(
      { ok: false, error: "launch_readiness_failed" },
      { status: 500 }
    );
  }
}
