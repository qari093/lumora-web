export function emotionalSignal(input = 0.5) {
  return {
    intensity: Math.max(0, Math.min(1, input)),
    confidence: input >= 0.35 ? "usable" : "low"
  };
}
