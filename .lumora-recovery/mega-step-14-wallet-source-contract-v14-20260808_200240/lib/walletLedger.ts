import { prisma } from "@/lib/prisma";

export type CreditOnceResult =
  | { ok: true; walletId: string; userId: string; credits: number; ledgerId: string; alreadyApplied?: false }
  | { ok: true; walletId: string; userId: string; credits: number; ledgerId: string | null; alreadyApplied: true }
  | { ok: false; error: string };

function clampInt(n: number, min: number, max: number) {
  const v = Math.trunc(n);
  return Math.max(min, Math.min(max, v));
}

export async function creditWalletOnce(args: {
  userId: string;
  amount: number;
  source: string; // "stripe" | ...
  refId: string;  // stripe session id, etc.
}): Promise<CreditOnceResult> {
  try {
    const userId = (args.userId || "").trim();
    const source = (args.source || "").trim();
    const refId = (args.refId || "").trim();
    const amount = clampInt(Number(args.amount || 0), 1, 1_000_000_000);

    if (!userId) return { ok: false, error: "userId_required" };
    if (!source) return { ok: false, error: "source_required" };
    if (!refId) return { ok: false, error: "refId_required" };

    // Ensure wallet exists
    const wallet =
      (await prisma.wallet.findUnique({ where: { userId } })) ??
      (await prisma.wallet.create({ data: { userId, credits: 0 } }));

    // Idempotency: WalletLedger has @@unique([source, refId]) in your schema.
    // We do: create ledger first; if it already exists, do NOT increment.
    try {
      const ledger = await prisma.walletLedger.create({
        data: {
          walletId: wallet.id,
          userId,
          direction: "credit",
          amount,
          source,
          refId,
        },
        select: { id: true },
      });

      // Apply balance only after ledger row exists (exactly-once)
      const updated = await prisma.wallet.update({
        where: { id: wallet.id },
        data: { credits: { increment: amount } },
        select: { id: true, userId: true, credits: true },
      });

      return {
        ok: true,
        walletId: updated.id,
        userId: updated.userId,
        credits: updated.credits,
        ledgerId: ledger.id,
        alreadyApplied: false,
      };
    } catch (e: any) {
      // Unique violation -> already applied
      const msg = String(e?.message || "");
      if (msg.includes("Unique constraint failed") || msg.toLowerCase().includes("unique")) {
        const current = await prisma.wallet.findUnique({ where: { id: wallet.id }, select: { id: true, userId: true, credits: true } });
        return {
          ok: true,
          walletId: current?.id || wallet.id,
          userId: current?.userId || userId,
          credits: current?.credits ?? wallet.credits,
          ledgerId: null,
          alreadyApplied: true,
        };
      }
      throw e;
    }
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return { ok: false, error: msg };
  }
}
