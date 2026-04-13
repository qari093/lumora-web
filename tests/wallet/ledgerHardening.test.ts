import { describe, expect, it } from "vitest";
import { createHardenedLedgerEntry } from "@/lib/wallet/ledgerHardening";

describe("zencoin ledger hardening", () => {
  const now = 1_700_000_000_000;

  it("creates a valid credit entry", () => {
    const out = createHardenedLedgerEntry(
      {
        walletId: "wallet_1",
        type: "credit",
        amount: 25,
        balanceBefore: 75,
        reference: "reward_1",
      },
      now
    );

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.entry.balanceAfter).toBe(100);
      expect(out.entry.type).toBe("credit");
      expect(out.entry.createdAt).toBe(now);
    }
  });

  it("creates a valid debit entry", () => {
    const out = createHardenedLedgerEntry(
      {
        walletId: "wallet_1",
        type: "debit",
        amount: 20,
        balanceBefore: 75,
        reference: "spend_1",
      },
      now
    );

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.entry.balanceAfter).toBe(55);
      expect(out.entry.type).toBe("debit");
    }
  });

  it("rejects overdraft", () => {
    const out = createHardenedLedgerEntry(
      {
        walletId: "wallet_1",
        type: "debit",
        amount: 100,
        balanceBefore: 10,
        reference: "spend_2",
      },
      now
    );

    expect(out).toEqual({ ok: false, reason: "insufficient_balance" });
  });

  it("rejects invalid amount", () => {
    const out = createHardenedLedgerEntry(
      {
        walletId: "wallet_1",
        type: "credit",
        amount: 0,
        balanceBefore: 10,
        reference: "reward_2",
      },
      now
    );

    expect(out).toEqual({ ok: false, reason: "invalid_amount" });
  });

  it("rejects missing reference", () => {
    const out = createHardenedLedgerEntry(
      {
        walletId: "wallet_1",
        type: "credit",
        amount: 10,
        balanceBefore: 10,
        reference: " ",
      },
      now
    );

    expect(out).toEqual({ ok: false, reason: "missing_reference" });
  });
});
