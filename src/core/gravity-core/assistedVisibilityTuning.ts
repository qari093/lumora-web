export type AssistedVisibilityTuning = {
  softExposure: boolean;
  maxOpacity: number;
  minConfidence: number;
  disabledUntilFlag: true;
};

export function getAssistedVisibilityTuning(): AssistedVisibilityTuning {
  return {
    softExposure: true,
    maxOpacity: 0.94,
    minConfidence: 0.62,
    disabledUntilFlag: true,
  };
}
