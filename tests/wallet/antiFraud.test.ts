import { describe, expect, it } from "vitest";
import { runWalletAntiFraudChecks } from "@/lib/wallet/antiFraud";

describe("wallet anti-fraud checks", () => {
  it("accepts low-risk transaction", () => {
    const out = runWalletAntiFraudChecks({
      walletId: "wallet_1",
      userId: "user_1",
      amount: 50,
      type: "credit",
      reference: "reward_drop",
      recentTxnCount: 2,
      dailyTotal: 150,
      ipHash: "ip_abc",
      deviceId: "dev_abc",
    });

    expect(out.ok).toBe(true);
    expect(out.riskScore).toBe(0);
  });

  it("flags but allows medium-risk transaction", () => {
    const out = runWalletAntiFraudChecks({
      walletId: "wallet_1",
      userId: "user_1",
      amount: 1200,
      type: "credit",
      reference: "reward_drop",
      recentTxnCount: 5,
      dailyTotal: 1000,
      ipHash: "",
      deviceId: "dev_abc",
    });

    expect(out.ok).toBe(true);
    expect(out.flags).toContain("missing_ip_hash");
    expect(out.riskScore).toBeGreaterThan(0);
  });

  it("blocks high-risk transaction", () => {
    const out = runWalletAntiFraudChecks({
      walletId: "wallet_1",
      userId: "user_1",
      amount: 150000,
      type: "debit",
      reference: "withdraw_large",
      recentTxnCount: 40,
      dailyTotal: 300000,
      ipHash: "",
      deviceId: "",
    });

    expect(out.ok).toBe(false);
    if (!out.ok) {
      expect(out.reason).toBe("fraud_risk_blocked");
      expect(out.riskScore).toBeGreaterThanOrEqual(60);
    }
  });

  it("rejects missing wallet id", () => {
    const out = runWalletAntiFraudChecks({
      walletId: "",
      userId: "user_1",
      amount: 10,
      type: "credit",
      reference: "reward",
    });

    expect(out.ok).toBe(false);
    if (!out.ok) expect(out.reason).toBe("missing_wallet_id");
  });

  it("flags reference/type mismatch", () => {
    const out = runWalletAntiFraudChecks({
      walletId: "wallet_1",
      userId: "user_1",
      amount: 25,
      type: "debit",
      reference: "bonus_reward",
      recentTxnCount: 1,
      dailyTotal: 25,
      ipHash: "ip_1",
      deviceId: "dev_1",
    });

    expect(out.flags).toContain("reference_type_mismatch");
  });
});
