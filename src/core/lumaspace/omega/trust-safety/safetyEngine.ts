import type { SafetySignal } from "./types";

export function createSafetySignal(input: SafetySignal): SafetySignal {
  if (!input.id.trim()) throw new Error("signal_id_required");
  if (!input.targetId.trim()) throw new Error("targetId_required");
  return input;
}

export function signalRequiresReview(signal: SafetySignal): boolean {
  return signal.severity === "medium" || signal.severity === "high";
}
