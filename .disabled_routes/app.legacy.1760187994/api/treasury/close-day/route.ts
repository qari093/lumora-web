import { NextRequest, NextResponse } from "next/server";
import { closeDay } from "../../../../lib/econ/harmony";

export async function POST(req:NextRequest){
  const body = await req.json().catch(()=>({}));
  const adPulses = Math.max(0, body?.adPulses ?? 0);
  const r = await closeDay({ adPulses });
  return NextResponse.json(r);
}
