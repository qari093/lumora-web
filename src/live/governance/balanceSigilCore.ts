export type BalanceSigilState = "healthy" | "overstimulated" | "stagnant";

export type BalanceSigilInput = {
  presenceRatio: number;
  momentumRatio: number;
  mythologyRatio: number;
};

export function evaluateBalanceSigil(input: BalanceSigilInput): BalanceSigilState {
  if (input.momentumRatio > 30 || input.mythologyRatio > 15) return "overstimulated";
  if (input.presenceRatio > 90) return "stagnant";
  return "healthy";
}
