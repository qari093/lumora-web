import type { RecoveryNode } from "../types";

export function createRecoveryNode(): RecoveryNode {
  return {
    id: "recovery_001",
    restored: true
  };
}
