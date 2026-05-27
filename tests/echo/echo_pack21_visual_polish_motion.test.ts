import { describe, expect, it } from "vitest";
import {
  motionSystems,
  visualPolishReady,
  reducedMotionSupport,
  atmosphereAnimations,
} from "../../src/echo/visuals/motionSystem";

describe("Echo Pack 21 — Visual Polish + Motion", () => {
  it("supports motion systems", () => {
    expect(motionSystems).toContain("echo-lens-pulse");
  });

  it("supports visual polish", () => {
    expect(visualPolishReady()).toBe(true);
  });

  it("supports accessibility motion", () => {
    expect(reducedMotionSupport().supported).toBe(true);
    expect(atmosphereAnimations().synchronized).toBe(true);
  });
});
