export function resolveGmarVisualMode(input: { memoryGb: number; batteryPercent: number; reducedMotion: boolean }): "full-holographic" | "lofi-soul" {
  if (input.reducedMotion || input.batteryPercent < 20 || input.memoryGb < 4) return "lofi-soul";
  return "full-holographic";
}
