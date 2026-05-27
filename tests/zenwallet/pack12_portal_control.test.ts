import { describe, expect, it } from "vitest";
import { authorizePortalSpend, PORTAL_POLICIES } from "@/src/core/zenwallet/portals/portalControl";

describe("ZenWallet Pack 12 — Portal Control Center", () => {
  it("defines portal policies", () => {
    expect(PORTAL_POLICIES.fyp.allowsRankingBoost).toBe(false);
    expect(PORTAL_POLICIES.gmar.allowsPayToWin).toBe(false);
  });

  it("authorizes within cap", () => {
    expect(authorizePortalSpend("fyp", 10).ok).toBe(true);
  });

  it("blocks ZenLock and cap violations", () => {
    expect(authorizePortalSpend("fyp", 10, true).reason).toBe("zenlock_enabled");
    expect(authorizePortalSpend("live", 999).reason).toBe("daily_cap_exceeded");
  });
});
