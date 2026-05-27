import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  createBetaCreatorSignal,
  decideCivilizationTuning,
  validatePrivateBetaCivilization
} from "@/src/core/creator-alchemy/private-beta";

describe("Phase 06 — Private Beta Civilization Ω", () => {
  it("normalizes beta creator signals", () => {
    const signal = createBetaCreatorSignal({
      creatorId: "beta-1",
      retentionDays: -1,
      whisperUsefulRate: 2,
      emotionalOverloadReports: -1,
      quietGiftUsage: 5,
      dreamChamberParticipation: 2,
      burnoutRecoverySuccess: 1.5,
      trustScore: 0.9
    });

    expect(signal.retentionDays).toBe(0);
    expect(signal.whisperUsefulRate).toBe(1);
    expect(signal.emotionalOverloadReports).toBe(0);
    expect(signal.burnoutRecoverySuccess).toBe(1);
  });

  it("validates healthy private beta cohort", () => {
    const signals = Array.from({ length: 12 }, (_, index) =>
      createBetaCreatorSignal({
        creatorId: `beta-${index + 1}`,
        retentionDays: 14,
        whisperUsefulRate: 0.72,
        emotionalOverloadReports: 0,
        quietGiftUsage: 4,
        dreamChamberParticipation: 2,
        burnoutRecoverySuccess: 0.8,
        trustScore: 0.82
      })
    );

    const report = validatePrivateBetaCivilization(signals);

    expect(report.status).toBe("healthy");
    expect(report.readyForExpandedBeta).toBe(true);
  });

  it("detects tuning needs", () => {
    const report = validatePrivateBetaCivilization([
      createBetaCreatorSignal({
        creatorId: "beta-low",
        retentionDays: 3,
        whisperUsefulRate: 0.2,
        emotionalOverloadReports: 3,
        quietGiftUsage: 0,
        dreamChamberParticipation: 0,
        burnoutRecoverySuccess: 0.1,
        trustScore: 0.3
      })
    ]);

    const tuning = decideCivilizationTuning(report);

    expect(report.readyForExpandedBeta).toBe(false);
    expect(tuning.tuneWhispers).toBe(true);
    expect(tuning.tuneDensity).toBe(true);
  });

  it("creates private beta API route", () => {
    expect(existsSync("app/api/creator-alchemy/private-beta/route.ts")).toBe(true);
    expect(readFileSync("app/api/creator-alchemy/private-beta/route.ts", "utf8")).toContain("validatePrivateBetaCivilization");
  });
});
