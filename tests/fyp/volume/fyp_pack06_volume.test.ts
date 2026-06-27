import { describe, it, expect } from "vitest";

import {
  FYP_VOLUME_TARGETS
} from "../../../src/core/fyp/volume/volumeTargets";

import {
  validateVolumePool
} from "../../../src/core/fyp/volume/volumePool";

import {
  buildSyntheticVerifiedPool
} from "../../../src/core/fyp/volume/seedPoolBuilder";

describe("FYP Omega Pack 06", () => {
  it("requires 1500 verified videos", () => {
    expect(FYP_VOLUME_TARGETS.minimumTotalVideos).toBe(1500);
  });

  it("builds 1500 synthetic verified assets for validation", () => {
    const pool = buildSyntheticVerifiedPool();

    expect(pool.length).toBe(1500);
  });

  it("passes volume validation when all lanes are filled", () => {
    const result = validateVolumePool(buildSyntheticVerifiedPool());

    expect(result.ok).toBe(true);
    expect(result.totalVerified).toBe(1500);
    expect(result.missingLanes.length).toBe(0);
  });

  it("fails volume validation when lanes are underfilled", () => {
    const result = validateVolumePool(buildSyntheticVerifiedPool(10));

    expect(result.ok).toBe(false);
    expect(result.missingLanes.length).toBeGreaterThan(0);
  });
});
