import type {
  ChainLink
} from "../types";

export function createChainLink(): ChainLink {
  return {
    id: "link_001",
    userId: "user_001",
    duration: 2
  };
}
