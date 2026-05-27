export const SHARE_AS_MEMORY_DELAY_MS = 48 * 60 * 60 * 1000;

export function canShareAfterDelay(input: {
  witnessedAtMs: number;
  nowMs: number;
}): boolean {
  return input.nowMs - input.witnessedAtMs >= SHARE_AS_MEMORY_DELAY_MS;
}
