import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { loadEcoFactors, estimateFromCounts, treesEquivalentKg } from "@/lib/eco";

/**
 * GET /api/eco/summary?minutes=60&campaignId=...
 * Returns { co2g, energyWh, counts, trees, kg }
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const minutesRaw = Number(url.searchParams.get("minutes") || 60);
    const minutes = Math.max(1, Math.min(24*60, isNaN(minutesRaw) ? 60 : minutesRaw));
    const campaignId = url.searchParams.get("campaignId") || undefined;
    const since = new Date(Date.now() - minutes * 60_000);

    const [evs, convs, vws] = await Promise.all([
      prisma.adEvent.findMany({
        where: { createdAt: { gte: since }, ...(campaignId ? { campaignId } : {}) },
        select: { action: true },
      }),
      prisma.adConversion.findMany({
        where: { createdAt: { gte: since }, ...(campaignId ? { campaignId } : {}) },
        select: { id: true },
      }),
      prisma.cpvView.findMany({
        where: { createdAt: { gte: since }, ...(campaignId ? { campaignId } : {}) },
        select: { costCents: true },
      }),
    ]);

    let views=0, hovers=0, clicks=0;
    for (const e of evs) {
      if (e.action==="view") views++;
      else if (e.action==="hover") hovers++;
      else if (e.action==="click") clicks++;
    }
    const conversions = convs.length;
    const spendCents = vws.reduce((s,v)=> s + Number(v.costCents||0), 0);

    const f = loadEcoFactors();
    const counts = { views, hovers, clicks, conversions, spendCents };
    const est = estimateFromCounts(f, counts);
    const trees = treesEquivalentKg(est.co2g);

    return NextResponse.json({ ok:true, windowMinutes: minutes, campaignId: campaignId || null, counts, ...est, ...trees });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: String(e?.message||e) }, { status:500 });
  }
}
