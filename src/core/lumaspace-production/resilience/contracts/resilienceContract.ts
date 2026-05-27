import type { OfflineState, RecoveryNode, ResilienceRuntime } from "../types";

export function validateOfflineState(state: OfflineState): boolean {
  return typeof state.enabled === "boolean" && state.queuedActions >= 0;
}

export function validateRecoveryNode(node: RecoveryNode): boolean {
  return Boolean(node.id && typeof node.restored === "boolean");
}

export function validateResilienceRuntime(runtime: ResilienceRuntime): boolean {
  return Boolean(runtime.active === true && validateOfflineState(runtime.offline));
}
