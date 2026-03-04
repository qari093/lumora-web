import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/ads/analytics/rollup/run?days=7
 * Computes daily rollups from existing AdEvent, AdConversion, CpvView and upserts into AdMetricDaily.
 */
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const days = Math.max(1, Math.min(90, Number(url.searchParams.get("days") || 7)));

    // Generate list of days [0..days-1], 0 = today
    const dayStarts: Date[] = [];
    const startOfDay = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const today = startOfDay(new Date());
    for (let i = 0; i < days; i++) {
      const t = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      dayStarts.push(t);
    }

    let upserts = 0;

    for (const day of dayStarts) {
      const next = new Date(day.getTime() + 24 * 60 * 60 * 1000);

      // Events grouped by campaign & action
      const evs = await prisma.adEvent.findMany({
        where: { createdAt: { gte: day, lt: next } },
        select: { action: true, campaignId: true },
      });

      const eventAgg: Record<string, { views: number; hovers: number; clicks: number }> = {};
      for (const e of evs) {
        const key = String(e.campaignId || "ALL");
        if (!eventAgg[key]) eventAgg[key] = { views: 0, hovers: 0, clicks: 0 };
        if (e.action === "view") eventAgg[key].views++;
        else if (e.action === "hover") eventAgg[key].hovers++;
        else if (e.action === "click") eventAgg[key].clicks++;
      }

      // Conversions grouped by campaign
      const convs = await prisma.adConversion.findMany({
        where: { createdAt: { gte: day, lt: next } },
        select: { campaignId: true, rewardCents: true },
      });
      const convAgg: Record<string, { conversions: number; rewardsCents: number }> = {};
      for (const c of convs) {
        const key = String(c.campaignId || "ALL");
        if (!convAgg[key]) convAgg[key] = { conversions: 0, rewardsCents: 0 };
        convAgg[key].conversions++;
        convAgg[key].rewardsCents += Number(c.rewardCents || 0);
      }

      // Spend grouped by campaign (CpvView)
      const vws = await prisma.cpvView.findMany({
        where: { createdAt: { gte: day, lt: next } },
        select: { campaignId: true, costCents: true },
      });
      const spendAgg: Record<string, number> = {};
      for (const v of vws) {
        const key = String(v.campaignId || "ALL");
        spendAgg[key] = (spendAgg[key] ?? 0) + Number(v.costCents || 0);
      }

      // Merge keys (campaigns) and upsert
      const keys = new Set<string>([
        ...Object.keys(eventAgg),
        ...Object.keys(convAgg),
        ...Object.keys(spendAgg),
      ]);

      for (const key of keys) {
        const e = eventAgg[key] || { views: 0, hovers: 0, clicks: 0 };
        const c = convAgg[key] || { conversions: 0, rewardsCents: 0 };
        const s = spendAgg[key] ?? 0;

        await prisma.adMetricDaily.upsert({
          where: { id: `${key}_${day.toISOString()}` },
          update: {
            day,
            campaignId: key === "ALL" ? null : key,
            views: e.views,
            hovers: e.hovers,
            clicks: e.clicks,
            conversions: c.conversions,
            spendCents: s,
            rewardsCents: c.rewardsCents,
          },
          create: {
            id: `${key}_${day.toISOString()}`,
            day,
            campaignId: key === "ALL" ? null : key,
            views: e.views,
            hovers: e.hovers,
            clicks: e.clicks,
            conversions: c.conversions,
            spendCents: s,
            rewardsCents: c.rewardsCents,
          },
        });
        upserts++;
      }
    }

    return NextResponse.json({ ok: true, days, upserts });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
