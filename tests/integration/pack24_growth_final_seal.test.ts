import { describe, expect, it } from "vitest";
import {
  addABTestingHook,
  optimizeOnboardingFlow,
  sealLumoraIntegration,
  testRetentionVariation,
  tuneEmotionalTrigger,
  validateGrowthLoops,
} from "@/src/lib/integration/growth-experimentation";

describe("Pack24 Growth + Final Seal", () => {
  it("passes growth and final seal flow", () => {
    const ab = addABTestingHook({ experimentId: "creator-onboarding-v1", variant: "A" });
    const retention = testRetentionVariation({ baseline: 0.2, variant: 0.25 });
    const onboarding = optimizeOnboardingFlow({ completionRate: 0.7 });
    const trigger = tuneEmotionalTrigger({ trigger: "quiet-memory-return", safe: true });
    const seal = sealLumoraIntegration();

    expect(ab.active).toBe(true);
    expect(retention.improved).toBe(true);
    expect(onboarding.ok).toBe(true);
    expect(trigger.enabled).toBe(true);
    expect(validateGrowthLoops({ ab, retention, onboarding, trigger }).ok).toBe(true);
    expect(seal.complete).toBe(true);
    expect(seal.totalSteps).toBe(120);
    expect(seal.totalPacks).toBe(24);
    expect(seal.sealed).toBe(true);
  });
});
