export type MotionPerformanceMode = "full" | "balanced" | "safe";

export function resolveMotionPerformanceMode(input: {
  deviceMemoryGb?: number;
  reducedMotion?: boolean;
  lowPowerMode?: boolean;
}): MotionPerformanceMode {
  if (input.reducedMotion || input.lowPowerMode) return "safe";
  if ((input.deviceMemoryGb || 0) < 4) return "balanced";
  return "full";
}
