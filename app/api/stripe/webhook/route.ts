import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ ok: false, error: "missing_signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const record = await prisma.stripeCheckoutSession.findUnique({
      where: { stripeSession: session.id },
    });

    if (record && record.status !== "fulfilled") {
      await prisma.$transaction([
        prisma.wallet.update({
          where: { userId: record.userId },
          data: { credits: { increment: record.credits } },
        }),
        prisma.stripeCheckoutSession.update({
          where: { id: record.id },
          data: { status: "fulfilled", fulfilledAt: new Date() },
        }),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}
