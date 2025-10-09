import { NextResponse } from "next/server";
import { appendTx, readLedger, balance } from "../../../../lib/zen/store";
export const runtime = "nodejs";
function getDevice(h: Headers){ const d=h.get("x-device-id"); if(d) return d; const xf=h.get("x-forwarded-for")||"127.0.0.1"; return "dev-"+xf.split(",")[0].trim(); }
export async function POST(req: Request){
  const h=new Headers(req.headers); const device=getDevice(h); const today=new Date().toISOString().slice(0,10); const opId="bonus:"+today;
  const hist = readLedger(device); if(hist.some((x:any)=>x.opId===opId)){ return NextResponse.json({ ok:true, device, balance: balance(device), duplicate:true }); }
  appendTx({ id:"tx_"+Math.random().toString(36).slice(2,10), at: Date.now(), device, action:"earn", amount:5, reason:"daily_bonus", opId });
  return NextResponse.json({ ok:true, device, balance: balance(device) });
}
