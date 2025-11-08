import { NextResponse } from "next/server";

type RewardEvent = { ts: number; kind: string; ms?: number };

function score(ev: RewardEvent): number {
  switch ((ev.kind || "").toLowerCase()) {
    case "watch": return Math.min(5, Math.round((ev.ms || 0) / 60)); // up to 5
    case "like": return 1;
    case "share": return 2;
    case "comment": return 2;
    case "purchaseintent": return 3;
    default: return 1;
  }
}

export async function POST(req: Request){
  try{
    const body = await req.json().catch(()=> ({} as any));
    const list: RewardEvent[] = Array.isArray(body?.events) ? body.events : [];
    const safe = list.filter(e => typeof e === "object" && typeof e.ts === "number" && typeof e.kind === "string");
    const earned = Math.min(50, safe.reduce((sum, ev) => sum + score(ev), 0)); // soft cap 50 per sync
    // NOTE: Here you'd credit Zencoin/Pulse server-side via wallet/ledger.
    return NextResponse.json({ ok:true, accepted: safe.length, earned });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: String(e?.message || e) }, { status:400 });
  }
}
