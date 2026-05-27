export interface FailoverPlan {
  active: boolean;
  disableMythic: boolean;
  batchWhispers: boolean;
  reduceAnimations: boolean;
}

export function buildFailoverPlan(input: {
  shouldFailover: boolean;
  runtimeCostPressure: number;
}): FailoverPlan {
  return {
    active: input.shouldFailover,
    disableMythic: input.shouldFailover,
    batchWhispers: input.shouldFailover || input.runtimeCostPressure > 0.8,
    reduceAnimations: input.runtimeCostPressure > 0.75
  };
}
