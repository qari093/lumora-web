import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Wallet + ZenEconomy activation audit", () => {
  it("writes Wallet + ZenEconomy activation audit artifacts", () => {
    expect(fs.existsSync("data/founder-activation/wallet-activation-audit.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/wallet-activation-audit.json")).toBe(true);
    expect(fs.existsSync("docs/founder-activation/wallet-activation-audit.md")).toBe(true);
  });

  it("confirms Wallet + ZenEconomy layer and safety gates", () => {
    const audit = JSON.parse(fs.readFileSync("data/founder-activation/wallet-activation-audit.json", "utf8"));

    expect(audit.status).toBe("PASS");
    expect(audit.checks.pageHasWalletSignals).toBe(true);
    expect(audit.checks.coreHasRuntimeSignals).toBe(true);
    expect(audit.checks.walletLiveOff).toBe(true);
    expect(audit.checks.paymentsLiveOff).toBe(true);
    expect(audit.checks.zencoinBridgeOff).toBe(true);
    expect(audit.checks.testerInvitesBlocked).toBe(true);
    expect(audit.checks.backupLeftoverExists).toBe(false);
  });
});
