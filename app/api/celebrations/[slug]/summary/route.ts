
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(_req: Request, ctx: { params: { slug: string } }) {
  try {
    const slug = ctx.params?.slug;
    if (!slug) return NextResponse.json({ ok: false, error: "missing slug" }, { status: 400 });

    const c = await prisma.celebration.findFirst({
      where: { slug },
      select: { id: true, slug: true, status: true, startAt: true, createdAt: true }
    });
    if (!c) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });

    const [participants, reactions, rewards] = await Promise.all([
      prisma.celebrationParticipant.count({ where: { celebrationId: c.id } }),
      prisma.celebrationReaction.groupBy({
        by: ["kind"],
        where: { celebrationId: c.id },
        _count: { _all: true }
      }).catch(() => [] as any[]),
      prisma.celebrationReward.groupBy({
        by: ["type"],
        where: { celebrationId: c.id },
        _count: { _all: true }
      }).catch(() => [] as any[])
    ]);

    return NextResponse.json({
      ok: true,
      celebration: c,
      participants,
      reactions: reactions.map(r => ({ kind: r.kind, count: r._count._all })),
      rewards: rewards.map(r => ({ type: r.type, count: r._count._all }))
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
