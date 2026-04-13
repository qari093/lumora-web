import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateWalletZencoinBaselineVerification } from "@/lib/softlaunch/walletZencoinBaselineVerification";

describe("soft-launch wallet / Zencoin baseline verification", () => {
  it("passes valid wallet baseline set", () => {
    const records = JSON.parse(fs.readFileSync("data/softlaunch/wallet-zencoin-baseline.json", "utf8"));
    const out = evaluateWalletZencoinBaselineVerification({ records });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(3);
      expect(out.verification.healthy).toBe(3);
      expect(out.verification.transferReady).toBe(3);
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects duplicate wallet id", () => {
    const out = evaluateWalletZencoinBaselineVerification({
      records: [
        { walletId: "w1", ownerId: "u1", currency: "ZC", balance: 1, ledgerHealthy: true, transfersEnabled: true },
        { walletId: "w1", ownerId: "u2", currency: "ZC", balance: 2, ledgerHealthy: true, transfersEnabled: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_wallet_id" });
  });

  it("rejects invalid currency", () => {
    const out = evaluateWalletZencoinBaselineVerification({
      records: [
        { walletId: "w1", ownerId: "u1", currency: "USD" as any, balance: 1, ledgerHealthy: true, transfersEnabled: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_currency" });
  });

  it("rejects invalid balance", () => {
    const out = evaluateWalletZencoinBaselineVerification({
      records: [
        { walletId: "w1", ownerId: "u1", currency: "ZC", balance: -1, ledgerHealthy: true, transfersEnabled: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_balance" });
  });
});
