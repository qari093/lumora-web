export function validateTargeting(input: {
  allowedStates: ("green" | "yellow")[];
  maxDrift: number;
}) {
  return {
    ok:
      input.allowedStates.every((s) => s === "green" || s === "yellow") &&
      input.maxDrift >= 0 &&
      input.maxDrift <= 1,
  };
}
