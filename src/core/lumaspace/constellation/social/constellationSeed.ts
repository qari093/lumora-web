import type {
  Constellation
} from "../types";

export function createConstellation(): Constellation {
  return {
    id: "constellation_001",
    title: "Lunar Wolves",
    energy: 0.91,
    members: [
      {
        id: "user_001",
        aura: "dream"
      },
      {
        id: "user_002",
        aura: "wonder"
      }
    ]
  };
}
