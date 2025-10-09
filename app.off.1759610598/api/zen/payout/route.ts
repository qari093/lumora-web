import { NextResponse } from "next/server";
import { appendTx, balance } from "../../../../lib/zen/store";
export const runtime = "nodejs";
// Minimal payout API: expects { id, winners:[{device,amount,opId?}] }
export async function POST(req: Request){
  try{
    const b = await req.json(); const id = String(b.id||"season1");
    const winners = Array.isArray(b.winners)? b.winners : [];
    const results:any[] = [];
    for(const w of winners){
      const device = String(w.device||""); const amount = Number(w.amount||0); const opId = w.opId ? String(w.opId) : `payout:${id}:${device}`;
      if(!device || amount<=0){ results.push({ ok:false, device, error:"bad_winner" }); continue; }
      appendTx({ id:"tx_"+Math.random().toString(36).slice(2,10), at: Date.now(), device, action:"earn", amount, reason:"payout_"+id, opId });
      results.push({ ok:true, device, balance: balance(device) });
    }
    return NextResponse.json({ ok:true, results });
  }catch(e:any){ return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:400 }); }
}
