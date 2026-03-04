import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/vendor/timeseries?ownerId=OWNER_A&days=14
 * Returns an array of { dayISO, rewardsCents, conversions } for last N days.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const ownerId = url.searchParams.get("ownerId") || "OWNER_A";
    const days = Math.max(1, Math.min(90, Number(url.searchParams.get("days") || 14)));

    const startOfDay = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const today = startOfDay(new Date());
    const from = new Date(today.getTime() - (days - 1) * 86400000);

    const convs = await prisma.adConversion.findMany({
      where: { userId: ownerId, createdAt: { gte: from } },
      select: { rewardCents: true, createdAt: true },
    });

    const series = Array.from({ length: days }).map((_, i) => {
      const day = new Date(from.getTime() + i * 86400000);
      return {
        dayISO: day.toISOString(),
        rewardsCents: 0,
        conversions: 0,
      };
    });

    const dayIndex = (d: Date) => Math.floor((new Date(d).getTime() - from.getTime()) / 86400000);

    for (const c of convs) {
      const i = dayIndex(c.createdAt as any);
      if (i >= 0 && i < days) {
        series[i].conversions += 1;
        series[i].rewardsCents += Number(c.rewardCents || 0);
      }
    }

    return NextResponse.json({ ok: true, ownerId, days, series });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
