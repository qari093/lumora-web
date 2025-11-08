import { NextResponse } from "next/server";
import { PrismaClient, CelebrationStatus } from "@prisma/client";
const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function POST(req: Request, ctx: { params: { slug: string } }) {
  try {
    const raw = ctx?.params?.slug as any;
    const slug = Array.isArray(raw) ? raw[0] : raw;
    if (!slug) return NextResponse.json({ ok:false, error:"missing slug" }, { status:400 });

    const body = await req.json().catch(() => ({}));
    const status = String(body?.status || "").toUpperCase() as CelebrationStatus;

    if (!["LIVE","ENDED","PAUSED"].includes(status))
      return NextResponse.json({ ok:false, error:"invalid status" }, { status:400 });

    const c = await prisma.celebration.findFirst({ where: { slug } });
    if (!c) return NextResponse.json({ ok:false, error:"celebration not found" }, { status:404 });

    const updated = await prisma.celebration.update({
      where: { id: c.id },
      data: { status, ...(status === "LIVE" ? { startAt: new Date() } : {}) },
      select: { id:true, slug:true, status:true, startAt:true, createdAt:true }
    });

    return NextResponse.json({ ok:true, celebration: updated });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message || e) }, { status:500 });
  }
}
