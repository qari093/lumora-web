import type {
  RuntimeBridge
} from "../types";

export function createRuntimeBridge(): RuntimeBridge {
  return {
    id: "bridge_001",
    target: "lumora-core"
  };
}
