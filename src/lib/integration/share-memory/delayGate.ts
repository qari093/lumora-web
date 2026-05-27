export const SHARE_DELAY = 48 * 60 * 60 * 1000;

export function enforceDelay(input: { start: number; now: number }) {
  return { allowed: input.now - input.start >= SHARE_DELAY };
}
