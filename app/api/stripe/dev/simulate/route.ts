import { NextResponse } from "next/server";
import { creditWalletOnce } from "@/lib/walletLedger";
import { prisma } from "@/lib/prisma";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  try {
    if (process.env.NODE_ENV === "production") {
      return json(404, { ok: false, error: "not_found" });
    }

    const raw = (await req.json().catch(() => null)) as
      | { userId?: string; credits?: number; stripeSession?: string }
      | null;

    const userId = String(raw?.userId || "").trim();
    const credits = Number(raw?.credits ?? 0);
    const stripeSession = String(raw?.stripeSession || "").trim();

    if (!userId) return json(400, { ok: false, error: "userId_required" });
    if (!Number.isFinite(credits) || credits <= 0) return json(400, { ok: false, error: "credits_invalid" });
    if (!stripeSession) return json(400, { ok: false, error: "stripeSession_required" });

    // Mark paid first (best-effort)
    await prisma.stripeCheckoutSession
      .update({ where: { stripeSession }, data: { status: "paid" } })
      .catch(() => null);

    const applied = await creditWalletOnce({
      userId,
      amount: Math.trunc(credits),
      source: "stripe",
      refId: stripeSession,
    });

    if (!applied.ok) return json(500, { ok: false, error: applied.error });

    if (!applied.alreadyApplied) {
      await prisma.stripeCheckoutSession
        .update({ where: { stripeSession }, data: { status: "fulfilled" } })
        .catch(() => null);
    }

    return json(200, { ok: true, applied: applied.alreadyApplied ? "already" : "credited" });
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return json(500, { ok: false, error: msg, ts: Date.now() });
  }
}
