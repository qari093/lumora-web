import { describe, expect, it } from "vitest";
import { validateWalletTransaction } from "@/lib/wallet/transactionValidation";

describe("wallet transaction validation", () => {
  const now = 1_700_000_000_000;

  it("accepts a valid credit transaction", () => {
    const out = validateWalletTransaction(
      {
        walletId: "wallet_1",
        transactionId: "txn_1",
        type: "credit",
        amount: 25.129,
        currency: "zc",
        reference: "reward_drop",
        createdAt: now - 1000,
      },
      now
    );

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.normalized.amount).toBe(25.13);
      expect(out.normalized.currency).toBe("ZC");
    }
  });

  it("rejects missing transaction id", () => {
    const out = validateWalletTransaction(
      {
        walletId: "wallet_1",
        transactionId: " ",
        type: "debit",
        amount: 5,
        currency: "ZC",
        reference: "purchase",
        createdAt: now - 1000,
      },
      now
    );

    expect(out).toEqual({ ok: false, reason: "missing_transaction_id" });
  });

  it("rejects invalid amount", () => {
    const out = validateWalletTransaction(
      {
        walletId: "wallet_1",
        transactionId: "txn_2",
        type: "debit",
        amount: 0,
        currency: "ZC",
        reference: "purchase",
        createdAt: now - 1000,
      },
      now
    );

    expect(out).toEqual({ ok: false, reason: "invalid_amount" });
  });

  it("rejects invalid currency", () => {
    const out = validateWalletTransaction(
      {
        walletId: "wallet_1",
        transactionId: "txn_3",
        type: "credit",
        amount: 10,
        currency: "z!",
        reference: "reward",
        createdAt: now - 1000,
      },
      now
    );

    expect(out).toEqual({ ok: false, reason: "invalid_currency" });
  });

  it("rejects future timestamps", () => {
    const out = validateWalletTransaction(
      {
        walletId: "wallet_1",
        transactionId: "txn_4",
        type: "credit",
        amount: 10,
        currency: "ZC",
        reference: "reward",
        createdAt: now + 120000,
      },
      now
    );

    expect(out).toEqual({ ok: false, reason: "created_at_in_future" });
  });
});
