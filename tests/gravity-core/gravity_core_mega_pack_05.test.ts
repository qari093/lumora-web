import { describe, expect, it } from "vitest";
import {
  gravityAccuracyValidation,
  gravityAssistedModeReadiness,
  gravityDiscoverabilityValidation,
  gravityFrustrationValidation
} from "@/src/core/gravity-core";

describe("Gravity Core Mega Pack 5/5", () => {
  it("locks accuracy at 95 percent", () => {
    expect(gravityAccuracyValidation(96,100).locked).toBe(true);
  });

  it("validates discoverability", () => {
    expect(gravityDiscoverabilityValidation(0.7).passed).toBe(true);
  });

  it("validates frustration thresholds", () => {
    expect(gravityFrustrationValidation(0.05).passed).toBe(true);
  });

  it("keeps assisted mode disabled", () => {
    expect(gravityAssistedModeReadiness().assistedModeUnlocked).toBe(false);
  });

  it("requires telemetry proof before assisted mode", () => {
    expect(gravityAssistedModeReadiness().telemetryRequired).toBe(true);
  });
});
