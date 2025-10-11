import { NextResponse } from "next/server";
import { bearerUid, limit } from "@/lib/security";
import { snapshotMe } from "@/lib/energyStore";
import { getRedis } from "@/lib/redis";
import { addVideoEnergy } from "@/lib/videoEnergyStore";
import { addEnergyToCrewOf } from "@/lib/crewStore";

export async function POST(req: Request){
  try{
    const auth = await bearerUid(req.headers);
    if(!auth.ok) return NextResponse.json({ ok:false, error:auth.error }, { status:401 });
    const uid = auth.uid;
    if(!await limit(uid, "COMMENT")) return NextResponse.json({ ok:false, limited:true }, { status:429 }); // reuse COMMENT budget (gentle)
    const b = await req.json();
    const videoId = (b?.videoId || "").toString();
    if(!videoId) return NextResponse.json({ ok:false, error:"bad_request" }, { status:400 });

    // Personal balance check (Redis or memory snapshot)
    const me = await snapshotMe(uid);
    if((me.wallet.energy||0) <= 0) return NextResponse.json({ ok:false, error:"insufficient_energy" }, { status:400 });

    // Atomically decrement user energy (Redis path); memory fallback: soft accept
    const r = getRedis();
    let ok = true;
    if(r){
      const key = `user:${uid}:energy`;
      const after = await r.decrby(key, 1);
      if(after < 0){ await r.incrby(key, 1); ok = false; }
    }
    if(!ok) return NextResponse.json({ ok:false, error:"insufficient_energy" }, { status:400 });

    // Credit video energy + small crew echo (+0 for team; assist is peer-to-peer)
    const vid = await addVideoEnergy(videoId, 1, uid.slice(0,4).toUpperCase());
    await addEnergyToCrewOf(uid, 1);

    return NextResponse.json({ ok:true, video: vid });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e?.message || "error" }, { status:500 });
  }
}
