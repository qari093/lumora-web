export type GravityAccessibilityResult = {
  reduceMotionSupported: boolean;
  voiceOverSupported: boolean;
};

export function computeGravityAccessibility(): GravityAccessibilityResult {
  return {
    reduceMotionSupported: true,
    voiceOverSupported: true,
  };
}
