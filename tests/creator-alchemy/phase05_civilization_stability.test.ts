import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  buildCivilizationStabilityReport,
  evaluateGovernanceSafety,
  evaluateInfrastructureSafety,
  shouldThrottleRuntime
} from "@/src/core/creator-alchemy/civilization-stability";

describe("Phase 05 — Civilization Stability Ω", () => {
  it("passes clean governance safety", () => {
    const result = evaluateGovernanceSafety({
      diagnosticLanguage: 0,
      guiltPressure: 0,
      casinoRisk: 0,
      creatorBurnoutRisk: 0.1,
      consentRisk: 0,
      manipulationRisk: 0
    });

    expect(result.ok).toBe(true);
    expect(result.reasons).toHaveLength(0);
  });

  it("blocks risky governance signals", () => {
    const result = evaluateGovernanceSafety({
      diagnosticLanguage: 1,
      guiltPressure: 0.4,
      casinoRisk: 1,
      creatorBurnoutRisk: 0.8,
      consentRisk: 1,
      manipulationRisk: 0.4
    });

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("casino_risk_detected");
    expect(result.reasons).toContain("consent_risk_detected");
  });

  it("passes healthy infrastructure", () => {
    const result = evaluateInfrastructureSafety({
      batchJobLoad: 0.3,
      cacheHitRatio: 0.8,
      queueDepth: 10,
      liveRoomLoad: 0.4,
      runtimeCostPressure: 0.3
    });

    expect(result.ok).toBe(true);
  });

  it("detects runtime throttling pressure", () => {
    expect(
      shouldThrottleRuntime({
        batchJobLoad: 0.9,
        cacheHitRatio: 0.8,
        queueDepth: 10,
        liveRoomLoad: 0.4,
        runtimeCostPressure: 0.3
      })
    ).toBe(true);
  });

  it("builds civilization stability report", () => {
    const report = buildCivilizationStabilityReport({
      governance: {
        diagnosticLanguage: 0,
        guiltPressure: 0,
        casinoRisk: 0,
        creatorBurnoutRisk: 0.1,
        consentRisk: 0,
        manipulationRisk: 0
      },
      infrastructure: {
        batchJobLoad: 0.3,
        cacheHitRatio: 0.8,
        queueDepth: 10,
        liveRoomLoad: 0.4,
        runtimeCostPressure: 0.3
      }
    });

    expect(report.level).toBe("stable");
    expect(report.governanceSafe).toBe(true);
    expect(report.infrastructureSafe).toBe(true);
  });

  it("creates civilization stability API route", () => {
    expect(existsSync("app/api/creator-alchemy/civilization-stability/route.ts")).toBe(true);
    expect(readFileSync("app/api/creator-alchemy/civilization-stability/route.ts", "utf8")).toContain("buildCivilizationStabilityReport");
  });
});
