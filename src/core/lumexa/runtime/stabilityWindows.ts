export interface StabilityWindow {
  immediate: boolean;
  flow: boolean;
  seasonal: boolean;
}

export function createStabilityWindow(): StabilityWindow {
  return {
    immediate: true,
    flow: true,
    seasonal: true
  };
}
