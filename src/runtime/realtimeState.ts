import { deriveDashboardState } from "./runtimeBridge";
import { getRuntimeVersion } from "./realtimeVersion";

export async function getRealtimeDashboardPayload() {
  const version = getRuntimeVersion();
  const state = await deriveDashboardState();

  return {
    version,
    state,
    emittedAt: new Date().toISOString(),
    transport: "polling-realtime-v1" as const,
  };
}
