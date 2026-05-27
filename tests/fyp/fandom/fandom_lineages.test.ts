import { describe, expect, it } from "vitest";

import {
  createFanRankProfile,
  calculateFandomRank
} from "@/src/core/fyp/fandom/fandomRank";

import {
  createFandomReward
} from "@/src/core/fyp/fandom/rewards";

import {
  createSeedPhrase
} from "@/src/core/fyp/lineages/seedPhrase";

import {
  addLineageNode,
  createLineageTree
} from "@/src/core/fyp/lineages/lineageTree";

import {
  createLineageReward
} from "@/src/core/fyp/lineages/lineageRewards";

describe("Lumora FYP Fandom + Lineages", () => {
  it("creates fan rank profile", () => {
    const profile = createFanRankProfile({
      fanId: "fan_1",
      creatorId: "creator_1",
      secondsWatched: 12000,
      echoCount: 100,
      capsuleSaves: 40,
      liveRoomJoins: 10
    });

    expect(profile.rank).toBe("spark-loyalist");
    expect(profile.loyaltyScore).toBeGreaterThan(200);
  });

  it("calculates highest fandom rank", () => {
    expect(calculateFandomRank(1000)).toBe("volt-elite");
  });

  it("creates fandom reward for high rank", () => {
    const profile = createFanRankProfile({
      fanId: "fan_1",
      creatorId: "creator_1",
      secondsWatched: 40000,
      echoCount: 200,
      capsuleSaves: 80,
      liveRoomJoins: 30
    });

    const reward = createFandomReward({
      profile,
      type: "relic"
    });

    expect(reward.unlocked).toBe(true);
  });

  it("creates seed phrase", () => {
    const phrase = createSeedPhrase({
      ownerUserId: "waqar",
      words: ["neon", "drift", "ghost"]
    });

    expect(phrase.phrase).toBe("neon.drift.ghost");
    expect(phrase.active).toBe(true);
  });

  it("creates and expands lineage tree", () => {
    const tree = createLineageTree({
      rootUserId: "waqar",
      nodes: [
        {
          userId: "friend_1",
          invitedBy: "waqar",
          depth: 1,
          impactContribution: 500
        }
      ]
    });

    const expanded = addLineageNode({
      tree,
      node: {
        userId: "friend_2",
        invitedBy: "friend_1",
        depth: 2,
        impactContribution: 600
      }
    });

    const reward = createLineageReward(expanded);

    expect(expanded.totalImpact).toBe(1100);
    expect(expanded.ancestorStatus).toBe(true);
    expect(reward.unlocked).toBe(true);
  });
});
