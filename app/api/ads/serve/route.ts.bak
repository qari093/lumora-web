import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const campaignId = url.searchParams.get("campaignId") || "TEST_CAMPAIGN_1";
    const costCents = Number(url.searchParams.get("cpv") || 5);

    // Ensure campaign exists or create demo if missing
    let camp = await prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!camp && campaignId === "TEST_CAMPAIGN_1") {
      camp = await prisma.campaign.create({ data: { id: "TEST_CAMPAIGN_1", name: "Test Campaign", dailyBudgetCents: 10_000, targetingRadiusMiles: 50, status: "active" } as any });
    } else if (!camp) {
      return NextResponse.json({ ok:false, error:"CAMPAIGN_NOT_FOUND" }, { status:404 });
    }

    const viewKey = `view-${Date.now()}-${Math.floor(Math.random()*100000)}`;
    await prisma.cpvView.create({
      data: {
        idempotencyKey: viewKey,
        campaignId: camp.id,
        costCents: Math.max(0, Math.floor(costCents)),
      }
    });

    return NextResponse.json({ ok:true, campaignId: camp.id, viewKey });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
