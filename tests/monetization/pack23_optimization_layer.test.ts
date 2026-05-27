import { describe, expect, it } from "vitest";
import { assignMonetizationVariant } from "@/src/monetization/optimization/abTest";
import { getVariantTuning } from "@/src/monetization/optimization/tuning";
import { evaluateOptimizationFeedback } from "@/src/monetization/optimization/feedback";
import { applyOptimizationRules } from "@/src/monetization/optimization/rules";
import { validateOptimizationLayer } from "@/src/monetization/optimization/system";

describe("Monetization Pack23 — Optimization Layer", () => {
  it("assigns stable variant", () => {
    const a = assignMonetizationVariant({ userId: "u1" });
    const b = assignMonetizationVariant({ userId: "u1" });

    expect(a).toBe(b);
  });

  it("returns safe tuning parameters", () => {
    const tuning = getVariantTuning("low_frequency");

    expect(tuning.minVideosBetweenAds).toBe(10);
    expect(tuning.maxAdsPerSession).toBe(1);
  });

  it("rolls back degraded experience", () => {
    const feedback = evaluateOptimizationFeedback({
      retentionDelta: -0.1,
      revenueDelta: 0.2,
      skipRateDelta: 0,
    });

    expect(feedback.decision).toBe("rollback");
  });

  it("applies optimization rules", () => {
    expect(applyOptimizationRules({
      decision: "rollback",
      currentAdLoad: 0.4,
    }).nextAdLoad).toBe(0.3);

    expect(applyOptimizationRules({
      decision: "promote",
      currentAdLoad: 0.4,
    }).nextAdLoad).toBe(0.44);
  });

  it("validates full optimization layer", () => {
    const result = validateOptimizationLayer({
      userId: "u1",
      retentionDelta: 0.01,
      revenueDelta: 0.1,
      skipRateDelta: 0,
      currentAdLoad: 0.2,
    });

    expect(result.ok).toBe(true);
    expect(["control", "gentle", "reward_heavy", "low_frequency"]).toContain(result.variant);
  });
});
