import type { BlendableCard } from "./fypSourceBlender";

export type LockedPremiumDiscoveryRail = {
  id: string;
  title: string;
  locked: true;
  unlockHint: string;
  cards: BlendableCard[];
};

export const LOCKED_PREMIUM_DISCOVERY_RAIL_IDS = [
  "premium-premieres",
  "premium-pulse",
  "premium-forecast",
] as const;

export type LockedPremiumDiscoveryRailId =
  typeof LOCKED_PREMIUM_DISCOVERY_RAIL_IDS[number];

export function buildLockedPremiumDiscoveryRails(
  cards: BlendableCard[]
): LockedPremiumDiscoveryRail[] {
  return [
    {
      id: "premium-premieres",
      title: "Premium Premieres",
      locked: true,
      unlockHint: "Unlock premium discovery to access premiere-first rails.",
      cards: cards.slice(0, 4),
    },
    {
      id: "premium-pulse",
      title: "Premium Pulse",
      locked: true,
      unlockHint: "Unlock premium discovery to access deeper trend pulse.",
      cards: cards.slice(4, 8),
    },
    {
      id: "premium-forecast",
      title: "Premium Forecast",
      locked: true,
      unlockHint: "Unlock premium discovery to access next-wave predictions.",
      cards: cards.slice(8, 12),
    },
  ];
}

export function getLockedPremiumDiscoveryRail(
  rails: LockedPremiumDiscoveryRail[],
  id: LockedPremiumDiscoveryRailId
): LockedPremiumDiscoveryRail | undefined {
  return rails.find((rail) => rail.id === id);
}
