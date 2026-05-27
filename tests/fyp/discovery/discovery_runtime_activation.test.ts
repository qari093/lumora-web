import { describe, expect, it } from "vitest";

import {
  isDiscoveryLane,
  validateDiscoveryItem
} from "@/src/core/fyp/discovery/contracts/discoveryContract";

import {
  createDiscoverySeed
} from "@/src/core/fyp/discovery/runtime/discoverySeed";

import {
  rankDiscoveryItems
} from "@/src/core/fyp/discovery/runtime/discoveryRanker";

import {
  runDiscovery
} from "@/src/core/fyp/discovery/runtime/discoveryRuntime";

describe("Lumora FYP Discovery Runtime Activation", () => {
  it("validates discovery lanes", () => {
    expect(isDiscoveryLane("viral")).toBe(true);
    expect(isDiscoveryLane("unknown")).toBe(false);
  });

  it("creates valid discovery seed", () => {
    const seed = createDiscoverySeed();

    expect(seed).toHaveLength(4);
    expect(validateDiscoveryItem(seed[0])).toBe(true);
  });

  it("ranks discovery items", () => {
    const ranked =
      rankDiscoveryItems(createDiscoverySeed());

    expect(ranked[0].score).toBeGreaterThanOrEqual(
      ranked[1].score
    );
  });

  it("filters discovery by lane", () => {
    const ranked =
      rankDiscoveryItems(
        createDiscoverySeed(),
        "local"
      );

    expect(ranked).toHaveLength(1);
    expect(ranked[0].lane).toBe("local");
  });

  it("runs discovery runtime", () => {
    const result = runDiscovery("viral");

    expect(result.ok).toBe(true);
    expect(result.lane).toBe("viral");
    expect(result.items[0].lane).toBe("viral");
  });
});
