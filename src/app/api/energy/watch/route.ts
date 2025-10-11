import { NextResponse } from "next/server";
import { bearerUid, limit } from "@/lib/security";
import { award } from "@/lib/energyStore";
import { addVideoEnergy } from "@/lib/videoEnergyStore";
import { addEnergyToCrewOf } from "@/lib/crewStore";

export async function POST(req: Request){
  try{
    const auth = await bearerUid(req.headers);
    if(!auth.ok) return NextResponse.json({ ok:false, error:auth.error }, { status:401 });
    const uid = auth.uid;
    const b = await req.json();
    const videoId = (b?.videoId || "").toString();
    let units = Math.max(0, Math.min(50, Number(b?.units || 0)));
    const focus = !!b?.focus;
    const visible = Number(b?.visible || 0); // 0..1

    if(!videoId || units<=0 || !Number.isFinite(units)) return NextResponse.json({ ok:false, error:"bad_request" }, { status:400 });

    // Quality factor: full credit only if focus & visibility≥0.6, else scale to 25–60%
    let q = 1;
    if(!(focus && visible >= 0.6)) q = Math.max(0.25, Math.min(0.6, (visible*0.8)));
    units = Math.max(0, Math.floor(units * q));
    if(units<=0) return NextResponse.json({ ok:false, limited:true }, { status:429 });

    let allowed = 0;
    for(let i=0;i<units;i++){ if(await limit(uid, "WATCH")) allowed++; }
    if(allowed===0) return NextResponse.json({ ok:false, limited:true }, { status:429 });

    let personal=0, pool=0;
    for(let i=0;i<allowed;i++){ const res = await award("WATCH", uid); personal += res.addedPersonal; pool += res.addedPool; }
    const vid = await addVideoEnergy(videoId, allowed);
    await addEnergyToCrewOf(uid, pool);

    return NextResponse.json({ ok:true, meDelta:personal, poolDelta:pool, video:vid });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e?.message || "error" }, { status:500 });
  }
}
