export interface ClarityState {
  enabled: boolean;
  animations: boolean;
  fog: boolean;
}

export function resolveClarityMode(
  enabled: boolean
): ClarityState {
  if (enabled) {
    return {
      enabled: true,
      animations: false,
      fog: false
    };
  }

  return {
    enabled: false,
    animations: true,
    fog: true
  };
}
