import { describe, expect, it } from "vitest";
import { immersionRuntimeHealthy, resolveImmersionMode } from "../../../src/core/gmar/immersion/runtime";

describe("GMAR Pack 38/40 — App Immersion + FX Layer", () => {
  it("validates immersion runtime", () => {
    const runtime = immersionRuntimeHealthy();

    expect(runtime.holographicFxReady).toBe(true);
    expect(runtime.lofiSoulFallbackReady).toBe(true);
    expect(runtime.reducedMotionSafe).toBe(true);
  });

  it("resolves safe immersion mode", () => {
    expect(resolveImmersionMode({ reducedMotion: false, lowPower: false })).toBe("full");
    expect(resolveImmersionMode({ reducedMotion: true, lowPower: false })).toBe("lofi");
    expect(resolveImmersionMode({ reducedMotion: false, lowPower: true })).toBe("lofi");
  });
});
