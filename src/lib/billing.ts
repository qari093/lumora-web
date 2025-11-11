import { prisma } from "./prisma";

export const CURRENCY = process.env.AD_WALLET_CURRENCY ?? "EUR";
export const IMPRESSION_COST_CENTS = Number(process.env.AD_IMPRESSION_COST_CENTS ?? "2");
export const CLICK_COST_CENTS = Number(process.env.AD_CLICK_COST_CENTS ?? "25");

function whereUnique(ownerId: string, currency = CURRENCY) {
  return { ownerId_currency: { ownerId, currency } };
}

export async function ensureWallet(ownerId: string, currency = CURRENCY) {
  return prisma.wallet.upsert({
    where: whereUnique(ownerId, currency),
    update: {},
    create: { ownerId, currency, balanceCents: 0 },
  });
}

export async function getBalance(ownerId: string, currency = CURRENCY) {
  const w = await prisma.wallet.findUnique({ where: whereUnique(ownerId, currency) });
  if (!w) {
    const created = await ensureWallet(ownerId, currency);
    return created.balanceCents;
  }
  return w.balanceCents;
}

export async function topup(ownerId: string, cents: number, reason = "topup", currency = CURRENCY) {
  const w = await ensureWallet(ownerId, currency);
  const updated = await prisma.$transaction(async (tx: any) => {
    const nw = await tx.wallet.update({
      where: { id: w.id },
      data: { balanceCents: { increment: cents } },
    });
    await tx.ledgerEntry.create({
      data: { walletId: w.id, deltaCents: cents, reason, event: "topup" },
    });
    return nw;
  });
  return updated.balanceCents;
}

export async function charge(
  ownerId: string,
  cents: number,
  meta: { adId?: string; event?: string; reason?: string; currency?: string } = {}
) {
  const currency = meta.currency ?? CURRENCY;
  if (cents <= 0) return getBalance(ownerId, currency);
  const w = await ensureWallet(ownerId, currency);
  if (w.balanceCents < cents) throw new Error("INSUFFICIENT_FUNDS");
  const updated = await prisma.$transaction(async (tx: any) => {
    const nw = await tx.wallet.update({
      where: { id: w.id },
      data: { balanceCents: { decrement: cents } },
    });
    await tx.ledgerEntry.create({
      data: {
        walletId: w.id,
        deltaCents: -cents,
        adId: meta.adId,
        event: meta.event,
        reason: meta.reason ?? "charge",
      },
    });
    return nw;
  });
  return updated.balanceCents;
}
