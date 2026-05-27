export type Fyp94FrameSignal = {
  brightness: number;
  motion: number;
};

export function detectFyp94PeakMoment(signals: Fyp94FrameSignal[]): {
  index: number;
  brightnessSpike: number;
  motionSpike: number;
} {
  if (!signals.length) {
    return { index: 0, brightnessSpike: 0, motionSpike: 0 };
  }

  let bestIndex = 0;
  let bestScore = -1;

  for (let i = 0; i < signals.length; i++) {
    const prev = signals[i - 1] ?? signals[i];
    const brightnessSpike = Math.max(0, signals[i].brightness - prev.brightness);
    const motionSpike = Math.max(0, signals[i].motion - prev.motion);
    const score = brightnessSpike * 0.4 + motionSpike * 0.6;

    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  const prev = signals[bestIndex - 1] ?? signals[bestIndex];

  return {
    index: bestIndex,
    brightnessSpike: Math.max(0, signals[bestIndex].brightness - prev.brightness),
    motionSpike: Math.max(0, signals[bestIndex].motion - prev.motion),
  };
}
