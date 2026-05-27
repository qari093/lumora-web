export function evaluateStabilizationEligibility(input: { currentCents: number; averageCents: number }) {
  const floor = Math.floor(input.averageCents * 0.7);
  return {
    floor,
    eligible: input.currentCents < floor,
    shortfallCents: Math.max(0, floor - input.currentCents),
  };
}
