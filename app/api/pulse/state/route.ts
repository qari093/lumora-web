import { NextRequest, NextResponse } from "next/server";
import { getPulseState } from "@/lib/pulse";
export const runtime = "edge";
export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams.get("userId") || "demo-user-1";
  const s = getPulseState(u);
  return NextResponse.json({ ok:true, state:s });
}
