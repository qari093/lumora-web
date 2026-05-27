export const DEFAULT_NOT_NOW_MS = 60_000;

export function createNotNowOverride(input: {
  activatedAtMs: number;
  durationMs?: number;
}) {
  const durationMs = input.durationMs ?? DEFAULT_NOT_NOW_MS;

  return {
    activeUntilMs: input.activatedAtMs + durationMs,
    durationMs,
    state: "red" as const,
  };
}

export function isNotNowActive(input: {
  nowMs: number;
  activeUntilMs?: number;
}) {
  return Boolean(input.activeUntilMs && input.nowMs < input.activeUntilMs);
}
