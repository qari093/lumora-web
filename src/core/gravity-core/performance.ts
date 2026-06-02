export function gravityPerformanceGuard(frameMs: number) {
  return {
    frameMs,
    withinBudget: frameMs <= 16,
    budgetMs: 16
  };
}
