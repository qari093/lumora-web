import { NextRequest, NextResponse } from "next/server";
import { deviceFromHeaders, loadStore, saveStore, trackEvent } from "@/lib/ads/core";

async function zenEarn(device:string, amount:number, opId:string){
  try{
    const r = await fetch("http://127.0.0.1:3010/api/zen/ledger", {
      method:"POST",
      headers:{ "Content-Type":"application/json", "x-device-id": device },
      body: JSON.stringify({ action:"earn", amount, reason:"ad_reward", opId })
    });
    return await r.json();
  }catch(e){ return { ok:false, error:String(e) }; }
}

export async function POST(req:NextRequest){
  try{
    const device = deviceFromHeaders(req.headers);
    const { impressionId, event } = await req.json() as { impressionId:string; event: "click"|"skip"|"reward"|"hold" };
    if(!impressionId || !event) return NextResponse.json({ ok:false, error:"bad_input" }, { status:400 });
    const s = loadStore();
    const r = trackEvent(s, impressionId, event);
    saveStore(s);
    if(!r.ok) return NextResponse.json({ ok:false, error:r.error }, { status:404 });

    // If "reward", optionally send +1 Zen (idempotent via opId)
    if(event==="reward"){
      const opId = `ad:${impressionId}:reward`;
      const j = await zenEarn(device, 1, opId);
      return NextResponse.json({ ok:true, impression: r.impression, zen: j });
    }
    return NextResponse.json({ ok:true, impression: r.impression });
  }catch(e){
    return NextResponse.json({ ok:false, error:String(e) }, { status:500 });
  }
}
