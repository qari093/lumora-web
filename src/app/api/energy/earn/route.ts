import { NextResponse } from "next/server";
import { bearerUid, limit } from "@/lib/security";
import { award, EarnType } from "@/lib/energyStore";
import { addVideoEnergy } from "@/lib/videoEnergyStore";
import { addEnergyToCrewOf } from "@/lib/crewStore";

const MAP: Record<Exclude<EarnType,"WATCH">, number> = {
  LIKE: 2, COMMENT: 1, SHARE: 4
};

export async function PATCH(req: Request){
  try{
    const v = bearerUid();
    if(!v.ok) return NextResponse.json({ ok:false, error:v.error }, { status:401 });
    const uid = v.uid;
    const b = await req.json();
    const type = b?.type as EarnType | undefined;
    const videoId = (b?.videoId || "").toString() || undefined;
    if(!type || type==="WATCH") return NextResponse.json({ ok:false, error:"bad_request" }, { status:400 });

    if(!limit(uid, type)) return NextResponse.json({ ok:false, limited:true }, { status:429 });

    const res = award(type, uid);
    if(videoId){ addVideoEnergy(videoId, MAP[type]); }
    const crew = addEnergyToCrewOf(uid, res.addedPool);

    return NextResponse.json({ ok:true, me:res.wallet, pool:{ energy:res.pool.energy }, crew });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e?.message || "error" }, { status:500 });
  }
}
