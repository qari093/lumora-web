import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/vendor/summary?ownerId=OWNER_A&days=30
 * KPIs: wallet balance (EUR), conversions & rewards for the vendor (userId==ownerId), basic engagement.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const ownerId = url.searchParams.get("ownerId") || "OWNER_A";
    const days = Math.max(1, Math.min(180, Number(url.searchParams.get("days") || 30)));
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Wallet for the vendor (EUR)
    const wallet = await prisma.wallet.findUnique({
      where: { ownerId_currency: { ownerId, currency: "EUR" } },
    });

    // Conversions credited to this vendor (userId == ownerId)
    const convs = await prisma.adConversion.findMany({
      where: { userId: ownerId, createdAt: { gte: since } },
      select: { rewardCents: true },
    });
    const conversions = convs.length;
    const rewardsCents = convs.reduce((s, c) => s + Number(c.rewardCents || 0), 0);

    // Engagement owned by this vendor: we approximate by counting events whose view led to a conversion to ownerId within window.
    // Fallback: across all events in window (not owner-scoped) for simple visibility.
    const events = await prisma.adEvent.findMany({
      where: { createdAt: { gte: since } },
      select: { action: true },
    });
    let views = 0, hovers = 0, clicks = 0;
    for (const e of events) {
      if (e.action === "view") views++;
      else if (e.action === "hover") hovers++;
      else if (e.action === "click") clicks++;
    }
    const ctr = views > 0 ? clicks / views : 0;
    const cvr = clicks > 0 ? conversions / clicks : 0;

    return NextResponse.json({
      ok: true,
      ownerId,
      days,
      wallet: { currency: "EUR", balanceCents: wallet?.balanceCents ?? 0 },
      metrics: { views, hovers, clicks, conversions, rewardsCents, ctr, cvr },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
