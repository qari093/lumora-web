import type { ExternalPlatform } from "./platformTypes";

export type BridgeHealth = {
  platform: ExternalPlatform;
  healthy: boolean;
  latencyMs: number;
  lastCheckedAt: string;
};

export function createBridgeHealth(platform: ExternalPlatform, healthy = true, latencyMs = 0): BridgeHealth {
  return {
    platform,
    healthy,
    latencyMs,
    lastCheckedAt: new Date().toISOString(),
  };
}

export function selectHealthyBridge<T extends { platform: ExternalPlatform }>(items: T[], health: BridgeHealth[]): T | undefined {
  const healthMap = new Map(health.map((item) => [item.platform, item]));
  return items.find((item) => healthMap.get(item.platform)?.healthy !== false);
}
