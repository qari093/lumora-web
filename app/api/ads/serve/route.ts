import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fraudGuard } from "@/lib/fraud";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const ownerId = url.searchParams.get("ownerId") || "OWNER_A";

    const fg = await fraudGuard(req, { scope: "serve", limits: { perIp: { limit: 5, windowSec: 10 } } });
    if ((fg as any).blocked) {
      return NextResponse.json((fg as any).body, { status: (fg as any).status });
    }

    const campaignId = "TEST_CAMPAIGN_1";
    const viewKey = "view-" + Date.now() + "-" + Math.floor(Math.random() * 100000);

    await prisma.cpvView.create({
      data: { idempotencyKey: viewKey, campaignId, costCents: 5 },
    });

    return NextResponse.json({ ok: true, campaignId, viewKey, ownerId });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
