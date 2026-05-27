import type {
  WhimsyEffect,
  WhimsyMode
} from "../types";

import {
  validateWhimsyEffect
} from "../contracts/whimsyContract";

export function createRawLensWhimsy(
  mode: WhimsyMode,
  intensity = 0.5
): WhimsyEffect {
  const effect: WhimsyEffect = {
    id: `whimsy_${mode}`,
    mode,
    intensity,
    safe: true
  };

  if (!validateWhimsyEffect(effect)) {
    throw new Error("invalid_whimsy_effect");
  }

  return effect;
}
