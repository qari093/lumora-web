import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const indices = [
    { slug: "global-mood", name: "Global Mood Index", unit: "pts" },
    { slug: "focus-index",  name: "Focus Index",       unit: "pts" },
    { slug: "calm-index",   name: "Calm Index",        unit: "pts" },
  ];
  for (const ix of indices) {
    await prisma.emmlIndex.upsert({
      where: { slug: ix.slug },
      update: { name: ix.name, unit: ix.unit },
      create: ix,
    });
  }

  const market = await prisma.emmlMarket.upsert({
    where: { slug: "emml-alpha" },
    update: { name: "EMML Alpha", status: "ACTIVE" },
    create: { slug: "emml-alpha", name: "EMML Alpha", status: "ACTIVE" },
  });

  const assets = [
    { symbol: "ZC",     name: "Zencoin",  decimals: 2, supply: 1_000_000 },
    { symbol: "PULSE",  name: "Pulse",    decimals: 0, supply: 100_000_000 },
    { symbol: "EMOTIX", name: "Emotix",   decimals: 4, supply: 10_000 },
  ];
  for (const a of assets) {
    await prisma.emmlAsset.upsert({
      where: { marketId_symbol: { marketId: market.id, symbol: a.symbol } },
      update: { name: a.name, decimals: a.decimals, supply: a.supply },
      create: { marketId: market.id, ...a },
    });
  }

  const now = new Date();
  const sampleReadings = [
    { slug: "global-mood", value: 50.0 },
    { slug: "focus-index", value: 55.0 },
    { slug: "calm-index",  value: 52.5 },
  ];
  for (const r of sampleReadings) {
    const idx = await prisma.emmlIndex.findUnique({ where: { slug: r.slug } });
    if (idx) {
      await prisma.emmlReading.create({
        data: { indexId: idx.id, ts: now, value: r.value, meta: { seed: true } },
      });
    }
  }

  const seededAssets = await prisma.emmlAsset.findMany({ where: { marketId: market.id } });
  for (const a of seededAssets) {
    const price = a.symbol === "ZC" ? 1.00 : a.symbol === "PULSE" ? 0.05 : 12.3456;
    await prisma.emmlTick.create({
      data: { assetId: a.id, ts: now, price, volume: 1000 },
    });
  }

  const counts = {
    indices: await prisma.emmlIndex.count(),
    readings: await prisma.emmlReading.count(),
    markets: await prisma.emmlMarket.count(),
    assets:  await prisma.emmlAsset.count(),
    ticks:   await prisma.emmlTick.count(),
  };
  console.log("✅ EMML seed complete:", counts);
}

main().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
