import type { ExternalPlatform } from "./platformTypes";

export function createBridgeTelemetryEvent(params: {
  shareId: string;
  platform: ExternalPlatform;
  status: "opened" | "completed" | "failed" | "fallback";
}) {
  return {
    id: `bridge_telemetry_${params.shareId}_${params.platform}_${params.status}`,
    shareId: params.shareId,
    platform: params.platform,
    status: params.status,
    privacySafe: true,
    at: new Date().toISOString(),
  };
}
