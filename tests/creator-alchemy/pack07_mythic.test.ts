import { describe, expect, it } from "vitest";
import {
  buildAnnualSymbolConstellation,
  buildOneNightSkyState,
  buildOneTimeMirror,
  canShowMythicEvent,
  createMirrorChamberSession,
  decideFirstLight,
  getMythicCooldownDays
} from "@/src/core/creator-alchemy/mythic";

describe("Creator Alchemy Pack 07 — Mythic Layer Ω", () => {
  it("creates eligible One-Time Mirror only after a full symbolic year", () => {
    const mirror = buildOneTimeMirror({
      creatorId: "creator-1",
      monthsCompleted: 12,
      acceptedSymbols: ["silence", "echo", "bloom", "return", "patience", "softness"],
      quietReturns: 1200,
      totalLingerMinutes: 8400
    });

    expect(mirror.eligible).toBe(true);
    expect(mirror.line).toContain("quiet returns");
  });

  it("keeps annual symbol constellation capped at twelve symbols", () => {
    const constellation = buildAnnualSymbolConstellation([
      "a","b","c","d","e","f","g","h","i","j","k","l","m"
    ]);

    expect(constellation).toHaveLength(12);
  });

  it("creates Mirror Chamber with safe non-judgmental question", () => {
    const session = createMirrorChamberSession({
      works: ["w1", "w2", "w3", "w4"],
      monthsSinceLastSession: 12
    });

    expect(session.eligible).toBe(true);
    expect(session.metricsHidden).toBe(true);
    expect(session.notificationsHidden).toBe(true);
    expect(session.reflectionQuestion).toBe("In this silence, what did you feel about yourself?");
  });

  it("recognizes First Light through community influence path", () => {
    const decision = decideFirstLight({
      creatorId: "c1",
      influencedConstellations: 5,
      influencedCreators: 10,
      structuralNoveltyMonths: 0,
      safetyPassed: true
    });

    expect(decision.eligible).toBe(true);
    expect(decision.path).toBe("community_influence");
  });

  it("recognizes First Light through structural originality path", () => {
    const decision = decideFirstLight({
      creatorId: "c2",
      influencedConstellations: 0,
      influencedCreators: 0,
      structuralNoveltyMonths: 6,
      safetyPassed: true
    });

    expect(decision.eligible).toBe(true);
    expect(decision.path).toBe("structural_originality");
  });

  it("keeps One Night Sky optional and non-blocking", () => {
    const sky = buildOneNightSkyState({
      triggerStrength: 0.9,
      userOptedIn: true,
      requestedDurationMinutes: 10
    });

    expect(sky.active).toBe(true);
    expect(sky.optional).toBe(true);
    expect(sky.blocksCoreUse).toBe(false);
    expect(sky.durationMinutes).toBe(10);
  });

  it("enforces mythic rarity cooldowns", () => {
    expect(getMythicCooldownDays("one_time_mirror")).toBe(365);
    expect(canShowMythicEvent({ type: "one_time_mirror", daysSinceLastShown: 100, emotionalOverloadLevel: "safe" })).toBe(false);
    expect(canShowMythicEvent({ type: "one_time_mirror", daysSinceLastShown: 365, emotionalOverloadLevel: "safe" })).toBe(true);
    expect(canShowMythicEvent({ type: "first_light", daysSinceLastShown: 100, emotionalOverloadLevel: "reduce" })).toBe(false);
  });
});
