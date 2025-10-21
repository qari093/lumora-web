import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const adId = url.searchParams.get("adId") || "ad_demo_001";
  const ownerId = url.searchParams.get("ownerId") || "OWNER_A";
  const sinceHours = Math.max(1, Number(url.searchParams.get("sinceHours") || 24));
  const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000);

  // Count by action
  const [imps, clicks, convs] = await Promise.all([
    prisma.adEvent.count({ where: { viewKey: adId, campaignId: ownerId, action: "impression" as any, createdAt: { gte: since } } }),
    prisma.adEvent.count({ where: { viewKey: adId, campaignId: ownerId, action: "click" as any, createdAt: { gte: since } } }),
    prisma.adEvent.count({ where: { viewKey: adId, campaignId: ownerId, action: "conversion" as any, createdAt: { gte: since } } }),
  ]);

  const ctr = imps > 0 ? +( (clicks / imps) * 100 ).toFixed(2) : 0;
  const cvr = clicks > 0 ? +( (convs / clicks) * 100 ).toFixed(2) : 0;

  return NextResponse.json({
    ok: true,
    adId, ownerId,
    window: { since, hours: sinceHours },
    totals: { impressions: imps, clicks, conversions: convs, ctrPct: ctr, cvrPct: cvr },
  });
}

export const runtime = "nodejs";
