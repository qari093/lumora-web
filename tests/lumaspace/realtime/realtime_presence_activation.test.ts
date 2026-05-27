import { describe, expect, it } from "vitest";

import {
  validateSharedAtmosphere,
  validatePresenceState,
  validateRealtimeRuntime
} from "@/src/core/lumaspace/realtime/contracts/realtimeContract";

import {
  createPresenceState
} from "@/src/core/lumaspace/realtime/presence/presenceState";

import {
  runRealtimeRuntime
} from "@/src/core/lumaspace/realtime/runtime/realtimeRuntime";

describe("LumaSpace Realtime Presence Activation", () => {
  it("validates shared atmosphere", () => {
    expect(
      validateSharedAtmosphere({
        id: "shared_001",
        resonance: "echo-light"
      })
    ).toBe(true);
  });

  it("creates presence state", () => {
    expect(
      validatePresenceState(createPresenceState())
    ).toBe(true);
  });

  it("runs realtime runtime", () => {
    expect(
      validateRealtimeRuntime(runRealtimeRuntime())
    ).toBe(true);
  });
});
