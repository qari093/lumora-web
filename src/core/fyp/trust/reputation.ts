export type ReputationState = {
  creatorId: string;
  strikes: number;
  recoveryEligible: boolean;
};

export function createReputationState(input: {
  creatorId: string;
  strikes: number;
}): ReputationState {
  return {
    creatorId: input.creatorId,
    strikes: input.strikes,
    recoveryEligible:
      input.strikes <= 3
  };
}
