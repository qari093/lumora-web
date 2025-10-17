import { NextResponse } from "next/server";
import { globalPulseEvent } from "@/lib/pulse";
export const runtime = "edge";
export async function GET(){
  return NextResponse.json({ ok:true, ...globalPulseEvent() });
}
