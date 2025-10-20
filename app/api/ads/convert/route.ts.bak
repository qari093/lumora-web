import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { viewKey, userId, eventType, rewardCents = 0 } = body || {};
    let { channel, shortSlug } = body || {};
    if (!viewKey || !eventType) return NextResponse.json({ ok:false, error:"INVALID_INPUT" }, { status:400 });

    const c = req.cookies;
    if (!channel)   channel   = c.get("lum_ch")?.value || null;
    if (!shortSlug) shortSlug = c.get("lum_slug")?.value || null;

    const view = await prisma.cpvView.findUnique({ where: { idempotencyKey: String(viewKey) } });
    if (!view) return NextResponse.json({ ok:false, error:"VIEW_NOT_FOUND" }, { status:404 });

    const existing = await prisma.adConversion.findUnique({ where: { viewKey: String(viewKey) } } as any);
    if (existing) return NextResponse.json({ ok:true, idempotent:true, alreadyConverted:true });

    const conv = await prisma.adConversion.create({
      data: {
        campaignId: view.campaignId,
        creativeId: (view as any).creativeId ?? null,
        viewKey: String(viewKey),
        userId: userId ? String(userId) : null,
        eventType: String(eventType),
        rewardCents: Number(rewardCents) || 0,
        channel: channel ? String(channel) : null,
        shortSlug: shortSlug ? String(shortSlug) : null,
      } as any,
    });

    if (userId && (Number(rewardCents) || 0) > 0) {
      const wallet = await prisma.wallet.findFirst({ where: { ownerId: String(userId), currency: "EUR" } });
      if (wallet) {
        await prisma.wallet.update({ where: { id: wallet.id }, data: { balanceCents: { increment: Number(rewardCents) } } });
      }
    }

    return NextResponse.json({ ok:true, recorded:true, conversion: conv });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error:String(err?.message || err) }, { status:500 });
  }
}
