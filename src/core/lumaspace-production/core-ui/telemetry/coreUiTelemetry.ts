import type { UiTelemetryEvent } from "../types";

export function createUiTelemetryEvent(event: string): UiTelemetryEvent {
  return {
    id: `ui_${event}`,
    event,
    at: Date.now()
  };
}
