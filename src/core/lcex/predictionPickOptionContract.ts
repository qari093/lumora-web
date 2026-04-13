export type PredictionPickOptionContract = {
  optionId: string;
  pickId: string;
  label: string;
  description?: string;
  oddsWeight?: number;
  active: boolean;
};

export function buildPredictionPickOptionContract(
  input: PredictionPickOptionContract
): PredictionPickOptionContract {
  return {
    ...input,
    optionId: input.optionId.trim(),
    pickId: input.pickId.trim(),
    label: input.label.trim(),
    description: input.description?.trim(),
    oddsWeight:
      typeof input.oddsWeight === "number"
        ? Math.max(0, Math.round(input.oddsWeight * 1000) / 1000)
        : undefined,
  };
}

export function isPredictionPickOptionContractUsable(
  option: PredictionPickOptionContract
): boolean {
  return (
    option.optionId.length > 0 &&
    option.pickId.length > 0 &&
    option.label.length > 0 &&
    option.active === true
  );
}
