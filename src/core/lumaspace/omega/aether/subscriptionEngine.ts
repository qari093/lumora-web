import type { AetherEntitlement, AetherSubscription } from "./types";

export function createAetherSubscription(citizenId: string, active: boolean): AetherSubscription {
  if (!citizenId.trim()) throw new Error("citizenId_required");

  return {
    citizenId,
    tier: active ? "aether_pass" : "free",
    active,
    entitlements: active
      ? ["deep_memory", "constellation_gift", "cosmetic_aether", "soundscape_layer"]
      : [],
  };
}

export function hasEntitlement(subscription: AetherSubscription, entitlement: AetherEntitlement): boolean {
  return subscription.active && subscription.entitlements.includes(entitlement);
}
