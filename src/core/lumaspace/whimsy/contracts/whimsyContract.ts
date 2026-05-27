import type {
  WhimsyEffect
} from "../types";

export function validateWhimsyEffect(
  effect: WhimsyEffect
): boolean {
  return Boolean(
    effect.id &&
      effect.mode &&
      effect.intensity >= 0 &&
      effect.intensity <= 1 &&
      effect.safe === true
  );
}
