import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type Body = {
  email?: string;
  xpDelta?: number;  // amount of XP to add (can be negative, but will clamp at 0)
};

// Simple level requirement: next level needs 100 * currentLevel XP
function needFor(level: number) {
  return Math.max(50, level * 100);
}

async function getOrCreateUser(email: string) {
  let u = await prisma.user.findUnique({ where: { email } });
  if (!u) u = await prisma.user.create({ data: { email } });
  return u;
}

async function getOrCreateWorld(userId: string) {
  let w = await prisma.userWorld.findUnique({ where: { userId } });
  if (!w) {
    w = await prisma.userWorld.create({
      data: { userId, name: "My LumaSpace", theme: "default", mood: "neutral" },
    });
  }
  return w;
}

async function getOrCreateTree(worldId: string) {
  // world has unique treeId; create TreeState and link if missing
  let world = await prisma.userWorld.findUnique({ where: { id: worldId } });
  if (!world?.treeId) {
    const tree = await prisma.treeState.create({ data: { level: 1, xp: 0 } });
    world = await prisma.userWorld.update({
      where: { id: worldId },
      data: { treeId: tree.id },
      select: { id: true, treeId: true },
    });
  }
  const tree = await prisma.treeState.findUnique({
    where: { id: world!.treeId as string },
    select: { id: true, level: true, xp: true, updatedAt: true },
  });
  return tree!;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email") || undefined;
    if (!email) return NextResponse.json({ ok: false, error: "email is required" }, { status: 400 });

    const user = await getOrCreateUser(email);
    const world = await getOrCreateWorld(user.id);
    const tree = await getOrCreateTree(world.id);

    const needed = needFor(tree.level);
    return NextResponse.json({ ok: true, worldId: world.id, tree: { ...tree, needed } }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const email = body.email?.trim();
    if (!email) return NextResponse.json({ ok: false, error: "email is required" }, { status: 400 });

    const xpDeltaRaw = typeof body.xpDelta === "number" ? body.xpDelta : 50; // default gain
    const xpDelta = Math.max(-1000000, Math.min(1000000, xpDeltaRaw)); // clamp

    const user = await getOrCreateUser(email);
    const world = await getOrCreateWorld(user.id);
    let tree = await getOrCreateTree(world.id);

    let level = tree.level;
    let xp = tree.xp + xpDelta;
    if (xp < 0) xp = 0;

    // level-up loop
    let levelUps = 0;
    while (xp >= needFor(level)) {
      xp -= needFor(level);
      level += 1;
      levelUps += 1;
      // small safety cap
      if (level > 999) break;
    }

    // persist
    await prisma.treeState.update({
      where: { id: tree.id },
      data: { level, xp },
    });

    const needed = needFor(level);
    return NextResponse.json(
      {
        ok: true,
        worldId: world.id,
        result: {
          added: xpDelta,
          levelUps,
          level,
          xp,
          neededNext: needed,
        },
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
