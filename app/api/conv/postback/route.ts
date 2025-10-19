import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) { return handler(req); }
export async function POST(req: Request) { return handler(req); }

async function handler(req: Request) {
  try {
    const url = new URL(req.url);
    const payload = req.method === "POST" ? await req.json().catch(()=> ({})) : Object.fromEntries(url.searchParams.entries());

    const viewKey    = payload.viewKey;
    const eventType  = payload.eventType || "PURCHASE";
    const userId     = payload.userId || null;
    const rewardCents= Number(payload.rewardCents || 0);
    const channel    = payload.channel || null;
    const shortSlug  = payload.shortSlug || null;

    if (!viewKey) return NextResponse.json({ ok:false, error:"VIEWKEY_REQUIRED" }, { status:400 });
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
        rewardCents,
        channel: channel ? String(channel) : null,
        shortSlug: shortSlug ? String(shortSlug) : null,
      } as any,
    });

    if (userId && rewardCents > 0) {
      const wallet = await prisma.wallet.findFirst({ where: { ownerId: String(userId), currency: "EUR" } });
      if (wallet) await prisma.wallet.update({ where: { id: wallet.id }, data: { balanceCents: { increment: rewardCents } } });
    }
    return NextResponse.json({ ok:true, recorded:true, conversion: conv });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
