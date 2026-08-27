import { NextResponse } from "next/server";
import { globalPulseEvent } from "@/lib/pulse";

export const runtime = "edge";

export async function GET() {
  globalPulseEvent();

  return NextResponse.json({
    ok: true,
    source: "lumora_global_pulse_event_v1",
  });
}
