import type { ShareTelemetryEvent } from "../telemetry/events";

export type ShareEventListener = (event: ShareTelemetryEvent) => void;

const listeners = new Set<ShareEventListener>();

export function subscribeShareEvents(listener: ShareEventListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function publishShareEvent(event: ShareTelemetryEvent): void {
  for (const listener of listeners) {
    listener(event);
  }
}
