export type PerformanceThrottlePlan = {
  mode: "none" | "moderate" | "heavy";
  reduceFrameRate: boolean;
  disableBlur: boolean;
  shrinkOverlayDensity: boolean;
};

export function buildPerformanceThrottlePlan(input: {
  lowPower?: boolean;
  deviceMemoryGb?: number;
}): PerformanceThrottlePlan {
  if (input.lowPower) {
    return {
      mode: "heavy",
      reduceFrameRate: true,
      disableBlur: true,
      shrinkOverlayDensity: true,
    };
  }

  if ((input.deviceMemoryGb ?? 8) < 4) {
    return {
      mode: "moderate",
      reduceFrameRate: true,
      disableBlur: false,
      shrinkOverlayDensity: true,
    };
  }

  return {
    mode: "none",
    reduceFrameRate: false,
    disableBlur: false,
    shrinkOverlayDensity: false,
  };
}
