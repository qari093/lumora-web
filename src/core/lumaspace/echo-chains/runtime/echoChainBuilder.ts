import type {
  EchoChain
} from "../types";

export function createEchoChain(): EchoChain {
  return {
    id: "chain_001",
    depth: 5,
    atmosphere: "resonance"
  };
}
