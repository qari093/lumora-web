import { NextResponse } from "next/server";
import { prisma } from "@/app/_server/prisma";

async function getWorldIdByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("user not found");
  const world = await prisma.userWorld.findFirst({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!world) throw new Error("world not found");
  return world.id;
}

export async function POST(req: Request) {
  try {
    const { email, title, text, mood, tags, score } = await req.json();
    if (!email || !title || !text) {
      return NextResponse.json({ ok: false, error: "email, title, text required" }, { status: 400 });
    }
    const worldId = await getWorldIdByEmail(String(email));
    const entry = await prisma.reflectionJournal.create({
      data: {
        worldId,
        title: String(title),
        text: String(text),
        mood: typeof mood === "string" ? mood : null,
        // tags is Json in Prisma (SQLite): store array or object as-is, else empty array
        tags: Array.isArray(tags) || (tags && typeof tags === "object") ? (tags as any) : [],
        score: typeof score === "number" ? score : null,
      },
      select: { id: true, title: true, text: true, mood: true, tags: true, score: true, createdAt: true },
    });
    return NextResponse.json({ ok: true, entry });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const takeParam = searchParams.get("take");
    if (!email) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });

    const take = Math.max(1, Math.min(50, Number(takeParam || 10)));
    const worldId = await getWorldIdByEmail(String(email));
    const entries = await prisma.reflectionJournal.findMany({
      where: { worldId },
      orderBy: { createdAt: "desc" },
      take,
      select: { id: true, title: true, text: true, mood: true, tags: true, score: true, createdAt: true },
    });
    return NextResponse.json({ ok: true, count: entries.length, entries });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || '').trim();
    const id = String(body?.id || '').trim();
    if (!email || !id) {
      return NextResponse.json({ ok: false, error: "email and id required" }, { status: 400 });
    }
    const worldId = await getWorldIdByEmail(email);
    const res = await prisma.reflectionJournal.deleteMany({ where: { id, worldId } });
    return NextResponse.json({ ok: true, deleted: res.count });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
