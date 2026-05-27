import { createGmarZencoinWallet } from "@/src/core/gmar/economy-active/zencoin";

import {
  spendGmarZencoin,
  refundGmarZencoin,
  assertGmarEconomyTransaction
} from "@/src/core/gmar/final-completion/economy/economyHardening";

describe("GMAR Final Completion Phase 07 — Economy Hardening", () => {
  it("spends Zencoin atomically with fraud and duplicate protection", () => {
    const wallet = {
      ...createGmarZencoinWallet({
        playerId: "gmar_user_001",
        now: new Date("2026-05-09T00:00:00.000Z")
      }),
      balance: 50,
      earnedTotal: 50
    };

    const result = spendGmarZencoin({
      wallet,
      amount: 15,
      reason: "Buy cosmetic",
      transactionId: "tx_spend_001",
      now: new Date("2026-05-09T00:01:00.000Z")
    });

    expect(result.wallet.balance).toBe(35);
    expect(result.wallet.spentTotal).toBe(15);
    expect(result.transaction.type).toBe("spend");
    expect(result.transaction.atomic).toBe(true);
    expect(result.transaction.duplicateProtected).toBe(true);
    expect(result.transaction.fraudChecked).toBe(true);
    expect(assertGmarEconomyTransaction(result)).toBe(true);
  });

  it("refunds Zencoin safely", () => {
    const wallet = {
      ...createGmarZencoinWallet({
        playerId: "gmar_user_001"
      }),
      balance: 10
    };

    const result = refundGmarZencoin({
      wallet,
      amount: 5,
      reason: "Refund",
      transactionId: "tx_refund_001"
    });

    expect(result.wallet.balance).toBe(15);
    expect(result.transaction.type).toBe("refund");
    expect(assertGmarEconomyTransaction(result)).toBe(true);
  });

  it("blocks duplicate spend transaction", () => {
    const wallet = {
      ...createGmarZencoinWallet({
        playerId: "gmar_user_001"
      }),
      balance: 50
    };

    expect(() =>
      spendGmarZencoin({
        wallet,
        amount: 10,
        reason: "Duplicate",
        transactionId: "tx_dup",
        existingTransactionIds: ["tx_dup"]
      })
    ).toThrow("GMAR economy duplicate transaction blocked.");
  });

  it("blocks insufficient balance", () => {
    const wallet = createGmarZencoinWallet({
      playerId: "gmar_user_001"
    });

    expect(() =>
      spendGmarZencoin({
        wallet,
        amount: 10,
        reason: "Too much",
        transactionId: "tx_low_balance"
      })
    ).toThrow("GMAR economy insufficient balance.");
  });
});
