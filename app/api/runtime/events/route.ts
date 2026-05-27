import { NextResponse } from "next/server";
import { getRealtimeDashboardPayload } from "@/src/runtime/realtimeState";

export async function GET() {
  const payload = await getRealtimeDashboardPayload();

  return NextResponse.json({
    ok: true,
    ...payload,
  });
}
