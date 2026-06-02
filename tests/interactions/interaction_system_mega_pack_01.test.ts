import { describe,it,expect } from "vitest";
import { INTERACTIONS } from "@/src/core/interactions/registry";
import { growthCompassEnabled } from "@/src/core/interactions/growthCompass";
import { interactionTelemetryEnabled } from "@/src/core/interactions/telemetry";

describe("Interaction System Mega Pack 01", () => {
  it("contains resonance", () => {
    expect(INTERACTIONS.includes("resonance")).toBe(true);
  });

  it("contains reflection", () => {
    expect(INTERACTIONS.includes("reflection")).toBe(true);
  });

  it("contains ripple", () => {
    expect(INTERACTIONS.includes("ripple")).toBe(true);
  });

  it("enables growth compass", () => {
    expect(growthCompassEnabled).toBe(true);
  });

  it("enables telemetry", () => {
    expect(interactionTelemetryEnabled).toBe(true);
  });
});
