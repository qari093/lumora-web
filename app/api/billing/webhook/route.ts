import { NextRequest, NextResponse } from "next/server";
import { reqId } from "@/src/lib/reqid";
import { credit } from "@/src/lib/wallet/mem";

// Next: raw body not strictly required here because we dont parse JSON when verifying; we get text()
export async function POST(req: NextRequest) {
  const id = reqId();
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SK;
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WHSEC;

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ ok:false, disabled:true, reason:"STRIPE_NOT_CONFIGURED", requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }

  let Stripe: any;
  try {
    ({ default: Stripe } = await import("stripe"));
  } catch {
    return NextResponse.json({ ok:false, error:"STRIPE_SDK_MISSING", message:"Install stripe: npm i stripe", requestId:id }, { status:200, headers:{ "x-request-id": id } });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

  const sig = req.headers.get("stripe-signature") || "";
  const text = await req.text();

  let evt: any;
  try {
    evt = stripe.webhooks.constructEvent(text, sig, STRIPE_WEBHOOK_SECRET);
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:"BAD_SIGNATURE", message:String(e?.message||e), requestId:id }, { status:400, headers:{ "x-request-id": id } });
  }

  try {
    if (evt.type === "checkout.session.completed" || evt.type === "payment_intent.succeeded") {
      // In both cases we aim to read ownerId & euros from metadata on the session or payment
      const obj = evt.data.object || {};
      const metadata = obj.metadata || {};
      const ownerId = metadata.ownerId || "";
      const eurosStr = metadata.euros || "";
      const euros = parseFloat(eurosStr);

      if (ownerId && isFinite(euros) && euros > 0) {
        const res = credit(ownerId, euros, "stripe:checkout", id);
        return NextResponse.json({ ok:true, credited:true, wallet:res.wallet, requestId:id }, { status:200, headers:{ "x-request-id": id } });
      }
    }
    return NextResponse.json({ ok:true, credited:false, requestId:id }, { status:200, headers:{ "x-request-id": id } });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:"WEBHOOK_HANDLER_ERROR", message:String(e?.message||e), requestId:id }, { status:500, headers:{ "x-request-id": id } });
  }
}
export const dynamic = "force-dynamic";
