export type CooldownInput = {
  lastAdAt?: number;
  now: number;
  minIntervalMs: number;
};

export function isCooldownPassed(input: CooldownInput) {
  if (!input.lastAdAt) return true;
  return input.now - input.lastAdAt >= input.minIntervalMs;
}
