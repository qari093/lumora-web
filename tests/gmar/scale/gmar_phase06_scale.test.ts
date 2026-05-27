import { describe, it, expect } from "vitest";

import { playerLoad } from "../../../src/core/gmar/scale/playerLoad";
import { regionShards } from "../../../src/core/gmar/scale/regionShards";
import { liveLatency } from "../../../src/core/gmar/scale/liveLatency";
import { failoverReady } from "../../../src/core/gmar/scale/failover";
import { scaleHealth } from "../../../src/core/gmar/scale/scaleHealth";

describe("GMAR PHASE 6", () => {
  it("supports player load", () => {
    expect(playerLoad(50000).stable).toBe(true);
  });

  it("loads regional shards", () => {
    expect(regionShards().length).toBeGreaterThan(1);
  });

  it("controls live latency", () => {
    expect(liveLatency(80)).toBe(true);
  });

  it("supports failover", () => {
    expect(failoverReady()).toBe(true);
  });

  it("passes scale health", () => {
    expect(scaleHealth().healthy).toBe(true);
  });
});
