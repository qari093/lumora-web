export function emotionPacing(intensity: number) {
  return {
    pace: intensity > 0.6 ? "slow" : "normal",
    respectful: true
  };
}
