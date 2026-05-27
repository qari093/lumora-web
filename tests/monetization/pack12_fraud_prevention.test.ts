import { describe, expect, it } from "vitest";
import { calculateAnomalyScore } from "@/src/monetization/fraud/anomaly";
import { resolveFraudEscalation } from "@/src/monetization/fraud/escalation";
import { validateMicroInteractionProof } from "@/src/monetization/fraud/microProof";
import { scorePatternRisk } from "@/src/monetization/fraud/patternScore";
import { evaluateFraudPrevention } from "@/src/monetization/fraud/system";

describe("Monetization Pack12 — Fraud Prevention", () => {
  it("calculates anomaly score", () => {
    const score = calculateAnomalyScore({
      repeatedPatternScore: 1,
      impossibleWatchVelocity: 1,
      deviceRiskScore: 0.5,
      rewardClaimVelocity: 0.5,
    });

    expect(score).toBeGreaterThan(0.7);
  });

  it("resolves escalation levels", () => {
    expect(resolveFraudEscalation({ anomalyScore: 0.9, persistentFlags: 0 }).level).toBe("hard_check");
    expect(resolveFraudEscalation({ anomalyScore: 0.6, persistentFlags: 0 }).level).toBe("soft_check");
    expect(resolveFraudEscalation({ anomalyScore: 0.1, persistentFlags: 0 }).level).toBe("none");
  });

  it("validates micro-interaction proof", () => {
    expect(validateMicroInteractionProof({ holdMs: 1500 }).ok).toBe(true);
    expect(validateMicroInteractionProof({ holdMs: 300 }).ok).toBe(false);
  });

  it("scores pattern risk", () => {
    expect(scorePatternRisk({
      identicalIntervals: 9,
      totalEvents: 10,
      uniqueDevices: 1,
      uniqueUsers: 10,
    })).toBeGreaterThan(0.7);
  });

  it("evaluates full fraud prevention flow", () => {
    const result = evaluateFraudPrevention({
      profile: {
        repeatedPatternScore: 0.9,
        impossibleWatchVelocity: 0.8,
        deviceRiskScore: 0.7,
        rewardClaimVelocity: 0.8,
      },
      persistentFlags: 1,
      microHoldMs: 1500,
      pattern: {
        identicalIntervals: 1,
        totalEvents: 10,
        uniqueDevices: 10,
        uniqueUsers: 10,
      },
    });

    expect(result.escalation.level).not.toBe("none");
    expect(result.ok).toBe(true);
  });
});
