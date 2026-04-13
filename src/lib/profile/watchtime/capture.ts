export type WatchTimeCapture = {
  contentId: string;
  watchedMs: number;
  completed: boolean;
};

export function captureWatchTime(input: {
  contentId: string;
  watchedMs: number;
  totalMs: number;
}): WatchTimeCapture {
  const watchedMs = Math.max(0, input.watchedMs);
  const totalMs = Math.max(1, input.totalMs);

  return {
    contentId: input.contentId,
    watchedMs,
    completed: watchedMs >= totalMs * 0.95,
  };
}
