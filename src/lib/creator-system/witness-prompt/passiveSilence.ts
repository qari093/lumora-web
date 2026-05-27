export function detectPassiveSilence(input: {
  watchMs: number;
  signalCount: number;
  videoDurationMs: number;
}) {
  const watchedEnough = input.watchMs >= Math.min(8000, input.videoDurationMs * 0.5);
  return {
    passiveSilence: watchedEnough && input.signalCount === 0,
    watchedEnough,
  };
}
