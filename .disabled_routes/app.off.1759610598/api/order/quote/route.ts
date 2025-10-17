import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function POST(req:Request){
  const b = await req.json().catch(()=>({}));
  const qty = Math.max(1, Math.min(99, Number(b.qty||1)));
  const price = Number(b.price||0);
  return NextResponse.json({ ok:true, total: +(qty*price).toFixed(2) });
}
