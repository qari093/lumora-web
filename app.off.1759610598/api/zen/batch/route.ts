import { NextResponse } from "next/server";
import { appendTx, readLedger, balance } from "../../../../lib/zen/store";
export const runtime = "nodejs";
function getDevice(h: Headers){ const d=h.get("x-device-id"); if(d) return d; const xf=h.get("x-forwarded-for")||"127.0.0.1"; return "dev-"+xf.split(",")[0].trim(); }
export async function POST(req: Request){
  try{
    const h=new Headers(req.headers); const device=getDevice(h);
    const b=await req.json(); const ops = Array.isArray(b?.ops) ? b.ops : []; const existing=readLedger(device);
    const results:any[] = [];
    for(const op of ops){
      const action=String(op.action||""); const amount=Number(op.amount||0); const reason=String(op.reason||""); const opId=op.opId?String(op.opId):undefined;
      if(!["earn","spend","refund"].includes(action) || amount<=0){ results.push({ ok:false, error:"bad_op" }); continue; }
      if(opId && existing.some((x:any)=>x.opId===opId)){ results.push({ ok:true, duplicate:true }); continue; }
      appendTx({ id:"tx_"+Math.random().toString(36).slice(2,10), at: Date.now(), device, action, amount, reason, opId });
      results.push({ ok:true, balance: balance(device) });
    }
    return NextResponse.json({ ok:true, device, balance: balance(device), results });
  }catch(e:any){ return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:400 }); }
}
