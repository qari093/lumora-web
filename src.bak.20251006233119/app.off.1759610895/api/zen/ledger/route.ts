export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { getLedger } from "../../../../lib/zenStore";

export async function GET(req: NextRequest){
  try{
    const device = req.headers.get("x-device-id") || "dev1";
    const l = getLedger(device);
    return Response.json({ ok:true, device, balance:l.balance, history:l.history });
  }catch(e:any){
    return Response.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
