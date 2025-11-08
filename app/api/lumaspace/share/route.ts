import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const mediaUrl = String(body.mediaUrl || body.videoId || "").trim();
    const caption = typeof body.caption === "string" ? body.caption : "";
    const type = typeof body.type === "string" ? body.type : undefined;
    const emotion = typeof body.emotion === "string" ? body.emotion : undefined;

    if (!email) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
    if (!mediaUrl) return NextResponse.json({ ok: false, error: "mediaUrl or videoId required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ ok: false, error: "user not found" }, { status: 404 });

    let world = await prisma.userWorld.findUnique({ where: { userId: user.id } });
    if (!world) {
      world = await prisma.userWorld.create({
        data: { userId: user.id, name: "Founders Space", theme: "aurora", mood: "inspired" },
      });
    }

    const cap = await prisma.capsule.create({
      data: {
        worldId: world.id,
        mediaUrl,
        caption,
        ...(type ? { type } : {}),
        ...(emotion ? { emotion } : {}),
        ts: new Date(),
      },
    });

    return NextResponse.json({ ok: true, capsule: cap }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
