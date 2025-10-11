import { NextResponse } from "next/server";
import { addVideoEnergy, getVideoEnergy } from "@/lib/videoEnergyStore";

export async function POST(req: Request){
  try{
    const b = await req.json();
    const id = (b?.videoId || "").toString();
    const add = Number(b?.add || 0);
    if(!id || !Number.isFinite(add)) return NextResponse.json({ ok:false, error:"bad_request" }, { status:400 });
    const s = addVideoEnergy(id, add);
    return NextResponse.json({ ok:true, stat: s });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e?.message || "error" }, { status:500 });
  }
}

export async function GET(req: Request){
  const url = new URL(req.url);
  const id = (url.searchParams.get("id") || "").toString();
  if(!id) return NextResponse.json({ ok:false, error:"bad_request" }, { status:400 });
  const s = getVideoEnergy(id);
  return NextResponse.json({ ok:true, stat: s });
}
