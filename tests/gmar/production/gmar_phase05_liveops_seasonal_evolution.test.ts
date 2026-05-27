import { describe, expect, it } from "vitest";
import {
  calculateEventWindow,
  gmarSeasonEventTypes,
  resolveHotfixAction,
  resolveSeasonEvent,
  validateGmarLiveOpsSeasonalEvolution,
  validateSeasonReset
} from "../../../src/core/gmar/production/liveops-evolution/liveopsSeasonalEvolution";

describe("GMAR Production Phase 5 — LiveOps & Seasonal Evolution", () => {
  it("validates LiveOps seasonal evolution contract", () => {
    expect(validateGmarLiveOpsSeasonalEvolution()).toBe(true);
    expect(gmarSeasonEventTypes).toContain("world_mutation");
    expect(gmarSeasonEventTypes).toContain("anniversary");
  });

  it("resolves season event governance", () => {
    expect(resolveSeasonEvent("global").governanceRequired).toBe(true);
    expect(resolveSeasonEvent("limited").governanceRequired).toBe(false);
    expect(resolveSeasonEvent("anniversary").highImpact).toBe(true);
  });

  it("validates safe event windows", () => {
    expect(calculateEventWindow(48).valid).toBe(true);
    expect(calculateEventWindow(8).scarcitySafe).toBe(false);
    expect(calculateEventWindow(240).fatigueSafe).toBe(false);
  });

  it("resolves hotfix actions", () => {
    expect(resolveHotfixAction({ severity: "critical", liveUsers: 10 })).toBe("rollback");
    expect(resolveHotfixAction({ severity: "high", liveUsers: 2000 })).toBe("hotfix_now");
    expect(resolveHotfixAction({ severity: "low", liveUsers: 5000 })).toBe("monitor");
  });

  it("validates trust-safe seasonal reset", () => {
    expect(validateSeasonReset({ preservesCosmetics: true, preservesPaidItems: true, resetsRank: true }).ok).toBe(true);
    expect(validateSeasonReset({ preservesCosmetics: true, preservesPaidItems: false, resetsRank: true }).userTrustSafe).toBe(false);
  });
});
