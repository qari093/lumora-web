import { NextResponse } from "next/server";
import { createDailyDrop } from "@/lib/daily-drop/dailyDropEngine";

export async function GET() {
  return NextResponse.json({
    ok: true,
    drop: createDailyDrop()
  });
}
