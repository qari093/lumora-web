import { NextRequest, NextResponse } from "next/server";
import { applyPulseAction } from "@/lib/pulse";
export const runtime = "edge";
export async function POST(req: NextRequest){
  const b = await req.json().catch(()=>({}));
  const u = b.userId || "demo-user-1";
  const k = b.kind || "watch";
  const s = applyPulseAction(u, k);
  return NextResponse.json({ ok:true, state:s });
}
