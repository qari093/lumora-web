import { describe, expect, it } from "vitest";
import { liveAtmosphere } from "@/src/core/live-presence/atmosphere/liveAtmosphere";
import { realtimeBridge } from "@/src/core/live-presence/realtime/realtimeBridge";

describe("live presence runtime", () => {
  it("supports immersive atmosphere", () => {
    expect(liveAtmosphere.immersive).toBe(true);
  });

  it("supports realtime bridge", () => {
    expect(realtimeBridge().realtime).toBe(true);
  });
});
