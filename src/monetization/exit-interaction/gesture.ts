export type GestureSample = {
  startX: number;
  endX: number;
  startTimeMs: number;
  endTimeMs: number;
};

export function calculateGestureVelocity(sample: GestureSample) {
  const distance = Math.abs(sample.endX - sample.startX);
  const duration = Math.max(1, sample.endTimeMs - sample.startTimeMs);

  return distance / duration;
}

export function isSwipeAwayGesture(sample: GestureSample, threshold = 0.45) {
  return calculateGestureVelocity(sample) >= threshold;
}
