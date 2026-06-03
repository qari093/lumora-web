import { describe, expect, it } from "vitest";
import {
  createHomeBeaconReliabilitySeal,
  getHomeBeaconAccessibilityState,
  getHomeBeaconEconomyState,
  getHomeBeaconPerformanceState,
  homeBeaconAccessibilityReady,
  homeBeaconEconomyReady,
  homeBeaconPerformanceReady,
} from "@/src/core/home-beacon";

describe("Home Beacon Mega Pack 4/5", () => {
  it("connects Zen Economy bridge", () => {
    const state = getHomeBeaconEconomyState();

    expect(state.zencoinConnected).toBe(true);
    expect(state.pulseConnected).toBe(true);
    expect(state.harmonyConnected).toBe(true);
    expect(homeBeaconEconomyReady()).toBe(true);
  });

  it("enables accessibility layer", () => {
    const state = getHomeBeaconAccessibilityState();

    expect(state.voiceOver).toBe(true);
    expect(state.screenReaderLabels).toBe(true);
    expect(state.reduceMotion).toBe(true);
    expect(state.highContrast).toBe(true);
    expect(homeBeaconAccessibilityReady()).toBe(true);
  });

  it("enforces performance reliability", () => {
    const state = getHomeBeaconPerformanceState();

    expect(state.animationBudgetMs).toBe(16);
    expect(state.particleThrottle).toBe(true);
    expect(state.batteryOptimization).toBe(true);
    expect(homeBeaconPerformanceReady(12)).toBe(true);
    expect(homeBeaconPerformanceReady(22)).toBe(false);
  });

  it("creates reliability seal", () => {
    const seal = createHomeBeaconReliabilitySeal();

    expect(seal.status).toBe("ECONOMY_RELIABILITY_READY");
    expect(seal.economyReady).toBe(true);
    expect(seal.accessibilityReady).toBe(true);
    expect(seal.performanceReady).toBe(true);
  });
});
