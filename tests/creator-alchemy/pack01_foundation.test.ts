import { describe, expect, it } from "vitest";
import {
  CREATOR_ALCHEMY_RULES,
  DEFAULT_CREATOR_AGENCY,
  scoreResonance,
  validateCreatorAgency,
  validateCreatorAlchemyCopy,
  validateEmotionalDensity,
  validateRuleCoverage
} from "@/src/core/creator-alchemy/foundation";

describe("Creator Alchemy Pack 01 — Foundation Core Ω", () => {
  it("locks the eight immutable rules", () => {
    expect(CREATOR_ALCHEMY_RULES).toHaveLength(8);
    expect(validateRuleCoverage()).toBe(true);
  });

  it("enforces default emotional density", () => {
    expect(validateEmotionalDensity({ majorInsights: 1, atmospheres: 1, symbolicMoments: 1 }).ok).toBe(true);
    expect(validateEmotionalDensity({ majorInsights: 2, atmospheres: 1, symbolicMoments: 1 }).ok).toBe(false);
  });

  it("allows restrained creative intensity mode", () => {
    expect(validateEmotionalDensity({ majorInsights: 3, atmospheres: 1, symbolicMoments: 1, creativeIntensity: true }).ok).toBe(true);
    expect(validateEmotionalDensity({ majorInsights: 4, atmospheres: 1, symbolicMoments: 1, creativeIntensity: true }).ok).toBe(false);
  });

  it("blocks unsafe emotional and economic copy", () => {
    const unsafe = validateCreatorAlchemyCopy("Guaranteed payout. Bet on creator stock. You are depressed.");
    expect(unsafe.ok).toBe(false);
    expect(unsafe.risks).toContain("casino_mechanics");
    expect(unsafe.risks).toContain("surveillance_feel");
  });

  it("keeps creator agency mandatory", () => {
    expect(validateCreatorAgency(DEFAULT_CREATOR_AGENCY)).toBe(true);
    expect(validateCreatorAgency({ ...DEFAULT_CREATOR_AGENCY, canOptOut: false })).toBe(false);
  });

  it("scores resonance without raw casino-style mechanics", () => {
    const result = scoreResonance([
      { signal: "quiet_gift", weight: 3, occurredAt: "2026-01-01T00:00:00.000Z" },
      { signal: "save", weight: 2, occurredAt: "2026-01-01T00:00:00.000Z" },
      { signal: "rewatch", weight: 3, occurredAt: "2026-01-01T00:00:00.000Z" }
    ]);

    expect(result.score).toBeGreaterThan(40);
    expect(["blooming_current", "glowing_river", "resonant_tide"]).toContain(result.symbolicState);
  });
});
