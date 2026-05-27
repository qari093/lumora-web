import { describe, expect, it } from "vitest";
import { calculateModerationSeverity } from "../../src/live/moderation/moderationCore";
import { evaluateLiveGuardian } from "../../src/live/guardian/liveGuardianCore";
import { createSilentAura } from "../../src/live/guardian/silentAuraCore";

describe("Lumora Live Pack 11 — Trust & Moderation", () => {
  it("classifies moderation severity", () => {
    expect(calculateModerationSeverity({
      toxicity: 90,
      harassment: 90,
      escalation: 90,
      culturalRisk: 40,
    })).toBe("critical");

    expect(calculateModerationSeverity({
      toxicity: 5,
      harassment: 5,
      escalation: 5,
      culturalRisk: 5,
    })).toBe("low");
  });

  it("prompts Live Guardian only during high emotional escalation", () => {
    expect(evaluateLiveGuardian({
      emotionalIntensity: 90,
      speakerStress: 80,
      conflictVelocity: 70,
    }).shouldPrompt).toBe(true);

    expect(evaluateLiveGuardian({
      emotionalIntensity: 20,
      speakerStress: 15,
      conflictVelocity: 10,
    }).shouldPrompt).toBe(false);
  });

  it("creates Silent Aura visible only to host and moderators", () => {
    expect(createSilentAura("u1", "r1").visibleTo).toBe("host_and_moderators");
  });
});
