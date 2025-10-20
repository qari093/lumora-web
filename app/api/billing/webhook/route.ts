import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  try {
    if (!stripe) return NextResponse.json({ ok:false, error:"NO_STRIPE_KEY" }, { status: 501 });
    const sig = (req.headers.get("stripe-signature") || "").toString();
    if (!sig) return NextResponse.json({ ok:false, error:"INVALID_SIGNATURE", message:"Missing header" }, { status: 400 });
    const buf = Buffer.from(await req.arrayBuffer());
    const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
    if (!secret) return NextResponse.json({ ok:false, error:"NO_WEBHOOK_SECRET" }, { status: 501 });
    let event;
    try { event = (stripe as any).webhooks.constructEvent(buf, sig, secret); }
    catch(e:any){ return NextResponse.json({ ok:false, error:"SIGNATURE_VERIFY_FAILED", message:e?.message }, { status: 400 }); }
    return NextResponse.json({ ok:true, received:true, type:event.type });
  } catch (err:any) {
    console.error("[stripe:webhook] error:", err?.message || err);
    return NextResponse.json({ ok:false, error:"HANDLER_ERROR" }, { status: 500 });
  }
}
