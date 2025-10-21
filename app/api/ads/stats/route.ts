import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const adId = url.searchParams.get("adId") || "";
  const ownerId = url.searchParams.get("ownerId") || undefined;
  if (!adId) {
    return NextResponse.json({ ok: false, error: "Missing adId" }, { status: 400 });
  }

  const whereBase: any = { viewKey: adId };
  if (ownerId) whereBase.campaignId = ownerId;

  const [impressions, clicks, lastEvent] = await Promise.all([
    prisma.adEvent.count({ where: { ...whereBase, action: "impression" as any } }),
    prisma.adEvent.count({ where: { ...whereBase, action: "click" as any } }),
    prisma.adEvent.findFirst({
      where: whereBase,
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [imp24h, clk24h] = await Promise.all([
    prisma.adEvent.count({ where: { ...whereBase, action: "impression" as any, createdAt: { gte: since } } }),
    prisma.adEvent.count({ where: { ...whereBase, action: "click" as any, createdAt: { gte: since } } }),
  ]);

  return NextResponse.json(
    {
      ok: true,
      adId,
      ownerId: ownerId ?? null,
      totals: { impressions, clicks },
      last24h: { impressions: imp24h, clicks: clk24h, since: since.toISOString() },
      lastEventAt: lastEvent?.createdAt?.toISOString() ?? null,
    },
    { status: 200 }
  );
}

export const runtime = "nodejs";
