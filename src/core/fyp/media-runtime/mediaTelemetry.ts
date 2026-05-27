export type MediaTelemetryEvent = {
  assetId: string;
  event: "play" | "pause" | "complete" | "replay" | "buffer";
  value: number;
};

export function createMediaTelemetryEvent(input: {
  assetId: string;
  event: MediaTelemetryEvent["event"];
  value?: number;
}): MediaTelemetryEvent {
  if (!input.assetId.trim()) {
    throw new Error("Media telemetry requires assetId.");
  }

  return {
    assetId: input.assetId,
    event: input.event,
    value: input.value ?? 1
  };
}
