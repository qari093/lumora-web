import { NextResponse } from "next/server";
import { prisma } from "@/app/_server/prisma";

async function worldIdByEmail(email: string){
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) user = await prisma.user.create({ data: { email } });
  let world = await prisma.userWorld.findFirst({ where: { userId: user.id } });
  if (!world) {
    world = await prisma.userWorld.create({
      data: { userId: user.id, name: "Founders Space", theme: "aurora", mood: "inspired" }
    });
  }
  return world.id;
}

async function getWorldIdByEmail(email: string) {
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({ data: { email } });
    await prisma.userWorld.create({ data: { userId: user.id, name: "Founders Space", theme: "aurora", mood: "inspired" } });
  }
  const world = await prisma.userWorld.findFirst({ where: { userId: user.id } });
  if (!world) throw new Error("world not found");
  return world.id;
}

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const email = String(b.email || "").trim();
    if (!email) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
    const worldId = await worldIdByEmail(email);
    let journal = await prisma.shadowJournal.findFirst({ where: { worldId } });
    if (!journal) journal = await prisma.shadowJournal.create({ data: { worldId } });
    const entry = await prisma.shadowEntry.create({
      data: {
        journalId: journal.id,
        text: String(b.text || "").slice(0, 2000),
        emotion: b.emotion ? String(b.emotion) : null,
        privacy: b.privacy ? String(b.privacy) : "private"
      },
      select: { id: true, text: true, emotion: true, privacy: true, createdAt: true }
    });
    return NextResponse.json({ ok: true, entry });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export async function GET(req: Request){
  try{
    const u = new URL(req.url);
    const email = String(u.searchParams.get("email")||"").trim();
    if(!email) return NextResponse.json({ ok:false, error:"email required" }, { status:400 });

    const takeParam = Number(u.searchParams.get("take") || "10");
    const take = Math.max(1, Math.min(20, Number.isFinite(takeParam) ? takeParam : 10));

    const cursorId = u.searchParams.get("cursor") || null;

    const worldId = await worldIdByEmail(email);
    const journal = await prisma.shadowJournal.findFirst({ where: { worldId } });
    if(!journal) return NextResponse.json({ ok:true, worldId, count:0, entries: [] });

    let cursorCreatedAt: Date | null = null;
    if (cursorId) {
      const cur = await prisma.shadowEntry.findUnique({
        where: { id: String(cursorId) },
        select: { createdAt: true, id: true }
      });
      if (cur) cursorCreatedAt = cur.createdAt;
    }

    const where:any = { journalId: journal.id };
    if (cursorCreatedAt) {
      where.createdAt = { lt: cursorCreatedAt };
    }

    const entries = await prisma.shadowEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      select: { id:true, text:true, emotion:true, privacy:true, createdAt:true }
    });

    return NextResponse.json({ ok:true, worldId, count: entries.length, entries });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: String(e?.message||e) }, { status:500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const { email, id } = await req.json();
    if (!email || !id) {
      return NextResponse.json({ ok: false, error: "email and id required" }, { status: 400 });
    }
    const worldId = await worldIdByEmail(String(email));
    // find journal for this world
    const journal = await prisma.shadowJournal.findFirst({ where: { worldId } });
    if (!journal) return NextResponse.json({ ok: true, deleted: 0 });
    // delete entry by id within this journal
    const res = await prisma.shadowEntry.deleteMany({ where: { id, journalId: journal.id } });
    return NextResponse.json({ ok: true, deleted: res.count });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
