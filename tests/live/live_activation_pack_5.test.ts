import { describe, expect, it } from "vitest";
import { getLiveBridges, hasRequiredLiveBridges } from "../../src/live/bridges/liveBridgeRuntime";
import { canSealLiveRuntime } from "../../src/live/activation/liveRuntimeSeal";

describe("Lumora Live Activation Pack 5", () => {
  it("activates required cross-portal bridges", () => {
    expect(getLiveBridges()).toHaveLength(4);
    expect(hasRequiredLiveBridges()).toBe(true);
  });

  it("seals runtime only when activation locks, tests, and bridges pass", () => {
    expect(canSealLiveRuntime({
      activationLocks: ["pack1", "pack2", "pack3", "pack4", "pack5"],
      testsPassed: true,
      bridgesReady: true,
    })).toBe(true);

    expect(canSealLiveRuntime({
      activationLocks: ["pack1"],
      testsPassed: true,
      bridgesReady: true,
    })).toBe(false);
  });
});
