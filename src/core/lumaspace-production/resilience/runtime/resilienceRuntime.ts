import type { ResilienceRuntime } from "../types";
import { createOfflineState } from "../offline/offlineState";

export function runResilienceRuntime(): ResilienceRuntime {
  return {
    active: true,
    offline: createOfflineState()
  };
}
