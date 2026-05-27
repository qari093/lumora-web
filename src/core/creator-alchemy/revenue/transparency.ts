import type { RevenueTransparencySnapshot } from "./types";

export function buildRevenueTransparencySnapshot(input: RevenueTransparencySnapshot): RevenueTransparencySnapshot {
  return {
    patronageActive: input.patronageActive,
    fiatBridgeAllowed: input.fiatBridgeAllowed,
    antiCasinoPassed: input.antiCasinoPassed,
    creatorMajorityShare: input.creatorMajorityShare
  };
}

export function revenueSystemSafe(snapshot: RevenueTransparencySnapshot): boolean {
  return snapshot.antiCasinoPassed && snapshot.creatorMajorityShare;
}
