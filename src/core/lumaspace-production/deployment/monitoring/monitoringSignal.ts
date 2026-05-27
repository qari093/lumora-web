import type { MonitoringSignal } from "../types";

export function createMonitoringSignal(): MonitoringSignal {
  return {
    id: "monitor_001",
    latencyMs: 42
  };
}
