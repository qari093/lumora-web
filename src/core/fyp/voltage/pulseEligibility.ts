import type { RushLanePost } from "../rush/types";

export type PulseEligibility = {
  postId: string;
  eligible: boolean;
  reason: string;
};

export function evaluatePulseEligibility(
  post: RushLanePost
): PulseEligibility {
  const eligible =
    post.active &&
    post.intensity >= 7 &&
    post.voltageSeed >= 25;

  return {
    postId: post.postId,
    eligible,
    reason: eligible ? "high_voltage_rush_post" : "below_pulse_threshold"
  };
}
