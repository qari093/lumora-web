export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { transferEuros } from "../../../../lib/wallet";

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(()=>({}));
    const fromOwnerId = String(b?.fromOwnerId || "");
    const toOwnerId = String(b?.toOwnerId || "");
    const euros = Number(b?.euros || 0);
    if (!fromOwnerId || !toOwnerId) return NextResponse.json({ ok:false, error:"fromOwnerId & toOwnerId required" }, { status:400 });
    if (!(euros>0)) return NextResponse.json({ ok:false, error:"euros must be > 0" }, { status:400 });
    const cents = Math.round(euros * 100);
    const r = await transferEuros(fromOwnerId, toOwnerId, cents, b?.note || "transfer");
    return NextResponse.json({ ok:true, transfer:r.transfer }, { status:201 });
  } catch (e: any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
