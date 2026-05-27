export type MicroValueWindowDecision = {
  open: boolean;
  reason: "trust_threshold_met" | "not_enough_quiet_value";
  noBackdoorMonetization: true;
};

export function evaluateMicroValueWindow(input: {
  invisibleValueScore: number;
  threshold: number;
}): MicroValueWindowDecision {
  const open = input.invisibleValueScore >= input.threshold;

  return {
    open,
    reason: open ? "trust_threshold_met" : "not_enough_quiet_value",
    noBackdoorMonetization: true,
  };
}
