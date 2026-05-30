export type MotionProfile = {
  enabled: boolean;
  reduced: boolean;
  multiplier: number;
};

export function createMotionProfile(reduced = false): MotionProfile {
  return {
    enabled: !reduced,
    reduced,
    multiplier: reduced ? 0.25 : 1
  };
}

export function validateMotionProfile(value: any): boolean {
  return Boolean(
    value &&
      typeof value.enabled === "boolean" &&
      typeof value.reduced === "boolean" &&
      typeof value.multiplier === "number" &&
      value.multiplier > 0 &&
      value.multiplier <= 1
  );
}
