export function withinExitGraceWindow(input: {
  touchStartAtMs: number;
  nowMs: number;
  minMs?: number;
  maxMs?: number;
}) {
  const minMs = input.minMs ?? 100;
  const maxMs = input.maxMs ?? 150;
  const elapsed = input.nowMs - input.touchStartAtMs;

  return elapsed >= minMs && elapsed <= maxMs;
}
