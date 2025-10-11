import { NextResponse } from "next/server";
import { track } from "@/lib/analyticsMem";
export async function POST(req: Request){
  const body = await req.json().catch(()=> ({}));
  const { type, props } = body || {};
  if(!type) return NextResponse.json({ ok:false, error:"type_required" }, { status:400 });
  track(String(type), props||{});
  return NextResponse.json({ ok:true });
}
