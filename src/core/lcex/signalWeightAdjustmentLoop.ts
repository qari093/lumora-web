export type SignalWeightKey =
  | "search-intent"
  | "conversation-heat"
  | "fandom-ignition"
  | "quote-repetition"
  | "visual-motif"
  | "soundtrack-heat"
  | "entity-spike"
  | "regional-ignition";

export type SignalWeightMap = Record<SignalWeightKey, number>;

export type SignalWeightAdjustmentInput = {
  current: SignalWeightMap;
  hitRateDelta: Partial<Record<SignalWeightKey, number>>;
  falsePositiveDelta: Partial<Record<SignalWeightKey, number>>;
};

function clampWeight(value: number): number {
  return Number(Math.max(0.05, Math.min(3, value)).toFixed(3));
}

export function adjustSignalWeights(
  input: SignalWeightAdjustmentInput
): SignalWeightMap {
  const next = { ...input.current };

  (Object.keys(next) as SignalWeightKey[]).forEach((key) => {
    const hitDelta = input.hitRateDelta[key] ?? 0;
    const fpDelta = input.falsePositiveDelta[key] ?? 0;

    const candidate =
      next[key] +
      hitDelta * 0.01 -
      fpDelta * 0.015;

    next[key] = clampWeight(candidate);
  });

  return next;
}

export function getDefaultSignalWeights(): SignalWeightMap {
  return {
    "search-intent": 1,
    "conversation-heat": 1,
    "fandom-ignition": 1,
    "quote-repetition": 1,
    "visual-motif": 1,
    "soundtrack-heat": 1,
    "entity-spike": 1,
    "regional-ignition": 1,
  };
}
