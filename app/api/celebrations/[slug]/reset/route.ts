import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(_req: Request, ctx: { params: { slug: string } }) {
  try {
    const raw = ctx?.params?.slug as any;
    const slug = Array.isArray(raw) ? raw[0] : raw;
    if (!slug) return NextResponse.json({ ok:false, error:"missing slug" }, { status:400 });

    const c = await prisma.celebration.findFirst({ where: { slug } });
    if (!c) return NextResponse.json({ ok:false, error:"celebration not found" }, { status:404 });

    await prisma.$transaction([
      prisma.celebrationParticipant.deleteMany({ where: { celebrationId: c.id } }),
      prisma.celebrationReaction.deleteMany({ where: { celebrationId: c.id } }),
      prisma.celebrationReward.deleteMany({ where: { celebrationId: c.id } }),
      prisma.celebration.update({
        where: { id: c.id },
        data: { status: "LIVE", startAt: new Date() },
      }),
    ]);

    return NextResponse.json({ ok:true, status:"LIVE" }, { status:200 });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message || e) }, { status:500 });
  }
}
