export type ReplaySignal = {
  contentId: string;
  replayCount: number;
  strongReplayIntent: boolean;
};

export function captureReplaySignal(input: {
  contentId: string;
  replayCount: number;
}): ReplaySignal {
  const replayCount = Math.max(0, input.replayCount);

  return {
    contentId: input.contentId,
    replayCount,
    strongReplayIntent: replayCount >= 2,
  };
}
