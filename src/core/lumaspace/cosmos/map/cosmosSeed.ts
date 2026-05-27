import type {
  CosmosStar
} from "../types";

export function createCosmosSeed(): CosmosStar[] {
  return [
    {
      id: "star_001",
      atmosphere: "wonder",
      energy: 0.95,
      x: 20,
      y: 40
    },
    {
      id: "star_002",
      atmosphere: "dream",
      energy: 0.82,
      x: 50,
      y: 10
    }
  ];
}
