import { describe, it, expect } from "vitest";

import {
  applyPreferenceSignal,
  createEmptyPreferenceProfile
} from "../../../src/core/fyp/preferences/preferenceEngine";

import {
  applyPreferenceRanking
} from "../../../src/core/fyp/preferences/preferenceRanking";

import {
  validatePreferencePrivacy
} from "../../../src/core/fyp/preferences/preferencePrivacy";

describe("FYP Omega Pack 16", () => {
  it("boosts lane after positive signal", () => {
    const profile = createEmptyPreferenceProfile("user_1");

    const next = applyPreferenceSignal(profile, {
      userId: "user_1",
      assetId: "asset_1",
      lane: "wonder",
      signal: "more_like_this",
      ts: Date.now()
    });

    expect(next.laneWeights.wonder).toBeGreaterThan(1);
  });

  it("reduces lane after negative signal", () => {
    const profile = createEmptyPreferenceProfile("user_2");

    const next = applyPreferenceSignal(profile, {
      userId: "user_2",
      assetId: "asset_2",
      lane: "laugh",
      signal: "less_like_this",
      ts: Date.now()
    });

    expect(next.laneWeights.laugh).toBeLessThan(1);
  });

  it("uses preference weights for ranking", () => {
    const profile = {
      userId: "user_3",
      laneWeights: {
        reflect: 2,
        wonder: 0.5
      },
      updatedAt: Date.now()
    };

    const ranked = applyPreferenceRanking(
      [
        { id: "a", lane: "wonder", baseScore: 1 },
        { id: "b", lane: "reflect", baseScore: 1 }
      ],
      profile
    );

    expect(ranked[0].id).toBe("b");
  });

  it("keeps preference privacy local-first and deletable", () => {
    expect(validatePreferencePrivacy()).toBe(true);
  });
});
