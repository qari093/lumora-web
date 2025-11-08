import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const { userId, email, name, theme, mood } = body || {};

    if (!userId && !email) {
      return NextResponse.json({ ok: false, error: "missing userId or email" }, { status: 400 });
    }

    let user = null as any;

    if (userId) {
      user = await prisma.user.findUnique({ where: { id: String(userId) } });
    }

    if (!user && email) {
      user = await prisma.user.upsert({
        where: { email: String(email) },
        update: {},
        create: { email: String(email) }
      });
    }

    if (!user) {
      return NextResponse.json({ ok: false, error: "user not found or creatable" }, { status: 404 });
    }

    const existing = await prisma.userWorld.findFirst({ where: { userId: user.id } });

    let world = existing;
    let created = false;

    if (!world) {
      world = await prisma.userWorld.create({
        data: {
          userId: user.id,
          name: name || "My LumaSpace",
          theme: theme || "default",
          mood: mood || "neutral",
          tree: { create: { level: 1, xp: 0 } },
          shadow: { create: { entries: "[]" } }
        }
      });
      created = true;

      try {
        await prisma.zenLink.create({
          data: { worldId: world.id, zenId: "ZC-DEMO", pulses: 0, multiplier: 1.0 }
        });
      } catch {
        // zen link optional
      }
    }

    return NextResponse.json({ ok: true, created, worldId: world.id }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
