export function calculateZenBurn(input: {
  spendAmount: number;
  burnRate?: number;
}) {
  const burnRate = input.burnRate ?? 0.08;
  const burned = Math.max(0, Math.round(input.spendAmount * burnRate));
  const platformAmount = Math.max(0, input.spendAmount - burned);

  return {
    burned,
    platformAmount,
    burnRate,
  };
}
