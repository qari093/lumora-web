import { describe, expect, it } from "vitest";

import { createDefaultSkyState } from "../../../src/core/gmar/sky/skyState";
import {
  activeConstellations,
  dormantConstellations,
  gmarConstellations,
} from "../../../src/core/gmar/constellations/registry";
import {
  createFoundingEcho,
  createFoundingEchoSet,
} from "../../../src/core/gmar/echo-monuments/monuments";
import { civilizationTicker } from "../../../src/core/gmar/hub/ticker";
import { hubLayoutBalanced } from "../../../src/core/gmar/hub/layout";

describe("GMAR Pack 02 — Living Civilization Hub", () => {
  it("creates default civilization sky state", () => {
    const sky = createDefaultSkyState();

    expect(sky.mood).toBe("reflective");
    expect(sky.activeConstellation).toBe("zen-flow");
    expect(sky.foundingEchoesVisible).toBe(true);
  });

  it("keeps one launch constellation active and future games dormant", () => {
    expect(gmarConstellations.length).toBeGreaterThanOrEqual(5);
    expect(activeConstellations()).toHaveLength(1);
    expect(dormantConstellations().length).toBeGreaterThanOrEqual(4);
  });

  it("creates permanent founding echoes", () => {
    const echo = createFoundingEcho("founder-1");

    expect(echo.kind).toBe("founding");
    expect(echo.permanent).toBe(true);
    expect(echo.visibleInSky).toBe(true);
  });

  it("creates five founding echoes for cold-start presence", () => {
    expect(createFoundingEchoSet()).toHaveLength(5);
  });

  it("creates civilization ticker messages", () => {
    expect(civilizationTicker().length).toBeGreaterThanOrEqual(3);
  });

  it("validates dashboard zone balance", () => {
    expect(hubLayoutBalanced()).toBe(true);
  });
});
