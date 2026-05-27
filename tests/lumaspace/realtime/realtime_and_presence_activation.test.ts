import { describe, expect, it } from "vitest";

import {
  validateRealtimePresence,
  validateSharedAtmosphere,
  validateRealtimeRuntime
} from "@/src/core/lumaspace/realtime/contracts/realtimeContract";

import {
  createRealtimePresence
} from "@/src/core/lumaspace/realtime/presence/presenceState";

import {
  createSharedAtmosphere
} from "@/src/core/lumaspace/realtime/runtime/sharedAtmosphere";

import {
  runRealtimeRuntime
} from "@/src/core/lumaspace/realtime/runtime/realtimeRuntime";

describe("LumaSpace Realtime and Presence Activation", () => {
  it("creates realtime presence", () => {
    const presence = createRealtimePresence();

    expect(
      validateRealtimePresence(presence)
    ).toBe(true);
  });

  it("creates shared atmosphere", () => {
    const atmosphere = createSharedAtmosphere();

    expect(
      validateSharedAtmosphere(atmosphere)
    ).toBe(true);
  });

  it("runs realtime runtime", () => {
    const runtime = runRealtimeRuntime();

    expect(
      validateRealtimeRuntime(runtime)
    ).toBe(true);

    expect(
      runtime.sharedAtmosphere.participants
    ).toBe(2);
  });
});
