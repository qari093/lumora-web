import { describe, expect, it } from "vitest";

import {
  createMirrorHourState,
  mirrorHourHealthy,
} from "../../../src/core/gmar/mirror-hour/state";

import {
  MIRROR_HOUR_WHISPERS,
  randomMirrorWhisper,
} from "../../../src/core/gmar/mirror-hour/whispers";

import {
  mirrorHourSkyPalette,
} from "../../../src/core/gmar/mirror-hour/skyTransition";

import {
  createMirrorAttendanceState,
} from "../../../src/core/gmar/mirror-hour/attendance";

describe("GMAR Pack 06 — Mirror Hour", () => {
  it("creates healthy Mirror Hour state", () => {
    expect(mirrorHourHealthy()).toBe(true);
  });

  it("contains calming whispers", () => {
    expect(MIRROR_HOUR_WHISPERS.length).toBeGreaterThanOrEqual(4);
    expect(randomMirrorWhisper()).toContain("silence");
  });

  it("creates valid sky palette", () => {
    const palette = mirrorHourSkyPalette();

    expect(palette.primary).toBe("#D9B065");
    expect(palette.particles).toBe(true);
  });

  it("protects against lonely attendance", () => {
    const state = createMirrorAttendanceState(0);

    expect(state.lonelinessProtectionActive).toBe(true);
  });
});
