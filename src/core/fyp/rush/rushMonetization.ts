import type { RushLanePost } from "./types";

export type RushBonus = {
  postId: string;
  creatorId: string;
  eligible: boolean;
  amount: number;
  reason: string;
};

export function calculateRushBonus(
  post: RushLanePost
): RushBonus {
  const eligible =
    post.active &&
    post.intensity >= 8 &&
    post.voltageSeed >= 35;

  return {
    postId: post.postId,
    creatorId: post.creatorId,
    eligible,
    amount: eligible ? 5 : 0,
    reason: eligible ? "rush_voltage_bonus" : "not_eligible"
  };
}
