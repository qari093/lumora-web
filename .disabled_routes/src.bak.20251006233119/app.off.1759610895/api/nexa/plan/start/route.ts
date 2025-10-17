export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { startPlan, today } from "../../../../../lib/nexaStore";

export async function POST(req: NextRequest){
  const device = req.headers.get("x-device-id") || "dev1";
  const body = await req.json().catch(()=>({}));
  const planId = String(body?.planId||"").trim();
  if(!planId) return Response.json({ ok:false, error:"planId درکار ہے" }, { status:400 });
  try{
    startPlan(device, planId);
    const t = today(device);
    return Response.json({ ok:true, ...t });
  }catch(e:any){
    return Response.json({ ok:false, error:String(e?.message||e) }, { status:400 });
  }
}
