export type SkipSignal = {
  contentId: string;
  skippedEarly: boolean;
  watchedMs: number;
};

export function captureSkipSignal(input: {
  contentId: string;
  watchedMs: number;
  totalMs: number;
}): SkipSignal {
  const watchedMs = Math.max(0, input.watchedMs);
  const totalMs = Math.max(1, input.totalMs);

  return {
    contentId: input.contentId,
    watchedMs,
    skippedEarly: watchedMs < totalMs * 0.2,
  };
}
