import { prisma } from "@/lib/prisma";

export type WalletBalance = { ok: true; userId: string; credits: number; walletId: string };

export type WalletLedgerRow = {
  id: string;
  direction: "credit" | "debit" | string;
  amount: number;
  source: string;
  refId: string;
  createdAt: string;
};

export type WalletHistory = {
  ok: true;
  userId: string;
  items: WalletLedgerRow[];
  nextCursor: string | null;
};

export async function getOrCreateWallet(userId: string) {
  const uid = userId.trim();
  if (!uid) throw new Error("userId_required");
  const w =
    (await prisma.wallet.findUnique({ where: { userId: uid } })) ??
    (await prisma.wallet.create({ data: { userId: uid, credits: 0 } }));
  return w;
}

export async function getWalletBalance(userId: string): Promise<WalletBalance> {
  const w = await getOrCreateWallet(userId);
  return { ok: true, userId: w.userId, credits: w.credits, walletId: w.id };
}

export async function getWalletHistory(opts: {
  userId: string;
  limit?: number;
  cursor?: string | null; // WalletLedger.id
}): Promise<WalletHistory> {
  const userId = opts.userId.trim();
  if (!userId) throw new Error("userId_required");

  const limitRaw = typeof opts.limit === "number" ? opts.limit : 50;
  const limit = Math.max(1, Math.min(200, Math.trunc(limitRaw)));

  const rows = await prisma.walletLedger.findMany({
    where: { userId },
    take: limit + 1,
    ...(opts.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      direction: true,
      amount: true,
      source: true,
      refId: true,
      createdAt: true,
    },
  });

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? page[page.length - 1]?.id ?? null : null;

  return {
    ok: true,
    userId,
    items: page.map((r) => ({
      id: r.id,
      direction: r.direction,
      amount: r.amount,
      source: r.source,
      refId: r.refId,
      createdAt: r.createdAt.toISOString(),
    })),
    nextCursor,
  };
}
