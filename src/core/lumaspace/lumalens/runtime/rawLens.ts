import type {
  RawLens
} from "../types";

export function createRawLens(): RawLens {
  return {
    enabled: true,
    glitchMode: true
  };
}
