import type { EmotionalHotDrop } from "./hotDrop";

export type CollectiveBadge = {
  badgeId: string;
  title: string;
  rarity: "shared" | "legendary";
  participants: number;
};

export function createCollectiveBadge(
  drop: EmotionalHotDrop
): CollectiveBadge {
  return {
    badgeId: `badge_${drop.dropId}`,
    title:
      drop.participants >= 1000
        ? "Global Synchronization"
        : "Shared Atmosphere",
    rarity:
      drop.participants >= 1000
        ? "legendary"
        : "shared",
    participants: drop.participants
  };
}
