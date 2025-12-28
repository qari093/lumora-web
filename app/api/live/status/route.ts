import { withSafeLive } from "@/lib/live/withSafeLive";
import { NextResponse } from "next/server";
import { listActiveRooms } from "../_store";

export const runtime = "nodejs";

export async function GET() {
  return withSafeLive(async () => {
  const active = await listActiveRooms();
  return NextResponse.json(
    {
      liveOn: active.length > 0,
      activeRooms: active.length,
      ts: new Date().toISOString(),
    },
    { status: 200 }
  );
}
