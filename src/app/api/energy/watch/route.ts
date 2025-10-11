import { NextResponse } from "next/server";
import { bearerUid, limit } from "@/lib/security";
import { award } from "@/lib/energyStore";
import { addVideoEnergy, getVideoEnergy } from "@/lib/videoEnergyStore";

export async function POST(req: Request){
  try{
    const v = bearerUid();
    if(!v.ok) return NextResponse.json({ ok:false, error:v.error }, { status:401 });
    const uid = v.uid;
    const body = await req.json();
    const videoId = (body?.videoId || "").toString();
    const units = Math.max(0, Math.min(50, Number(body?.units || 0))); // clamp burst
    if(!videoId || !Number.isFinite(units) || units<=0) return NextResponse.json({ ok:false, error:"bad_request" }, { status:400 });

    // Rate limit WATCH per unit
    let allowed = 0;
    for(let i=0;i<units;i++){ if(limit(uid, "WATCH")) allowed++; }
    if(allowed===0) return NextResponse.json({ ok:false, limited:true }, { status:429 });

    // Convert each allowed unit to award + video energy
    let personal = 0, pool=0;
    for(let i=0;i<allowed;i++){
      const res = award("WATCH", uid);
      personal += res.addedPersonal; pool += res.addedPool;
    }
    const stat = addVideoEnergy(videoId, allowed);

    return NextResponse.json({ ok:true, meDelta:personal, poolDelta:pool, video:stat });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e?.message || "error" }, { status:500 });
  }
}
