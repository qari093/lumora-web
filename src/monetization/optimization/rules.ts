export function applyOptimizationRules(input: {
  decision: "rollback" | "promote" | "hold";
  currentAdLoad: number;
}) {
  if (input.decision === "rollback") {
    return { nextAdLoad: Math.max(0, Number((input.currentAdLoad * 0.75).toFixed(4))) };
  }

  if (input.decision === "promote") {
    return { nextAdLoad: Math.min(1, Number((input.currentAdLoad * 1.1).toFixed(4))) };
  }

  return { nextAdLoad: input.currentAdLoad };
}
