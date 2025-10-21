import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { loadEcoFactors, estimateFromCounts } from "@/lib/eco";

/**
 * GET /api/eco/timeseries?bucket=minute|hour&points=30&campaignId=...
 * Returns series of { t, co2g, energyWh, views, hovers, clicks, conversions, spendCents }
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const bucket = (url.searchParams.get("bucket") || "minute").toLowerCase();
    const points = Math.max(1, Math.min(500, Number(url.searchParams.get("points") || 30)));
    const campaignId = url.searchParams.get("campaignId") || undefined;

    const now = new Date();
    const stepMs = bucket === "hour" ? 3600000 : 60000;
    const start = new Date(now.getTime() - points * stepMs);

    const [evs, convs, vws] = await Promise.all([
      prisma.adEvent.findMany({
        where: { createdAt: { gte: start }, ...(campaignId ? { campaignId } : {}) },
        select: { action: true, createdAt: true },
      }),
      prisma.adConversion.findMany({
        where: { createdAt: { gte: start }, ...(campaignId ? { campaignId } : {}) },
        select: { createdAt: true },
      }),
      prisma.cpvView.findMany({
        where: { createdAt: { gte: start }, ...(campaignId ? { campaignId } : {}) },
        select: { costCents: true, createdAt: true },
      }),
    ]);

    const series: any[] = Array.from({length: points}).map((_,i)=>{
      const t = new Date(start.getTime() + i*stepMs).toISOString();
      return { t, views:0, hovers:0, clicks:0, conversions:0, spendCents:0, co2g:0, energyWh:0 };
    });
    const idx = (d: Date) => {
      const i = Math.floor((d.getTime() - start.getTime()) / stepMs);
      return i < 0 || i >= points ? -1 : i;
    };

    for (const e of evs) {
      const i = idx(new Date(e.createdAt as any));
      if (i<0) continue;
      if (e.action==="view") series[i].views++;
      else if (e.action==="hover") series[i].hovers++;
      else if (e.action==="click") series[i].clicks++;
    }
    for (const c of convs) {
      const i = idx(new Date(c.createdAt as any));
      if (i<0) continue;
      series[i].conversions++;
    }
    for (const v of vws) {
      const i = idx(new Date(v.createdAt as any));
      if (i<0) continue;
      series[i].spendCents += Number(v.costCents || 0);
    }

    const f = loadEcoFactors();
    for (const row of series) {
      const est = estimateFromCounts(f, row);
      row.co2g = est.co2g;
      row.energyWh = est.energyWh;
    }

    return NextResponse.json({ ok:true, bucket, points, campaignId: campaignId || null, series });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: String(e?.message||e) }, { status:500 });
  }
}
