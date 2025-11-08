import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type Body = {
  email?: string;
  intensity?: number;
  color?: string;
  balance?: number;
};

function deriveFromMood(mood: string | null | undefined) {
  const m = (mood || "neutral").toLowerCase();
  switch (m) {
    case "focused":
    case "focus":
      return { intensity: 0.8, color: "blue",  balance: 0.7 };
    case "inspired":
      return { intensity: 0.85, color: "violet", balance: 0.65 };
    case "calm":
      return { intensity: 0.6, color: "teal", balance: 0.9 };
    case "joy":
    case "happy":
      return { intensity: 0.9, color: "gold", balance: 0.6 };
    case "anxious":
      return { intensity: 0.55, color: "amber", balance: 0.4 };
    case "stress":
    case "stressed":
      return { intensity: 0.5, color: "red", balance: 0.35 };
    default:
      return { intensity: 0.65, color: "silver", balance: 0.6 };
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const email = body.email?.trim();
    if (!email) {
      return NextResponse.json({ ok: false, error: "email is required" }, { status: 400 });
    }

    // find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email } });
    }

    // find or create world
    let world = await prisma.userWorld.findUnique({ where: { userId: user.id } });
    if (!world) {
      world = await prisma.userWorld.create({
        data: {
          userId: user.id,
          name: "My LumaSpace",
          theme: "default",
          mood: "neutral",
        },
      });
    }

    const derived = deriveFromMood(world.mood);
    const intensity = typeof body.intensity === "number" ? body.intensity : derived.intensity;
    const color = (body.color || derived.color).toLowerCase();
    const balance = typeof body.balance === "number" ? body.balance : derived.balance;

    let auraId = world.auraId;

    if (!auraId) {
      const created = await prisma.aura.create({
        data: { intensity, color, balance },
        select: { id: true, intensity: true, color: true, balance: true },
      });
      auraId = created.id;
      world = await prisma.userWorld.update({
        where: { id: world.id },
        data: { auraId },
      });
    } else {
      await prisma.aura.update({
        where: { id: auraId },
        data: { intensity, color, balance },
      });
    }

    const aura = await prisma.aura.findUnique({
      where: { id: auraId as string },
      select: { id: true, intensity: true, color: true, balance: true },
    });

    return NextResponse.json(
      { ok: true, worldId: world.id, aura },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
