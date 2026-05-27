export type SixSecondReplayWindow = {
  videoId: string;
  startMs: number;
  endMs: number;
  durationMs: 6000;
};

export function buildSixSecondReplayWindow(input: {
  videoId: string;
  timestampMs: number;
  videoDurationMs?: number;
}): SixSecondReplayWindow {
  const half = 3000;
  const maxEnd = input.videoDurationMs || input.timestampMs + half;
  const startMs = Math.max(0, input.timestampMs - half);
  const endMs = Math.min(maxEnd, startMs + 6000);

  return {
    videoId: input.videoId,
    startMs,
    endMs,
    durationMs: 6000,
  };
}
