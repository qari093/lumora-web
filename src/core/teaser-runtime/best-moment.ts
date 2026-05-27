export function detectBestMoment(input: { durationSeconds: number; anchors?: number[] }) {
  const anchor = input.anchors?.[0];

  return {
    startSecond: anchor ?? Math.max(0, Math.floor(input.durationSeconds * 0.35)),
    durationSeconds: 27,
  };
}
