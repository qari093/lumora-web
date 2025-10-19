import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/ads/analytics/brands?days=7
 * Returns per-campaign metrics over the last N days:
 * views/hovers/clicks, conversions, spendCents, rewardsCents, ctr, cvr.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const days = Math.max(1, Math.min(90, Number(url.searchParams.get("days") || 7)));
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Pull raw data within window (single fetch each)
    const [evs, convs, vws] = await Promise.all([
      prisma.adEvent.findMany({
        where: { createdAt: { gte: since } },
        select: { campaignId: true, action: true },
      }),
      prisma.adConversion.findMany({
        where: { createdAt: { gte: since } },
        select: { campaignId: true, rewardCents: true },
      }),
      prisma.cpvView.findMany({
        where: { createdAt: { gte: since } },
        select: { campaignId: true, costCents: true },
      }),
    ]);

    const map: Record<string, { views:number; hovers:number; clicks:number; conversions:number; spendCents:number; rewardsCents:number }> = {};
    const ensure = (cid: string) => (map[cid] ||= { views:0, hovers:0, clicks:0, conversions:0, spendCents:0, rewardsCents:0 });

    for (const e of evs) {
      const cid = String(e.campaignId || "UNASSIGNED");
      const m = ensure(cid);
      if (e.action === "view") m.views++;
      else if (e.action === "hover") m.hovers++;
      else if (e.action === "click") m.clicks++;
    }
    for (const c of convs) {
      const cid = String(c.campaignId || "UNASSIGNED");
      const m = ensure(cid);
      m.conversions++;
      m.rewardsCents += Number(c.rewardCents || 0);
    }
    for (const v of vws) {
      const cid = String(v.campaignId || "UNASSIGNED");
      const m = ensure(cid);
      m.spendCents += Number(v.costCents || 0);
    }

    const rows = Object.entries(map).map(([campaignId, m]) => {
      const ctr = m.views > 0 ? m.clicks / m.views : 0;
      const cvr = m.clicks > 0 ? m.conversions / m.clicks : 0;
      return { campaignId, days, ...m, ctr, cvr };
    }).sort((a,b)=> b.spendCents - a.spendCents);

    return NextResponse.json({ ok:true, days, rows });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
