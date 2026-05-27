import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  buildDefaultFinalReadinessReport,
  decideFinalTuning,
  runFinalCreatorAlchemyReadiness
} from "@/src/core/creator-alchemy/final-readiness";

describe("Phase 12 — Final Civilization Readiness Ω", () => {
  it("passes default final readiness", () => {
    const report = buildDefaultFinalReadinessReport();

    expect(report.ok).toBe(true);
    expect(report.status).toBe("POST_SEAL_READY");
    expect(report.failed).toHaveLength(0);
  });

  it("detects blocked readiness", () => {
    const report = runFinalCreatorAlchemyReadiness({
      emotionalDensitySafe: true,
      atmosphereTuned: true,
      whisperRaritySafe: false,
      dreamCadenceSafe: true,
      economyPacingSafe: true,
      fypSyncSafe: true,
      creatorTrustSafe: true,
      costControlsSafe: true,
      humanRealityReady: true
    });

    expect(report.ok).toBe(false);
    expect(report.failed).toContain("whisperRaritySafe");
  });

  it("decides final tuning needs", () => {
    const tuning = decideFinalTuning({
      overloadRate: 0.2,
      whisperOpenRate: 0.2,
      dreamParticipationRate: 0.1,
      economyPressure: 0.8
    });

    expect(tuning.reduceWhispers).toBe(true);
    expect(tuning.softenAtmosphere).toBe(true);
    expect(tuning.slowDreamCadence).toBe(true);
    expect(tuning.throttleEconomy).toBe(true);
  });

  it("creates final readiness API route", () => {
    expect(existsSync("app/api/creator-alchemy/final-readiness/route.ts")).toBe(true);
    expect(readFileSync("app/api/creator-alchemy/final-readiness/route.ts", "utf8")).toContain("buildDefaultFinalReadinessReport");
  });
});
