import { prisma } from '@/lib/prisma';

export type CreditOnceResult =
  | {
      ok: true;
      walletId: string;
      userId: string;
      credits: number;
      ledgerId: string;
      alreadyApplied?: false;
    }
  | {
      ok: true;
      walletId: string;
      userId: string;
      credits: number;
      ledgerId: string | null;
      alreadyApplied: true;
    }
  | { ok: false; error: string };

function clampInt(n: number, min: number, max: number) {
  const v = Math.trunc(n);
  return Math.max(min, Math.min(max, v));
}

export async function creditWalletOnce(args: {
  userId: string;
  amount: number;
  source: string;
  refId: string;
}): Promise<CreditOnceResult> {
  try {
    const userId = (args.userId || '').trim();
    const source = (args.source || '').trim();
    const refId = (args.refId || '').trim();
    const amount = clampInt(Number(args.amount || 0), 1, 1_000_000_000);

    if (!userId) return { ok: false, error: 'userId_required' };
    if (!source) return { ok: false, error: 'source_required' };
    if (!refId) return { ok: false, error: 'refId_required' };

    const wallet = await prisma.wallet.upsert({
      where: {
        ownerId_currency: {
          ownerId: userId,
          currency: 'EUR',
        },
      },
      update: {},
      create: {
        ownerId: userId,
        currency: 'EUR',
        balanceCents: 0,
      },
    });

    try {
      const ledger = await prisma.walletLedger.create({
        data: {
          walletId: wallet.id,
          type: 'CREDIT',
          amountCents: amount,
          refType: source,
          refId,
          note: 'wallet_credit_once',
        },
        select: { id: true },
      });

      const updated = await prisma.wallet.update({
        where: { id: wallet.id },
        data: { balanceCents: { increment: amount } },
        select: { id: true, ownerId: true, balanceCents: true },
      });

      return {
        ok: true,
        walletId: updated.id,
        userId: updated.ownerId,
        credits: updated.balanceCents,
        ledgerId: ledger.id,
        alreadyApplied: false,
      };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('Unique constraint failed') || msg.toLowerCase().includes('unique')) {
        const current = await prisma.wallet.findUnique({
          where: { id: wallet.id },
          select: { id: true, ownerId: true, balanceCents: true },
        });

        return {
          ok: true,
          walletId: current?.id || wallet.id,
          userId: current?.ownerId || userId,
          credits: current?.balanceCents ?? wallet.balanceCents,
          ledgerId: null,
          alreadyApplied: true,
        };
      }

      throw e;
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'internal_error';
    return { ok: false, error: msg };
  }
}
