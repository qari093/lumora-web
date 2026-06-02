import type { GravityIntentResult } from "./types";

export type GravityShadowTelemetryEvent = {
  type:
    | "shadow_sample"
    | "ring_visible"
    | "gesture_attempt"
    | "gesture_partial"
    | "gesture_conflict"
    | "haptic_preview"
    | "haptic_confirm";
  ts: number;
  state: string;
  intentScore: number;
  confidence: number;
  proximity: number;
  velocity: number;
  shadowOnly: boolean;
};

const memoryEvents: GravityShadowTelemetryEvent[] = [];

export function createGravityShadowTelemetryEvent(
  type: GravityShadowTelemetryEvent["type"],
  result: GravityIntentResult,
  now = Date.now(),
): GravityShadowTelemetryEvent {
  return {
    type,
    ts: now,
    state: result.state,
    intentScore: Number(result.intentScore.toFixed(4)),
    confidence: Number(result.confidence.toFixed(4)),
    proximity: Number(result.proximity.toFixed(4)),
    velocity: Number(result.velocity.toFixed(4)),
    shadowOnly: result.shadowOnly,
  };
}

export function recordGravityShadowTelemetry(event: GravityShadowTelemetryEvent): GravityShadowTelemetryEvent {
  memoryEvents.push(event);
  if (memoryEvents.length > 200) memoryEvents.shift();
  return event;
}

export function getGravityShadowTelemetryEvents(): GravityShadowTelemetryEvent[] {
  return [...memoryEvents];
}

export function clearGravityShadowTelemetryEvents(): void {
  memoryEvents.length = 0;
}
