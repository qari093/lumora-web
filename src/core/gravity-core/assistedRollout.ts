export type GravityAssistedRolloutPlan = {
  integrated: boolean;
  stages: number[];
  startsDisabled: true;
  maxInitialRollout: 5;
};

export function getGravityAssistedRolloutPlan(): GravityAssistedRolloutPlan {
  return {
    integrated: true,
    stages: [0, 1, 5, 10, 25, 50, 100],
    startsDisabled: true,
    maxInitialRollout: 5,
  };
}
