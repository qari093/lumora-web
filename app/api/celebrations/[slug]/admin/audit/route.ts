import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: { slug: string } }) {
  try {
    const raw = ctx?.params?.slug as any;
    const slug = Array.isArray(raw) ? raw[0] : raw;
    if (!slug) return NextResponse.json({ ok:false, error:"missing slug" }, { status:400 });

    const c = await prisma.celebration.findFirst({ where: { slug } });
    if (!c) return NextResponse.json({ ok:false, error:"celebration not found" }, { status:404 });

    const [participants, reactions, rewards] = await Promise.all([
      prisma.celebrationParticipant.count({ where: { celebrationId: c.id } }),
      prisma.celebrationReaction.count({ where: { celebrationId: c.id } }),
      prisma.celebrationReward.count({ where: { celebrationId: c.id } }),
    ]);

    return NextResponse.json({
      ok: true,
      celebration: { id: c.id, slug: c.slug, status: c.status, startAt: c.startAt, createdAt: c.createdAt },
      totals: { participants, reactions, rewards }
    });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message || e) }, { status:500 });
  }
}
