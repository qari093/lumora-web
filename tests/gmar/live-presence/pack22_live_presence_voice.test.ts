import { describe, expect, it } from "vitest";
import { livePresenceHealthy } from "../../../src/core/gmar/live-presence/runtime";

describe("GMAR Pack 22 — Live Presence + Voice", () => {
  it("validates live presence runtime", () => {
    const runtime = livePresenceHealthy();

    expect(runtime.voiceChannels).toBe(true);
    expect(runtime.proximityPresence).toBe(true);
    expect(runtime.silenceSafe).toBe(true);
  });
});
