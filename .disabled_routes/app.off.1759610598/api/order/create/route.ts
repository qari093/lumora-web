import { NextResponse } from "next/server";
import { createOrder } from "../../../../lib/orders";
export const runtime = "nodejs";
export async function POST(req:Request){
  const b = await req.json().catch(()=>({}));
  const qty = Math.max(1, Math.min(99, Number(b.qty||1)));
  const order = await createOrder({ productId: b.productId, title: b.title||"NEXA Product", price: Number(b.price||0), qty });
  return NextResponse.json({ ok:true, order });
}
