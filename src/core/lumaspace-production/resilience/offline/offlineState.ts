import type { OfflineState } from "../types";

export function createOfflineState(): OfflineState {
  return {
    enabled: true,
    queuedActions: 2
  };
}
