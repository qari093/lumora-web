export function addSixSecondMomentEntry(input: { videoId: string; timestampMs: number; durationMs?: number }) {
  const startMs = Math.max(0, input.timestampMs - 3000);
  const endMs = Math.min(input.durationMs || startMs + 6000, startMs + 6000);
  return { videoId: input.videoId, startMs, endMs, durationMs: 6000 };
}
