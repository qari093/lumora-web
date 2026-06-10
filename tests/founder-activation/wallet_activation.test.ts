import { describe, expect, it } from "vitest";
import {
  getWalletActivationSummary,
  walletActivationSurfaces
} from "../../src/core/founder-activation/walletActivation";

describe("Wallet founder activation", () => {
  it("provides visible wallet economy surfaces", () => {
    expect(walletActivationSurfaces.length).toBeGreaterThanOrEqual(4);
  });

  it("keeps wallet in founder-safe mode", () => {
    const summary = getWalletActivationSummary();

    expect(summary.status).toBe("WALLET_ZENECONOMY_ACTIVATED_FOR_FOUNDER_REVIEW");
    expect(summary.safeMode).toBe(true);
    expect(summary.walletLive).toBe(false);
    expect(summary.paymentsLive).toBe(false);
    expect(summary.zencoinBridgeLive).toBe(false);
    expect(summary.testerInvitesBlocked).toBe(true);
  });
});
