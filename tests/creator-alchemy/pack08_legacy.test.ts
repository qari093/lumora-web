import { describe, expect, it } from "vitest";
import {
  buildFadingLamp,
  buildLastLightState,
  buildLumoraLetter,
  buildMemorialGardenState,
  canResurfaceLegacyWork,
  canUseVoiceWill,
  createLegacyTrailPolicy,
  createVoiceWill,
  validateMemorialRequest
} from "@/src/core/creator-alchemy/legacy";

describe("Creator Alchemy Pack 08 — Emotional Legacy Ω", () => {
  it("allows resurfacing only creator-approved legacy works", () => {
    const policy = createLegacyTrailPolicy({
      creatorId: "creator-1",
      allowedWorkIds: ["w1", "w2"],
      blockedWorkIds: ["w2"]
    });

    expect(canResurfaceLegacyWork(policy, "w1")).toBe(true);
    expect(canResurfaceLegacyWork(policy, "w2")).toBe(false);
    expect(canResurfaceLegacyWork(policy, "w3")).toBe(false);
  });

  it("creates Voice Will only with explicit enablement and selected works", () => {
    const voiceWill = createVoiceWill({
      creatorId: "creator-1",
      enabled: true,
      selectedWorkIds: ["w1", "w1", "w2"],
      approvedAt: "2026-01-01T00:00:00.000Z"
    });

    expect(voiceWill.selectedWorkIds).toEqual(["w1", "w2"]);
    expect(canUseVoiceWill(voiceWill)).toBe(true);
  });

  it("never auto-activates Memorial Garden without verified approval", () => {
    const denied = buildMemorialGardenState({
      creatorId: "creator-1",
      creatorApproved: false,
      verifiedFamilyApproval: false
    });

    const approved = buildMemorialGardenState({
      creatorId: "creator-1",
      creatorApproved: false,
      verifiedFamilyApproval: true
    });

    expect(denied.active).toBe(false);
    expect(validateMemorialRequest({ creatorId: "creator-1", creatorApproved: false, verifiedFamilyApproval: false })).toBe(false);
    expect(approved.active).toBe(true);
    expect(approved.monetized).toBe(false);
    expect(approved.allowedGestures).toContain("remembrance_flower");
  });

  it("builds Lumora Letter from safe anonymous gratitude only", () => {
    const letter = buildLumoraLetter({
      creatorId: "creator-1",
      anniversaryEligible: true,
      anonymousLines: [
        "Your work made quiet evenings softer.",
        "I returned when I needed calm.",
        "Your voice helped me pause.",
        "Come back, we need you."
      ]
    });

    expect(letter.eligible).toBe(true);
    expect(letter.lines).toHaveLength(3);
    expect(letter.lines.join(" ")).not.toContain("Come back");
  });

  it("shows Fading Lamp without blocking creator exit", () => {
    const lamp = buildFadingLamp(true);
    expect(lamp.shown).toBe(true);
    expect(lamp.blocksExit).toBe(false);
    expect(lamp.message).toContain("light remains");
  });

  it("keeps Last Light opt-in and non-guilt-based", () => {
    const hidden = buildLastLightState({
      creatorInactiveDays: 120,
      creatorOptedIntoPresenceMemory: false
    });

    const visible = buildLastLightState({
      creatorInactiveDays: 120,
      creatorOptedIntoPresenceMemory: true
    });

    expect(hidden.visible).toBe(false);
    expect(visible.visible).toBe(true);
    expect(visible.guiltPressure).toBe(false);
  });
});
