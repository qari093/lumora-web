import { describe, expect, it } from "vitest";

import {
  seedDashboardLayoutHealthy,
  seedDashboardZones,
} from "../../../src/core/gmar/dashboard/seedLayout";
import { createCentralCanvasLaunchState } from "../../../src/core/gmar/dashboard/centralCanvas";
import { createPersonalHaloLaunchState } from "../../../src/core/gmar/dashboard/personalHalo";
import { createSocialOrbitLaunchState } from "../../../src/core/gmar/dashboard/socialOrbit";
import {
  civilizationSeedReady,
  createCivilizationSeedReadiness,
} from "../../../src/core/gmar/seed/civilizationSeed";
import {
  seedTrackerHealthy,
  threeMonthSeedTracker,
} from "../../../src/core/gmar/launch/threeMonthSeedTracker";
import { createGmarSeedSeal } from "../../../src/core/gmar/launch/finalSeal";

describe("GMAR Pack 05 — Seed Dashboard Seal", () => {
  it("validates three-zone dashboard layout", () => {
    expect(seedDashboardZones).toHaveLength(3);
    expect(seedDashboardLayoutHealthy()).toBe(true);
  });

  it("validates central canvas launch state", () => {
    const state = createCentralCanvasLaunchState();

    expect(state.activeGame).toBe("zen-flow");
    expect(state.foundingEchoCount).toBe(5);
    expect(state.dormantConstellationsVisible).toBe(true);
  });

  it("validates personal halo launch state", () => {
    const state = createPersonalHaloLaunchState();

    expect(state.firstLightVisible).toBe(true);
    expect(state.dailySparkVisible).toBe(true);
    expect(state.solaceCoinSlot).toBe(true);
  });

  it("validates social orbit launch state without overbuilding live rooms", () => {
    const state = createSocialOrbitLaunchState();

    expect(state.echoGiftVisible).toBe(true);
    expect(state.onlineLightsVisible).toBe(true);
    expect(state.liveRoomsEnabled).toBe(false);
  });

  it("validates civilization seed readiness", () => {
    const readiness = createCivilizationSeedReadiness();

    expect(readiness.onlyLaunchGame).toBe("zen-flow");
    expect(readiness.overbuildProtected).toBe(true);
    expect(civilizationSeedReady()).toBe(true);
  });

  it("validates three-month seed tracker", () => {
    expect(threeMonthSeedTracker).toHaveLength(3);
    expect(seedTrackerHealthy()).toBe(true);
  });

  it("creates final GMAR seed seal", () => {
    const seal = createGmarSeedSeal();

    expect(seal.system).toBe("GMAR Civilization Seed");
    expect(seal.status).toBe("PASS");
    expect(seal.oneGameOnly).toBe(true);
    expect(seal.dashboardReady).toBe(true);
    expect(seal.trackerReady).toBe(true);
  });
});
