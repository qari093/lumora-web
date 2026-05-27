export function triggerExitReward(input: {
  engaged: boolean;
  rewardZen: number;
}) {
  return {
    granted: input.engaged,
    amount: input.engaged ? input.rewardZen : 0,
    reason: input.engaged ? "exit_interaction_engaged" : "exit_interaction_ignored",
  };
}
