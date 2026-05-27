import type { LineageTree } from "./types";

export type LineageReward = {
  rootUserId: string;
  rewardType: "founder-echo" | "ancestor-relic" | "lineage-halo";
  unlocked: boolean;
};

export function createLineageReward(
  tree: LineageTree
): LineageReward {
  return {
    rootUserId: tree.rootUserId,
    rewardType:
      tree.totalImpact >= 1500
        ? "lineage-halo"
        : tree.ancestorStatus
          ? "ancestor-relic"
          : "founder-echo",
    unlocked: tree.nodes.length > 0
  };
}
