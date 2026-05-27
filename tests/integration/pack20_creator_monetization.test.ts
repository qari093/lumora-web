import { describe, expect, it } from "vitest";
import {
  activateMicroValueWindow,
  addSoftUnlockFlow,
  connectZencoinLayer,
  introduceCreatorLedger,
  validateTrustGatedMonetization,
} from "@/src/lib/integration/creator-monetization";

describe("Pack20 Creator Monetization Activation", () => {
  it("passes trust-gated monetization flow", () => {
    const window = activateMicroValueWindow({ trustScore: 10 });
    const ledger = introduceCreatorLedger("c1", window.open);
    const zencoin = connectZencoinLayer({ creatorId: "c1", ledgerEnabled: ledger.enabled });
    const unlock = addSoftUnlockFlow({ windowOpen: window.open });

    expect(window.open).toBe(true);
    expect(ledger.status).toBe("active");
    expect(zencoin.connected).toBe(true);
    expect(unlock.pressureFree).toBe(true);
    expect(validateTrustGatedMonetization({ window, ledger, zencoin, unlock }).ok).toBe(true);
    expect(validateTrustGatedMonetization({}).ok).toBe(false);
  });
});
