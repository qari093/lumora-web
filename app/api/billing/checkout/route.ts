import { NextRequest, NextResponse } from "next/server";
import { reqId } from "@/src/lib/reqid";

export async function POST(req: NextRequest) {
  const id = reqId();
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SK;
  const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

  let body:any = {};
  try { body = await req.json(); } catch {}

  const ownerId = typeof body?.ownerId === "string" ? body.ownerId : "";
  const euros = typeof body?.euros === "number" ? body.euros : NaN;
  const note = typeof body?.note === "string" ? body.note : "";

  if (!ownerId || !isFinite(euros) || euros <= 0) {
    return NextResponse.json({ ok:false, error:"BAD_REQUEST", need:["ownerId","euros>0"], requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }

  // If Stripe not configured, return a clean JSON error (no crashes)
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json({
      ok:false,
      error:"STRIPE_NOT_CONFIGURED",
      message:"Set STRIPE_SECRET_KEY and (optionally) SITE_URL to enable checkout.",
      exampleEnv:["STRIPE_SECRET_KEY=sk_test_xxx","SITE_URL=https://your-domain"],
      requestId:id
    }, { status:200, headers:{ "x-request-id": id } });
  }

  // Lazy import stripe only when configured
  let Stripe: any;
  try {
    ({ default: Stripe } = await import("stripe"));
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:"STRIPE_SDK_MISSING", message:"Install stripe: npm i stripe", requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
    const amount = Math.round(euros * 100); // cents
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${SITE_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/billing/cancel`,
      line_items: [{
        price_data: { currency: "eur", product_data: { name: `Lumora Credits – €${euros.toFixed(2)}` }, unit_amount: amount },
        quantity: 1
      }],
      metadata: { ownerId, euros: euros.toString(), note }
    });
    return NextResponse.json({ ok:true, url: session.url, id: session.id, requestId:id }, { status:200, headers:{ "x-request-id": id } });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:"STRIPE_ERROR", message:String(e?.message||e), requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }
}
export const dynamic = "force-dynamic";
