import type {
  GovernanceSignal
} from "../types";

export function createGovernanceSignal(): GovernanceSignal {
  return {
    id: "signal_001",
    integrity: 0.99
  };
}
