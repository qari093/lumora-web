export function applySankalpaToState(input: {
  baseTolerance: number;
  sankalpaTolerance: number;
}) {
  return Math.max(0, Math.min(1, (input.baseTolerance + input.sankalpaTolerance) / 2));
}
