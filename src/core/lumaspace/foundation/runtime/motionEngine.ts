export interface MotionProfile {
  enabled: boolean;
  multiplier: number;
}

export function createMotionProfile(
  reducedMotion: boolean
): MotionProfile {
  return {
    enabled: !reducedMotion,
    multiplier: reducedMotion ? 0.25 : 1
  };
}
