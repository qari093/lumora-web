import type {
  SoloSpace
} from "../types";

export function createSoloSpace(): SoloSpace {
  return {
    id: "solo_001",
    atmosphere: "quiet-bloom",
    protected: true
  };
}
