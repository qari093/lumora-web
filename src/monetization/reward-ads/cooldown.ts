export function rewardAdCooldownPassed(input: {
  lastRewardAdAt?: number;
  now: number;
  cooldownMs?: number;
}) {
  const cooldownMs = input.cooldownMs ?? 10 * 60 * 1000;
  if (!input.lastRewardAdAt) return true;

  return input.now - input.lastRewardAdAt >= cooldownMs;
}
