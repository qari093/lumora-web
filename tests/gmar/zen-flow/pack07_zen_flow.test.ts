import { describe, expect, it } from "vitest";

import {
  createZenFlowSession,
  zenFlowSessionHealthy,
} from "../../../src/core/gmar/zen-flow/session";

import {
  createBreathPulse,
  breathPulseHealthy,
} from "../../../src/core/gmar/zen-flow/breath";

import {
  createZenFlowProgress,
} from "../../../src/core/gmar/zen-flow/progression";

import {
  createZenFlowRestoration,
} from "../../../src/core/gmar/zen-flow/restoration";

import {
  createZenFlowFirstEchoBridge,
} from "../../../src/core/gmar/zen-flow/firstEchoBridge";

describe("GMAR Pack 07 — Zen Flow", () => {
  it("creates launch-safe Zen Flow session", () => {
    const session = createZenFlowSession();

    expect(zenFlowSessionHealthy(session)).toBe(true);
    expect(session.scoringEnabled).toBe(false);
    expect(session.stressPressure).toBe(false);
  });

  it("creates soft breath pulse", () => {
    const pulse = createBreathPulse();

    expect(breathPulseHealthy(pulse)).toBe(true);
    expect(pulse.intensity).toBe("soft");
  });

  it("creates ethical calm progression", () => {
    const progress = createZenFlowProgress(3);

    expect(progress.unlocksDailySpark).toBe(true);
    expect(progress.unlocksFirstLightRevisit).toBe(true);
    expect(progress.calmContinuity).toBeGreaterThan(0);
  });

  it("contributes to Mirror Hour without power reward", () => {
    const restoration = createZenFlowRestoration(10);

    expect(restoration.contributesToMirrorHour).toBe(true);
    expect(restoration.restorationPoints).toBeGreaterThan(0);
    expect(restoration.grantsPower).toBe(false);
  });

  it("bridges First Echo Rite into Zen Flow", () => {
    const bridge = createZenFlowFirstEchoBridge();

    expect(bridge.createsFirstLight).toBe(true);
    expect(bridge.routeAfterRite).toBe("/gmar/zen-flow");
    expect(bridge.emotionalPayoff).toBe("arrival_star");
  });
});
