import prisma from "@/lib/prisma";

export async function ensureWallet(ownerId: string, currency = "EUR") {
  if (!ownerId) throw new Error("ensureWallet: ownerId required");
  const existing = await prisma.wallet.findUnique({ where: { ownerId } });
  if (existing) return existing;
  return prisma.wallet.create({ data: { ownerId, currency, balanceCents: 0 } });
}

export async function getWallet(ownerId: string) {
  if (!ownerId) throw new Error("getWallet: ownerId required");
  return prisma.wallet.findUnique({ where: { ownerId } });
}
