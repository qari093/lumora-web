import { describe, expect, it } from "vitest";
import {
  detectMetaShift,
  gmarBalanceSignals,
  resolveBalanceAction,
  scoreFrustration,
  validateExperiment,
  validateGmarTelemetryBalancing
} from "../../../src/core/gmar/production/telemetry-balancing/realPlayerBalancing";

describe("GMAR Production Phase 6 — Telemetry & Real Player Balancing", () => {
  it("validates telemetry balancing contract", () => {
    expect(validateGmarTelemetryBalancing()).toBe(true);
    expect(gmarBalanceSignals).toContain("rage_quit");
    expect(gmarBalanceSignals).toContain("economy_inflation");
  });

  it("scores frustration deterministically", () => {
    expect(scoreFrustration({ losses: 1, retries: 1, sessionMinutes: 10 })).toBe(20);
    expect(scoreFrustration({ losses: 8, retries: 2, sessionMinutes: 2 })).toBe(100);
  });

  it("resolves balance actions", () => {
    expect(resolveBalanceAction(90)).toBe("urgent_tune");
    expect(resolveBalanceAction(70)).toBe("shadow_test");
    expect(resolveBalanceAction(20)).toBe("stable");
  });

  it("detects meta shifts", () => {
    expect(detectMetaShift({ usagePercent: 50, winRate: 60 }).detected).toBe(true);
    expect(detectMetaShift({ usagePercent: 20, winRate: 70 }).detected).toBe(false);
  });

  it("validates safe experiments", () => {
    expect(validateExperiment({ sampleSize: 1000, rollbackReady: true, userTrustSafe: true }).ok).toBe(true);
    expect(validateExperiment({ sampleSize: 100, rollbackReady: true, userTrustSafe: true }).ok).toBe(false);
    expect(validateExperiment({ sampleSize: 1000, rollbackReady: false, userTrustSafe: true }).productionSafe).toBe(false);
  });
});
