import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  computeAdaptiveZone,
  computeGravityAccessibility,
  computeGravityAnimation,
  computeGravityOnboarding,
  computeGravitySafety,
  detectFrustration,
  resolveGravityConflict,
} from "@/src/core/gravity-core";

describe("Gravity Core Mega Pack 3/5", () => {
  it("supports ghost hand onboarding", () => {
    expect(computeGravityOnboarding(0).showGhostHand).toBe(true);
  });

  it("supports adaptive zone scaling", () => {
    expect(computeAdaptiveZone(5).activationZoneScale).toBeGreaterThan(1);
  });

  it("supports conflict resolution", () => {
    expect(resolveGravityConflict(true).yieldedToUI).toBe(true);
  });

  it("supports frustration detection", () => {
    expect(detectFrustration(5, 1000).frustrated).toBe(true);
  });

  it("supports safety accessibility and animation", () => {
    expect(computeGravitySafety().homeButtonVisible).toBe(true);
    expect(computeGravityAccessibility().voiceOverSupported).toBe(true);
    expect(computeGravityAnimation().springEnabled).toBe(true);
  });

  it("mounts ghost hand onboarding", () => {
    const page = fs.readFileSync("app/fyp/page.tsx","utf8");
    expect(page).toContain("GravityCoreGhostHand");
  });
});
