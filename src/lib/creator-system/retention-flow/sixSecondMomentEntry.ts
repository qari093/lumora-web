export type SixSecondMomentEntry = {
  videoId: string;
  startMs: number;
  endMs: number;
  durationMs: 6000;
};

export function buildSixSecondMomentEntry(input: {
  videoId: string;
  timestampMs: number;
  videoDurationMs?: number;
}): SixSecondMomentEntry {
  const startMs = Math.max(0, input.timestampMs - 3000);
  const endMs = Math.min(input.videoDurationMs || startMs + 6000, startMs + 6000);

  return {
    videoId: input.videoId,
    startMs,
    endMs,
    durationMs: 6000,
  };
}
