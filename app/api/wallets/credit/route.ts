export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { ledgerEntry } from "../../../../lib/wallet";

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(()=>({}));
    const ownerId = String(b?.ownerId || "");
    const euros = Number(b?.euros || 0);
    if (!ownerId) return NextResponse.json({ ok:false, error:"ownerId required" }, { status:400 });
    if (!(euros>0)) return NextResponse.json({ ok:false, error:"euros must be > 0" }, { status:400 });
    const cents = Math.round(euros * 100);
    const r = await ledgerEntry({ ownerId, type:"CREDIT", amountCents:cents, note:b?.note || "manual credit" });
    return NextResponse.json({ ok:true, wallet:r.wallet, ledger:r.ledger }, { status:201 });
  } catch (e: any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
