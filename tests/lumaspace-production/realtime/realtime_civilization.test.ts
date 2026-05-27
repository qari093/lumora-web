import { describe, expect, it } from "vitest";
import { validatePresenceSession, validateRealtimeRuntime, validateSyncEvent } from "@/src/core/lumaspace-production/realtime/contracts/realtimeContract";
import { createPresenceSession } from "@/src/core/lumaspace-production/realtime/presence/presenceSession";
import { createSyncEvent } from "@/src/core/lumaspace-production/realtime/sync/syncEvent";
import { runRealtimeCivilizationRuntime } from "@/src/core/lumaspace-production/realtime/runtime/realtimeRuntime";

describe("LumaSpace Production Pack 04 Realtime Civilization", () => {
  it("creates presence session", () => {
    expect(validatePresenceSession(createPresenceSession("user_001"))).toBe(true);
  });

  it("creates sync event", () => {
    expect(validateSyncEvent(createSyncEvent("atmosphere:update"))).toBe(true);
  });

  it("runs realtime runtime", () => {
    expect(validateRealtimeRuntime(runRealtimeCivilizationRuntime())).toBe(true);
  });
});
