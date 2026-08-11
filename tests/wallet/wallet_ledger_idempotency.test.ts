import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/prisma';
import { creditWalletOnce } from '@/lib/walletLedger';

describe('wallet ledger idempotency', () => {
  it('credits only once for same (source, refId)', async () => {
    const userId = `test_user_${Date.now()}`;
    const source = 'stripe';
    const refId = `sess_${Date.now()}`;

    await prisma.walletLedger.deleteMany({
      where: {
        refType: source,
        refId,
      },
    });

    await prisma.wallet.deleteMany({
      where: {
        ownerId: userId,
        currency: 'EUR',
      },
    });

    const r1 = await creditWalletOnce({ userId, amount: 10, source, refId });
    expect(r1.ok).toBe(true);

    const bal1 = await prisma.wallet.findUnique({
      where: {
        ownerId_currency: {
          ownerId: userId,
          currency: 'EUR',
        },
      },
    });
    expect(bal1?.balanceCents).toBe(10);

    const r2 = await creditWalletOnce({ userId, amount: 10, source, refId });
    expect(r2.ok).toBe(true);
    expect((r2 as { alreadyApplied?: boolean }).alreadyApplied || false).toBe(true);

    const bal2 = await prisma.wallet.findUnique({
      where: {
        ownerId_currency: {
          ownerId: userId,
          currency: 'EUR',
        },
      },
    });
    expect(bal2?.balanceCents).toBe(10);

    const rows = await prisma.walletLedger.findMany({
      where: {
        refType: source,
        refId,
      },
    });
    expect(rows.length).toBe(1);
    expect(rows[0].amountCents).toBe(10);
    expect(rows[0].type).toBe('CREDIT');
  });
});
