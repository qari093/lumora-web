import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loadEcoFactors, estimateFromCounts } from "@/lib/eco";

/**
 * POST /api/eco/rollup/run?days=7
 * Computes EcoMetricDaily by day & campaign from events/conversions/spend.
 */
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const days = Math.max(1, Math.min(90, Number(url.searchParams.get("days") || 7)));

    const startOfDay = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const today = startOfDay(new Date());
    const daysList: Date[] = [];
    for (let i=0; i<days; i++) daysList.push(new Date(today.getTime() - i*86400000));

    const f = loadEcoFactors();
    let upserts = 0;

    for (const day of daysList) {
      const next = new Date(day.getTime() + 86400000);

      const [evs, convs, vws] = await Promise.all([
        prisma.adEvent.findMany({ where: { createdAt: { gte: day, lt: next } }, select: { campaignId: true, action: true } }),
        prisma.adConversion.findMany({ where: { createdAt: { gte: day, lt: next } }, select: { campaignId: true } }),
        prisma.cpvView.findMany({ where: { createdAt: { gte: day, lt: next } }, select: { campaignId: true, costCents: true } }),
      ]);

      const keys = new Set<string>([
        ...evs.map(e=>String(e.campaignId||"ALL")),
        ...convs.map(c=>String(c.campaignId||"ALL")),
        ...vws.map(v=>String(v.campaignId||"ALL")),
      ]);

      for (const k of keys) {
        let views=0, hovers=0, clicks=0, conversions=0, spendCents=0;
        for (const e of evs) if (String(e.campaignId||"ALL")===k) {
          if (e.action==="view") views++; else if (e.action==="hover") hovers++; else if (e.action==="click") clicks++;
        }
        for (const c of convs) if (String(c.campaignId||"ALL")===k) conversions++;
        for (const v of vws) if (String(v.campaignId||"ALL")===k) spendCents += Number(v.costCents||0);

        const est = estimateFromCounts(f, { views, hovers, clicks, conversions, spendCents });
        const id = `${k}_${day.toISOString().slice(0,10)}`;

        await prisma.ecoMetricDaily.upsert({
          where: { id },
          update: { day, campaignId: k==="ALL" ? null : k, co2g: est.co2g, energyWh: est.energyWh },
          create: { id, day, campaignId: k==="ALL" ? null : k, co2g: est.co2g, energyWh: est.energyWh },
        });
        upserts++;
      }
    }

    return NextResponse.json({ ok:true, days, upserts });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: String(e?.message||e) }, { status:500 });
  }
}
