import type { GravityShadowTelemetryEvent } from "./shadowTelemetry";
import { evaluateAssistedLearning } from "./assistedLearning";

export function analyzeAssistedTelemetry(events: GravityShadowTelemetryEvent[]) {
  const attempts = events.filter((e) => e.type === "gesture_attempt").length;
  const successfulRecognitions = events.filter((e) => e.type === "ring_visible" || e.type === "haptic_confirm").length;
  const falsePositives = events.filter((e) => e.type === "gesture_conflict").length;
  const frustrationEvents = events.filter((e) => e.type === "gesture_partial").length;
  const exposures = Math.max(events.length, 1);

  return evaluateAssistedLearning({
    attempts,
    successfulRecognitions,
    falsePositives,
    frustrationEvents,
    exposures,
  });
}
