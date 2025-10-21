import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/ads/event/stats?minutes=60
 * Uses Prisma.groupBy and sorts in JS for broad compatibility.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const minutesRaw = Number(url.searchParams.get("minutes") || 60);
    const minutes = Math.max(1, Math.min(24 * 60, isNaN(minutesRaw) ? 60 : minutesRaw));
    const since = new Date(Date.now() - minutes * 60_000);

    const rows = await prisma.adEvent.groupBy({
      by: ["action"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
    });

    // Sort in JS (desc by count)
    rows.sort((a, b) => Number(b._count._all || 0) - Number(a._count._all || 0));

    const byAction: Record<string, number> = {};
    let total = 0;
    for (const r of rows) {
      const c = Number(r._count._all || 0);
      byAction[r.action] = c;
      total += c;
    }

    return NextResponse.json({ ok: true, windowMinutes: minutes, total, byAction });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
