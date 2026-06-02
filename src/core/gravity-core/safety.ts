export type GravitySafetyResult = {
  homeButtonVisible: boolean;
  emergencyEscapeEnabled: boolean;
};

export function computeGravitySafety(): GravitySafetyResult {
  return {
    homeButtonVisible: true,
    emergencyEscapeEnabled: true,
  };
}
