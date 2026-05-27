import { describe, expect, it } from "vitest";
import { buildZenWalletDashboardModel } from "@/src/core/zenwallet/ux/dashboardModel";

describe("ZenWallet Pack 15 — Dashboard + UX", () => {
  it("builds desktop and mobile dashboard identities", () => {
    const model = buildZenWalletDashboardModel();
    expect(model.desktop).toBe("ZenSanctuary Flawless Global");
    expect(model.mobile).toBe("Flawless Compass");
  });

  it("keeps refund credit visually separate", () => {
    const model = buildZenWalletDashboardModel();
    expect(model.balances.refundCredit.visual).toContain("lock");
  });

  it("includes calm critical states", () => {
    const model = buildZenWalletDashboardModel();
    expect(model.statusCopy.chargebackReview).toContain("under review");
  });
});
