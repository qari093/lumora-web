import { describe, expect, it } from "vitest";
import {
  getNexaActivationSummary,
  nexaActivationModules
} from "../../src/core/founder-activation/nexaActivation";

describe("NEXA founder activation", () => {
  it("provides visible NEXA founder modules", () => {
    expect(nexaActivationModules.length).toBeGreaterThanOrEqual(4);
    expect(nexaActivationModules.some((module) => module.mode === "guidance")).toBe(true);
    expect(nexaActivationModules.some((module) => module.mode === "wellbeing")).toBe(true);
    expect(nexaActivationModules.some((module) => module.mode === "creation")).toBe(true);
    expect(nexaActivationModules.some((module) => module.mode === "trust")).toBe(true);
  });

  it("keeps NEXA in founder-safe mode", () => {
    const summary = getNexaActivationSummary();

    expect(summary.status).toBe("NEXA_ACTIVATED_FOR_FOUNDER_REVIEW");
    expect(summary.safeMode).toBe(true);
    expect(summary.aiAutonomyEnabled).toBe(false);
    expect(summary.medicalClaimsEnabled).toBe(false);
    expect(summary.testerInvitesBlocked).toBe(true);
  });
});
