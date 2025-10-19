import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { fraudGuard } from "@/lib/fraud";
import { logErr } from "@/app/api/ads/_utils/log";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { viewKey, userId, eventType, rewardCents = 0 } = body;

    if (!viewKey || !eventType) {
      return NextResponse.json({ ok: false, error: "INVALID_INPUT" }, { status: 400 });
    }

    const fg = await fraudGuard(req, {
      scope: "convert",
      userId: typeof userId === "string" ? userId : null,
      viewKey: typeof viewKey === "string" ? viewKey : null,
      limits: { perIp: { limit: 6, windowSec: 10 } },
    });
    if ((fg as any).blocked) return NextResponse.json((fg as any).body, { status: (fg as any).status });

    const view = await prisma.cpvView.findUnique({ where: { idempotencyKey: viewKey } });
    if (!view) return NextResponse.json({ ok: false, error: "VIEW_NOT_FOUND" }, { status: 404 });

    const existing = await prisma.adConversion.findUnique({ where: { viewKey } });
    if (existing) return NextResponse.json({ ok: true, idempotent: true, alreadyConverted: true });

    const conv = await prisma.adConversion.create({
      data: { campaignId: view.campaignId, creativeId: null, viewKey, userId, eventType, rewardCents },
    });

    if (userId && rewardCents > 0) {
      const wallet = await prisma.wallet.findFirst({ where: { ownerId: userId, currency: "EUR" } });
      if (wallet) {
        await prisma.wallet.update({ where: { id: wallet.id }, data: { balanceCents: { increment: rewardCents } } });
      }
    }
    return NextResponse.json({ ok: true, recorded: true, conversion: conv });
  } catch (e:any) {
    logErr("convert", e);
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status: 500 });
  }
}
