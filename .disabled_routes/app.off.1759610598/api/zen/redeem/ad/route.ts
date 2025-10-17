import { NextResponse } from "next/server";
import { getDevice, adRedeem } from "../../../../../lib/zen/core";

export async function POST(req:Request){
  try{
    const device = await getDevice(req);
    const b = await req.json();
    const adId = String(b.adId||"ad_demo_1");
    const kind = (String(b.kind||"view")==="click" ? "click" : "view") as "view"|"click";
    const r = await adRedeem(device, adId, kind);
    return NextResponse.json({ ok:true, amount:1, balance:r.balance, counts:r.counts, total:r.total });
  }catch(e:any){
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:400 });
  }
}
