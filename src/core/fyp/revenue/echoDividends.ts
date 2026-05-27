export function calculateEchoDividend(input: {
  echoCount: number;
  capsuleSaves: number;
  replayAfter48h: number;
}): number {
  const amount =
    input.echoCount * 0.01 +
    input.capsuleSaves * 0.08 +
    input.replayAfter48h * 0.03;

  return Number(amount.toFixed(2));
}
