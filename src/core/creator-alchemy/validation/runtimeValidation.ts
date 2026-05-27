export interface RuntimeSignal {
  watchTime: number;
  rewatches: number;
  quietReturns: number;
  resonance: number;
}

export interface RuntimeValidationResult {
  replayAggregationSafe: boolean;
  whisperSafe: boolean;
  constellationSafe: boolean;
  resonanceSafe: boolean;
  atmosphereSafe: boolean;
  ok: boolean;
}

export function validateCreatorRuntime(signal: RuntimeSignal): RuntimeValidationResult {
  const replayAggregationSafe = signal.rewatches >= 0;
  const whisperSafe = signal.watchTime >= 0;
  const constellationSafe = signal.quietReturns >= 0;
  const resonanceSafe = signal.resonance >= 0;
  const atmosphereSafe = signal.watchTime >= 0;

  return {
    replayAggregationSafe,
    whisperSafe,
    constellationSafe,
    resonanceSafe,
    atmosphereSafe,
    ok:
      replayAggregationSafe &&
      whisperSafe &&
      constellationSafe &&
      resonanceSafe &&
      atmosphereSafe
  };
}
