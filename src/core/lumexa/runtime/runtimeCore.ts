export type LumexaRuntimeMode = "neutral" | "calm" | "adaptive";

export interface LumexaRuntimeState {
  mode: LumexaRuntimeMode;
  confidence: number;
  atmosphere: string;
}

export function createRuntimeState(): LumexaRuntimeState {
  return {
    mode: "neutral",
    confidence: 0,
    atmosphere: "soft_neutral"
  };
}

export function neutralizeWeakConfidence(confidence: number): LumexaRuntimeState {
  if (confidence < 0.5) {
    return createRuntimeState();
  }

  return {
    mode: "adaptive",
    confidence,
    atmosphere: "responsive"
  };
}

export function adaptRuntime(confidence: number): LumexaRuntimeState {
  if (confidence >= 0.75) {
    return {
      mode: "adaptive",
      confidence,
      atmosphere: "alive"
    };
  }

  return neutralizeWeakConfidence(confidence);
}

export function createLumexaRuntime(): LumexaRuntimeState {
  return createRuntimeState();
}

export function resolveRuntimeConfidence(confidence: number): LumexaRuntimeState {
  return neutralizeWeakConfidence(confidence);
}
