export type SwipeMeasure = {
  startedAt: number;
  endedAt?: number;
};

export function startSwipeMeasure(now = performance.now()): SwipeMeasure {
  return { startedAt: now };
}

export function endSwipeMeasure(measure: SwipeMeasure, now = performance.now()): SwipeMeasure {
  return { ...measure, endedAt: now };
}

export function getSwipeDurationMs(measure: SwipeMeasure): number {
  if (typeof measure.endedAt !== "number") return 0;
  return Math.max(0, measure.endedAt - measure.startedAt);
}
