import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/ads/analytics/summary?minutes=60&campaignId=TEST_CAMPAIGN_1
 * KPIs over the last N minutes:
 * - views/hovers/clicks (AdEvent)
 * - conversions + rewardsCents (AdConversion)
 * - spendCents from CpvView (approx by createdAt window)
 * - CTR (clicks/views), CVR (conversions/clicks)
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const minutesRaw = Number(url.searchParams.get("minutes") || 60);
    const minutes = Math.max(1, Math.min(24 * 60, isNaN(minutesRaw) ? 60 : minutesRaw));
    const campaignId = url.searchParams.get("campaignId") || undefined;
    const since = new Date(Date.now() - minutes * 60_000);

    // Actions (views/hovers/clicks) from AdEvent
    const events = await prisma.adEvent.groupBy({
      by: ["action"],
      where: {
        createdAt: { gte: since },
        ...(campaignId ? { campaignId } : {}),
      },
      _count: { _all: true },
    });

    const k = { views: 0, hovers: 0, clicks: 0 };
    for (const r of events) {
      const c = Number(r._count._all || 0);
      if (r.action === "view") k.views += c;
      else if (r.action === "hover") k.hovers += c;
      else if (r.action === "click") k.clicks += c;
    }

    // Conversions + rewards
    const convs = await prisma.adConversion.findMany({
      where: {
        createdAt: { gte: since },
        ...(campaignId ? { campaignId } : {}),
      },
      select: { rewardCents: true },
    });
    const conversions = convs.length;
    const rewardsCents = convs.reduce((sum, x) => sum + (x.rewardCents ?? 0), 0);

    // Spend from CpvView (costCents)
    const views = await prisma.cpvView.findMany({
      where: {
        createdAt: { gte: since },
        ...(campaignId ? { campaignId } : {}),
      },
      select: { costCents: true },
    });
    const spendCents = views.reduce((sum, v) => sum + (v.costCents ?? 0), 0);

    const ctr = k.views > 0 ? k.clicks / k.views : 0;
    const cvr = k.clicks > 0 ? conversions / k.clicks : 0;

    return NextResponse.json({
      ok: true,
      windowMinutes: minutes,
      campaignId: campaignId || null,
      metrics: {
        views: k.views,
        hovers: k.hovers,
        clicks: k.clicks,
        conversions,
        spendCents,
        rewardsCents,
        ctr,
        cvr,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
