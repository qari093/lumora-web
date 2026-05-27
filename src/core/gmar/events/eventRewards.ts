export function claimReward(points: number) {
  return {
    claimed: points >= 50
  };
}
