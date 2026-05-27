export type BurnoutProtection = {
  creatorId: string;
  overloadDetected: boolean;
  cooldownSuggested: boolean;
};

export function evaluateBurnoutProtection(input: {
  creatorId: string;
  uploads24h: number;
  hoursActive: number;
}): BurnoutProtection {
  const overloadDetected =
    input.uploads24h >= 25 ||
    input.hoursActive >= 14;

  return {
    creatorId: input.creatorId,
    overloadDetected,
    cooldownSuggested: overloadDetected
  };
}
