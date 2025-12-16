import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export async function persistEmmlSnapshot(input: any) {
  return db.emmlSnapshot.create({
    data: {
      marketsOnline: input.marketsOnline ?? 0,
      indicesTracked: input.indicesTracked ?? 0,
      heatSampleSize: input.heatSampleSize ?? 0,
      health: input.health ?? "ok",
      composite: input.composite ?? {},
      indicesJson: input.indicesJson ?? {},
      marketsJson: input.marketsJson ?? {},
      metaJson: input.metaJson ?? {},
    },
  });
}

export async function getLatestEmmlSnapshot() {
  return db.emmlSnapshot.findFirst({
    orderBy: { createdAt: "desc" },
  });
}
