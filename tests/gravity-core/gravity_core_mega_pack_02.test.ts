import fs from "node:fs";
import { describe, expect, it, beforeEach } from "vitest";
import {
  clearGravityShadowTelemetryEvents,
  computeGravityFeedback,
  computeGravityIntent,
  computeGravityVisualField,
  createGravityShadowTelemetryEvent,
  getGravityShadowTelemetryEvents,
  recordGravityShadowTelemetry,
} from "@/src/core/gravity-core";

describe("Gravity Core Mega Pack 2/5", () => {
  beforeEach(() => {
    clearGravityShadowTelemetryEvents();
  });

  it("computes visual field from shadow intent", () => {
    const result = computeGravityIntent({
      previous: { scrollY: 700, maxScrollY: 1000, timestamp: 1000, viewportHeight: 800, documentHeight: 1800 },
      current: { scrollY: 990, maxScrollY: 1000, timestamp: 1100, viewportHeight: 800, documentHeight: 1800 },
      repeatedAttempts: 4,
      hesitationMs: 900,
    });

    const visual = computeGravityVisualField(result);

    expect(visual.vignetteIntensity).toBeGreaterThan(0);
    expect(visual.ringScale).toBeGreaterThan(0.7);
    expect(typeof visual.ringVisible).toBe("boolean");
  });

  it("computes shadow feedback without navigation", () => {
    const result = computeGravityIntent({
      previous: { scrollY: 800, maxScrollY: 1000, timestamp: 1000, viewportHeight: 800, documentHeight: 1800 },
      current: { scrollY: 995, maxScrollY: 1000, timestamp: 1100, viewportHeight: 800, documentHeight: 1800 },
      repeatedAttempts: 5,
      hesitationMs: 900,
    });

    const feedback = computeGravityFeedback(result);

    expect(result.shouldNavigate).toBe(false);
    expect(feedback.label).not.toBe("none");
  });

  it("records bounded shadow telemetry", () => {
    const result = computeGravityIntent({
      current: { scrollY: 995, maxScrollY: 1000, timestamp: 1100, viewportHeight: 800, documentHeight: 1800 },
      repeatedAttempts: 5,
      hesitationMs: 900,
    });

    recordGravityShadowTelemetry(createGravityShadowTelemetryEvent("gesture_attempt", result));

    const events = getGravityShadowTelemetryEvents();
    expect(events.length).toBe(1);
    expect(events[0].type).toBe("gesture_attempt");
    expect(events[0].shadowOnly).toBe(true);
  });

  it("exports new shadow experience modules", async () => {
    const index = fs.readFileSync("src/core/gravity-core/index.ts", "utf8");
    expect(index).toContain("shadowTelemetry");
    expect(index).toContain("visualField");
    expect(index).toContain("feedback");
  });

  it("mounts shadow experience on FYP", () => {
    const page = fs.readFileSync("app/fyp/page.tsx", "utf8");
    const component = fs.readFileSync("components/fyp/GravityCoreShadowExperience.tsx", "utf8");

    expect(page).toContain("GravityCoreShadowExperience");
    expect(component).toContain("data-gravity-core-shadow-experience");
    expect(component).toContain("Pull to return");
  });
});
