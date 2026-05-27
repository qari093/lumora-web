export const CHAOS_UPLIFT_MATURATION_DAYS = 7;

export function isChaosUpliftMature(input: {
  createdAtMs: number;
  nowMs: number;
}) {
  const ageDays = (input.nowMs - input.createdAtMs) / 86400000;
  return ageDays >= CHAOS_UPLIFT_MATURATION_DAYS;
}
