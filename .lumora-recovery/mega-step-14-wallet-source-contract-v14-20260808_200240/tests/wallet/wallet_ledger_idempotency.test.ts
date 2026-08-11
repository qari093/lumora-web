import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";
import { creditWalletOnce } from "@/lib/walletLedger";

describe("wallet ledger idempotency", () => {
  it("credits only once for same (source, refId)", async () => {
    const userId = `test_user_${Date.now()}`;
    const source = "stripe";
    const refId = `sess_${Date.now()}`;

    // Clean any possible leftovers (shouldn't exist)
    await prisma.walletLedger.deleteMany({ where: { userId, source, refId } });
    await prisma.wallet.deleteMany({ where: { userId } });

    const r1 = await creditWalletOnce({ userId, amount: 10, source, refId });
    expect(r1.ok).toBe(true);

    const bal1 = await prisma.wallet.findUnique({ where: { userId } });
    expect(bal1?.credits).toBe(10);

    const r2 = await creditWalletOnce({ userId, amount: 10, source, refId });
    expect(r2.ok).toBe(true);
    expect((r2 as any).alreadyApplied || false).toBe(true);

    const bal2 = await prisma.wallet.findUnique({ where: { userId } });
    expect(bal2?.credits).toBe(10);

    const rows = await prisma.walletLedger.findMany({ where: { userId, source, refId } });
    expect(rows.length).toBe(1);
    expect(rows[0].amount).toBe(10);
    expect(rows[0].direction).toBe("credit");
  });
});
