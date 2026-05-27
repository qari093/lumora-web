import { describe, expect, it } from "vitest";
import { privacyDataRights, privacyDataRightsHealthy } from "@/core/zencoin/privacy/privacyDataRights";

describe("Zencoin Pack 19 — Privacy + Data Rights", () => {
  it("supports export and deletion", () => {
    expect(privacyDataRights.exportSystem).toBe(true);
    expect(privacyDataRights.deleteWalletFlow).toBe(true);
  });

  it("supports GDPR handling", () => {
    expect(privacyDataRights.gdprHandling).toBe(true);
  });

  it("supports privacy health", () => {
    expect(privacyDataRightsHealthy()).toBe(true);
  });
});
