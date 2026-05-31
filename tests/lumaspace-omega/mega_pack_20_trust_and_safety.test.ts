import { describe, expect, it } from "vitest";
import { createSafetySignal, signalRequiresReview } from "@/src/core/lumaspace/omega/trust-safety/safetyEngine";
import { createModerationDecision } from "@/src/core/lumaspace/omega/trust-safety/moderationEngine";
import { applySafetySignalToTrust, createTrustProfile } from "@/src/core/lumaspace/omega/trust-safety/trustEngine";
import { runLumaSpaceOmegaMegaPack20Runtime } from "@/src/core/lumaspace/omega/trust-safety/omegaPack20Runtime";

describe("LumaSpace Ω∞ Mega Pack 20 — Trust and Safety", () => {
  it("creates safety signal", () => {
    const signal = createSafetySignal({ id: "s1", targetId: "x", targetType: "signal", severity: "medium", reason: "review" });
    expect(signalRequiresReview(signal)).toBe(true);
  });

  it("creates transparent moderation decision", () => {
    const signal = createSafetySignal({ id: "s2", targetId: "x", targetType: "memory", severity: "high", reason: "unsafe" });
    const decision = createModerationDecision(signal);

    expect(decision.action).toBe("remove");
    expect(decision.transparent).toBe(true);
    expect(decision.appealable).toBe(true);
  });

  it("updates trust from safety signal", () => {
    const profile = createTrustProfile({ citizenId: "u1", trustScore: 80, reliabilityScore: 80 });
    const signal = createSafetySignal({ id: "s3", targetId: "x", targetType: "bridge", severity: "medium", reason: "review" });
    const updated = applySafetySignalToTrust(profile, signal);

    expect(updated.trustScore).toBeLessThan(profile.trustScore);
  });

  it("runs full mega pack runtime", () => {
    expect(runLumaSpaceOmegaMegaPack20Runtime().ok).toBe(true);
  });
});
