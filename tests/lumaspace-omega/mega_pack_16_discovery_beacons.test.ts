import { describe, expect, it } from "vitest";
import { createDiscoveryBeacon, scoreDiscoveryBeacon } from "@/src/core/lumaspace/omega/discovery/beaconEngine";
import { advanceExplorerPath, createExplorerBadge, createExplorerPath } from "@/src/core/lumaspace/omega/discovery/pathEngine";
import { runLumaSpaceOmegaMegaPack16Runtime } from "@/src/core/lumaspace/omega/discovery/omegaPack16Runtime";

describe("LumaSpace Ω∞ Mega Pack 16 — Discovery Beacons", () => {
  it("creates scored hidden beacon", () => {
    const beacon = createDiscoveryBeacon({
      id: "b1",
      kind: "community",
      targetId: "c1",
      title: "Builders",
      interestTags: ["build"],
      trustScore: 80,
      noveltyScore: 70,
      activityScore: 60,
      partiallyHidden: false,
    });

    expect(beacon.partiallyHidden).toBe(true);
    expect(scoreDiscoveryBeacon(beacon, ["build"])).toBeGreaterThan(0);
  });

  it("creates and advances explorer path", () => {
    const beacon = createDiscoveryBeacon({
      id: "b2",
      kind: "wisdom",
      targetId: "w1",
      title: "Wisdom",
      interestTags: ["learn"],
      trustScore: 90,
      noveltyScore: 80,
      activityScore: 70,
      partiallyHidden: true,
    });

    let path = createExplorerPath({ citizenId: "u1", beacons: [beacon], userTags: ["learn"] });
    const badge = createExplorerBadge(path, "b2");
    path = advanceExplorerPath(path);

    expect(badge.badge).toBe("first_explorer");
    expect(path.completed).toBe(true);
  });

  it("runs full mega pack runtime", () => {
    expect(runLumaSpaceOmegaMegaPack16Runtime().ok).toBe(true);
  });
});
