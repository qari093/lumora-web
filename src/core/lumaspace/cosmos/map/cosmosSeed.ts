import type {
  CosmosStar
} from "../types";

export function createCosmosSeed(): CosmosStar[] {
  return [
    {
      id: "star_001",
        resonance: "wonder",
        atmosphere: "wonder",
        y: 40
    },
    {
      id: "star_002",
        resonance: "dream",
        atmosphere: "dream",
        y: 10
    }
  ];
}
