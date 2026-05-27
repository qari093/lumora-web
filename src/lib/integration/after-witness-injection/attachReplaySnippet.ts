export function attachReplaySnippet(input: {
  dashboard: any;
  videoId: string;
  startMs: number;
  endMs: number;
}) {
  return {
    ...input.dashboard,
    replaySnippet: {
      videoId: input.videoId,
      startMs: input.startMs,
      endMs: input.endMs,
      durationMs: Math.max(0, input.endMs - input.startMs),
      visible: true,
    },
  };
}
