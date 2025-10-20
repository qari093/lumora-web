import { prisma } from "@/lib/prisma";

export type LedgerKind =
  | "CREDIT" | "DEBIT" | "AD_SPEND" | "RESERVE"
  | "RELEASE" | "TRANSFER_IN" | "TRANSFER_OUT";

export async function ensureWallet(ownerId: string) {
  if (!ownerId) throw new Error("ownerId required");
  const existing = await prisma.wallet.findFirst({ where: { ownerId, currency: "EUR" } });
  if (existing) return existing;
  return prisma.wallet.create({ data: { ownerId, currency: "EUR" } });
}

export async function ledgerEntry(opts: {
  ownerId: string; type: LedgerKind; amountCents: number;
  note?: string; refType?: string | null; refId?: string | null;
}) {
  const amount = Math.max(0, Math.round(opts.amountCents || 0));
  if (!opts.ownerId) throw new Error("ownerId required");
  if (!amount) throw new Error("amountCents must be > 0");
  const negative = ["DEBIT","AD_SPEND","RESERVE","TRANSFER_OUT"].includes(opts.type);
  const delta = negative ? -amount : amount;

  return prisma.$transaction(async (tx) => {
    let wallet = await tx.wallet.findFirst({ where: { ownerId: opts.ownerId, currency: "EUR" } });
    if (!wallet) wallet = await tx.wallet.create({ data: { ownerId: opts.ownerId, currency: "EUR" } });
    if (negative && wallet.balanceCents + delta < 0) throw new Error("Insufficient balance");

    const ledger = await tx.walletLedger.create({
      data: { walletId: wallet.id, type: opts.type as any, amountCents: amount,
              note: opts.note ?? null, refType: opts.refType ?? null, refId: opts.refId ?? null }
    });

    await tx.wallet.update({ where: { id: wallet.id }, data: { balanceCents: { increment: delta } } });
    const refreshed = await tx.wallet.findUnique({ where: { id: wallet.id } });
    return { ledger, wallet: refreshed! };
  });
}

export async function transferEuros(fromOwnerId: string, toOwnerId: string, amountCents: number, note?: string) {
  const amt = Math.max(0, Math.round(amountCents || 0));
  if (!fromOwnerId || !toOwnerId) throw new Error("both ownerIds required");
  if (fromOwnerId === toOwnerId) throw new Error("cannot transfer to same owner");
  if (!amt) throw new Error("amountCents must be > 0");

  return prisma.$transaction(async (tx) => {
    let from = await tx.wallet.findFirst({ where: { ownerId: fromOwnerId, currency: "EUR" } });
    if (!from) from = await tx.wallet.create({ data: { ownerId: fromOwnerId, currency: "EUR" } });
    let to = await tx.wallet.findFirst({ where: { ownerId: toOwnerId, currency: "EUR" } });
    if (!to) to = await tx.wallet.create({ data: { ownerId: toOwnerId, currency: "EUR" } });

    if (from.balanceCents < amt) throw new Error("Insufficient balance");

    const transfer = await tx.walletTransfer.create({
      data: { fromWalletId: from.id, toWalletId: to.id, amountCents: amt, note: note ?? null },
    });

    await tx.walletLedger.create({ data: { walletId: from.id, type: "TRANSFER_OUT" as any, amountCents: amt, note } });
    await tx.wallet.update({ where: { id: from.id }, data: { balanceCents: { decrement: amt } } });

    await tx.walletLedger.create({ data: { walletId: to.id, type: "TRANSFER_IN" as any, amountCents: amt, note } });
    await tx.wallet.update({ where: { id: to.id }, data: { balanceCents: { increment: amt } } });

    return { transfer };
  });
}
