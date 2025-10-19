import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/ads/analytics/timeseries?bucket=minute&points=30&campaignId=...
 * Returns an array of { t, views, hovers, clicks, conversions, spendCents, rewardsCents }
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const bucket = (url.searchParams.get("bucket") || "minute").toLowerCase(); // "minute" | "hour"
    const points = Math.max(1, Math.min(500, Number(url.searchParams.get("points") || 30)));
    const campaignId = url.searchParams.get("campaignId") || undefined;

    const now = new Date();
    const stepMs = bucket === "hour" ? 60 * 60 * 1000 : 60 * 1000;
    const start = new Date(now.getTime() - points * stepMs);

    // Fetch once per collection within overall window
    const [evs, convs, vws] = await Promise.all([
      prisma.adEvent.findMany({
        where: { createdAt: { gte: start }, ...(campaignId ? { campaignId } : {}) },
        select: { action: true, createdAt: true },
      }),
      prisma.adConversion.findMany({
        where: { createdAt: { gte: start }, ...(campaignId ? { campaignId } : {}) },
        select: { rewardCents: true, createdAt: true },
      }),
      prisma.cpvView.findMany({
        where: { createdAt: { gte: start }, ...(campaignId ? { campaignId } : {}) },
        select: { costCents: true, createdAt: true },
      }),
    ]);

    // Initialize buckets
    const series: { t: string; views: number; hovers: number; clicks: number; conversions: number; spendCents: number; rewardsCents: number }[] = [];
    for (let i = 0; i < points; i++) {
      const t = new Date(start.getTime() + i * stepMs);
      series.push({
        t: t.toISOString(),
        views: 0,
        hovers: 0,
        clicks: 0,
        conversions: 0,
        spendCents: 0,
        rewardsCents: 0,
      });
    }
    const idx = (d: Date) => {
      const i = Math.floor((d.getTime() - start.getTime()) / stepMs);
      return i < 0 || i >= points ? -1 : i;
    };

    // Fill event buckets
    for (const e of evs) {
      const i = idx(new Date(e.createdAt));
      if (i < 0) continue;
      if (e.action === "view") series[i].views++;
      else if (e.action === "hover") series[i].hovers++;
      else if (e.action === "click") series[i].clicks++;
    }

    // Fill conversion buckets
    for (const c of convs) {
      const i = idx(new Date(c.createdAt as any));
      if (i < 0) continue;
      series[i].conversions++;
      series[i].rewardsCents += Number(c.rewardCents || 0);
    }

    // Fill spend buckets (CpvView.costCents)
    for (const v of vws) {
      const i = idx(new Date(v.createdAt as any));
      if (i < 0) continue;
      series[i].spendCents += Number(v.costCents || 0);
    }

    return NextResponse.json({
      ok: true,
      bucket,
      points,
      campaignId: campaignId || null,
      series,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
