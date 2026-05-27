export function compareRevenueTarget(input: {
  actualRPU: number;
  targetRPU: number;
}) {
  return {
    gap: Number((input.targetRPU - input.actualRPU).toFixed(4)),
    belowTarget: input.actualRPU < input.targetRPU,
  };
}
