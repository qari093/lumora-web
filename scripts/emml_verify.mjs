import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const out = {};
out.indices = await prisma.emmlIndex.findMany({ select: { slug: true } });
out.markets = await prisma.emmlMarket.findMany({ select: { slug: true } });
out.assets  = await prisma.emmlAsset.findMany({ select: { symbol: true } });
console.log(JSON.stringify(out, null, 2));
await prisma.$disconnect();
