import { NextRequest, NextResponse } from "next/server";
import { trackEvent } from "@/lib/ads/store";

export async function POST(req: NextRequest){
  try{
    const j = await req.json();
    const { impressionId, event } = j || {};
    if(!impressionId || !event) return NextResponse.json({ ok:false, error:"missing_fields" }, { status:400 });
    const r = trackEvent(String(impressionId), String(event));
    return NextResponse.json({ ok:true, ...r });
  }catch(e:any){
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:400 });
  }
}
