import { describe, expect, it } from "vitest";

import {
  gmarDesignTokens,
  gmarDesignTokensHealthy,
} from "../../../src/core/gmar/dashboard-polish/designTokens";

import {
  createGmarLaunchSurface,
  gmarLaunchSurfaceHealthy,
} from "../../../src/core/gmar/dashboard-polish/launchSurface";

import {
  createGmarPolishChecklist,
  gmarPolishChecklistHealthy,
} from "../../../src/core/gmar/dashboard-polish/polishChecklist";

import {
  gmarCanonicalPacks,
  gmarPackRegistryHealthy,
} from "../../../src/core/gmar/final-seal/packStatus";

import {
  createGmarFinalSeal,
} from "../../../src/core/gmar/final-seal/finalSeal";

describe("GMAR Pack 11 — Dashboard/Layout Polish Seal", () => {
  it("validates dashboard design tokens", () => {
    expect(gmarDesignTokensHealthy()).toBe(true);
    expect(gmarDesignTokens.colors.void).toBe("#0B0B1A");
    expect(gmarDesignTokens.layout.centralCanvas).toBe(60);
  });

  it("validates launch surface", () => {
    const surface = createGmarLaunchSurface();

    expect(gmarLaunchSurfaceHealthy(surface)).toBe(true);
    expect(surface.activeGame).toBe("zen-flow");
    expect(surface.foundingEchoes).toBe(5);
  });

  it("validates polish checklist", () => {
    const checklist = createGmarPolishChecklist();

    expect(gmarPolishChecklistHealthy(checklist)).toBe(true);
    expect(checklist.lofiSoulFallback).toBe(true);
    expect(checklist.noCasinoLanguage).toBe(true);
  });

  it("validates canonical pack registry", () => {
    expect(gmarCanonicalPacks).toHaveLength(11);
    expect(gmarPackRegistryHealthy()).toBe(true);
  });

  it("creates final GMAR seal", () => {
    const seal = createGmarFinalSeal();

    expect(seal.system).toBe("GMAR Civilization Seed");
    expect(seal.status).toBe("PASS");
    expect(seal.dashboardPolished).toBe(true);
    expect(seal.launchSurfaceReady).toBe(true);
    expect(seal.packRegistryReady).toBe(true);
  });
});
