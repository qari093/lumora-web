import { describe, it, expect } from "vitest";

import {
  evaluateFypBetaReadiness
} from "../../../src/core/fyp/beta/betaReadinessGate";

import {
  evaluateFypCostGuard
} from "../../../src/core/fyp/beta/costGuard";

import {
  evaluateFypBetaLaunchContract
} from "../../../src/core/fyp/beta/betaLaunchContract";

describe("FYP Omega Pack 19", () => {
  it("passes beta readiness when all hard gates are satisfied", () => {
    const result = evaluateFypBetaReadiness({
      verifiedVideos: 1500,
      lanesWithAtLeast100: 6,
      playbackFailureRate: 0.005,
      legalAllowlistReady: true,
      moderationReady: true,
      rollbackReady: true,
      fallbackReady: true,
      deviceRealityReady: true
    });

    expect(result.ok).toBe(true);
  });

  it("fails beta readiness when video pool is too small", () => {
    const result = evaluateFypBetaReadiness({
      verifiedVideos: 500,
      lanesWithAtLeast100: 6,
      playbackFailureRate: 0.005,
      legalAllowlistReady: true,
      moderationReady: true,
      rollbackReady: true,
      fallbackReady: true,
      deviceRealityReady: true
    });

    expect(result.ok).toBe(false);
    expect(result.failures).toContain("verified_video_pool_below_1500");
  });

  it("warns when cost exceeds budget", () => {
    const result = evaluateFypCostGuard({
      estimatedMonthlyEgressUsd: 650,
      monthlyBudgetUsd: 500,
      estimatedCostPerBetaUserUsd: 0.2
    });

    expect(result.ok).toBe(false);
    expect(result.warnings).toContain("monthly_egress_budget_exceeded");
  });

  it("passes full beta launch contract", () => {
    const result = evaluateFypBetaLaunchContract(
      {
        verifiedVideos: 1500,
        lanesWithAtLeast100: 6,
        playbackFailureRate: 0.005,
        legalAllowlistReady: true,
        moderationReady: true,
        rollbackReady: true,
        fallbackReady: true,
        deviceRealityReady: true
      },
      {
        estimatedMonthlyEgressUsd: 250,
        monthlyBudgetUsd: 500,
        estimatedCostPerBetaUserUsd: 0.12
      }
    );

    expect(result.ok).toBe(true);
    expect(result.readinessFailures.length).toBe(0);
    expect(result.costWarnings.length).toBe(0);
  });
});
