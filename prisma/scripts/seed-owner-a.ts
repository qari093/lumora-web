import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const w = await prisma.wallet.upsert({
    where: { ownerId_currency: { ownerId: "OWNER_A", currency: "EUR" } },
    update: {},
    create: { ownerId: "OWNER_A", currency: "EUR", balanceCents: 0 },
  });
  console.log("✅ Seeded/Ensured wallet:", w.ownerId, w.currency, w.balanceCents);
}

main()
  .catch((e) => { console.error("Seed error:", e?.message || e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
