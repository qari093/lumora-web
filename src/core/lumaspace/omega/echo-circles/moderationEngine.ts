import type { EchoCircleModerationSignal } from "./types";

export function createCircleModerationSignal(input: {
  circleId: string;
  severity: EchoCircleModerationSignal["severity"];
  reason: string;
}): EchoCircleModerationSignal {
  if (!input.circleId.trim()) throw new Error("circleId_required");

  return {
    circleId: input.circleId,
    severity: input.severity,
    reason: input.reason,
    requiresGuardianReview: input.severity !== "low",
  };
}

export function circleCanContinue(signals: EchoCircleModerationSignal[]): boolean {
  return !signals.some((signal) => signal.severity === "high");
}
