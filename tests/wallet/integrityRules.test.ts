import { describe, expect, it } from "vitest";
import { validateCreditDebitIntegrity } from "@/lib/wallet/integrityRules";

describe("credit / debit integrity rules", () => {
  it("accepts valid credit transition", () => {
    const out = validateCreditDebitIntegrity({
      walletId: "wallet_1",
      type: "credit",
      amount: 25,
      balanceBefore: 75,
      balanceAfter: 100,
      reference: "reward_1",
    });

    expect(out.ok).toBe(true);
  });

  it("accepts valid debit transition", () => {
    const out = validateCreditDebitIntegrity({
      walletId: "wallet_1",
      type: "debit",
      amount: 20,
      balanceBefore: 75,
      balanceAfter: 55,
      reference: "spend_1",
    });

    expect(out.ok).toBe(true);
  });

  it("rejects mismatched balance transition", () => {
    const out = validateCreditDebitIntegrity({
      walletId: "wallet_1",
      type: "credit",
      amount: 20,
      balanceBefore: 75,
      balanceAfter: 96,
      reference: "reward_2",
    });

    expect(out).toEqual({ ok: false, reason: "balance_transition_mismatch" });
  });

  it("rejects debit that increases balance", () => {
    const out = validateCreditDebitIntegrity({
      walletId: "wallet_1",
      type: "debit",
      amount: 10,
      balanceBefore: 50,
      balanceAfter: 60,
      reference: "spend_2",
    });

    expect(out).toEqual({ ok: false, reason: "balance_transition_mismatch" });
  });

  it("rejects missing reference", () => {
    const out = validateCreditDebitIntegrity({
      walletId: "wallet_1",
      type: "credit",
      amount: 10,
      balanceBefore: 50,
      balanceAfter: 60,
      reference: " ",
    });

    expect(out).toEqual({ ok: false, reason: "missing_reference" });
  });
});
