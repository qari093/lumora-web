import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 1) Ensure demo user (User has email unique in your schema)
  const user = await prisma.user.upsert({
    where: { email: "demo@lumora.local" },
    update: {},
    create: { email: "demo@lumora.local" },
  });

  // 2) If world already exists for this user, exit
  const existing = await prisma.userWorld.findFirst({ where: { userId: user.id } });
  if (existing) {
    console.log(`UserWorld already exists for ${user.email}: ${existing.id}`);
    return;
  }

  // 3) Create bare world (only fields we know exist on UserWorld)
  const world = await prisma.userWorld.create({
    data: {
      userId: user.id,
      name: "Founders Space",
      theme: "aurora",
      mood: "inspired",
    },
  });
  console.log(`Created UserWorld: ${world.id}`);

  // 4) Best-effort: create optional related records IF schema allows them.
  //    We avoid unknown fields by trying minimal shapes and catching validation errors.

  // Try Aura
  let auraId: string | null = null;
  try {
    // Some schemas only allow { balance } on Aura; others may allow empty create with defaults.
    const aura = await prisma.aura.create({ data: { /* balance: 0 */ } as any });
    auraId = (aura as any).id ?? null;
    console.log(`Created Aura: ${auraId || "no-id-returned"}`);
  } catch (e) {
    try {
      // Fallback with balance if required by your schema
      const aura = await prisma.aura.create({ data: { balance: 0 } as any });
      auraId = (aura as any).id ?? null;
      console.log(`Created Aura (with balance): ${auraId || "no-id-returned"}`);
    } catch {
      console.log("Skipped Aura (schema does not match).");
    }
  }

  // Try TreeState
  let treeId: string | null = null;
  try {
    const tree = await prisma.treeState.create({ data: {} as any });
    treeId = (tree as any).id ?? null;
    console.log(`Created TreeState: ${treeId || "no-id-returned"}`);
  } catch {
    try {
      const tree = await prisma.treeState.create({ data: { level: 1, xp: 0 } as any });
      treeId = (tree as any).id ?? null;
      console.log(`Created TreeState (level/xp): ${treeId || "no-id-returned"}`);
    } catch {
      console.log("Skipped TreeState (schema does not match).");
    }
  }

  // Try ShadowGarden
  let shadowId: string | null = null;
  try {
    const shadow = await prisma.shadowGarden.create({ data: {} as any });
    shadowId = (shadow as any).id ?? null;
    console.log(`Created ShadowGarden: ${shadowId || "no-id-returned"}`);
  } catch {
    try {
      // Some schemas expect entries as JSON or string; try a simple JSON string if needed.
      const shadow = await prisma.shadowGarden.create({ data: { entries: "[]" } as any });
      shadowId = (shadow as any).id ?? null;
      console.log(`Created ShadowGarden (entries): ${shadowId || "no-id-returned"}`);
    } catch {
      console.log("Skipped ShadowGarden (schema does not match).");
    }
  }

  // 5) Patch world with any created relation ids (fields are optional and unique)
  if (auraId || treeId || shadowId) {
    await prisma.userWorld.update({
      where: { id: world.id },
      data: {
        ...(auraId ? { auraId } : {}),
        ...(treeId ? { treeId } : {}),
        ...(shadowId ? { shadowId } : {}),
      },
    });
    console.log("Linked related records to UserWorld.");
  }

  // 6) Create ZenLink (worldId unique in your schema)
  try {
    await prisma.zenLink.create({
      data: {
        worldId: world.id,
        zenId: "ZC-DEMO",
        pulses: 0,
        multiplier: 1.0,
      },
    });
    console.log("ZenLink attached.");
  } catch {
    console.log("Skipped ZenLink (schema does not match).");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("Seed error:", e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
