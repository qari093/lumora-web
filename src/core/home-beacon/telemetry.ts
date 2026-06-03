export type HomeBeaconTelemetryEvent = {
  type: "view" | "tap" | "expand" | "collapse" | "breath";
  ts: number;
  source: "home_beacon";
};

export function createHomeBeaconTelemetry(type: HomeBeaconTelemetryEvent["type"], ts = Date.now()): HomeBeaconTelemetryEvent {
  return { type, ts, source: "home_beacon" };
}
