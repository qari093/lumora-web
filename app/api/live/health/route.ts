import { NextResponse } from "next/server";
import { getLiveHealth } from "@/lib/live/runtime";

export async function GET() {
  return NextResponse.json(getLiveHealth(), {
    headers: { "X-Lumora-Live": "1" },
  });
}
