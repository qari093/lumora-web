export type FandomBadgeStatus =
  | "draft"
  | "active"
  | "retired";

export type FandomBadgeCategory =
  | "movie"
  | "series"
  | "music"
  | "gaming"
  | "cross-media";

export type FandomBadgeRecord = {
  id: string;
  title: string;
  category: FandomBadgeCategory;
  entityId?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  status: FandomBadgeStatus;
  createdAt: string;
};

export const FANDOM_BADGE_REGISTRY: FandomBadgeRecord[] = [];

export function registerFandomBadge(
  badge: FandomBadgeRecord
): void {
  FANDOM_BADGE_REGISTRY.push({
    ...badge,
    id: badge.id.trim(),
    title: badge.title.trim(),
    entityId: badge.entityId?.trim(),
  });
}

export function getFandomBadgeById(
  id: string
): FandomBadgeRecord | undefined {
  const normalizedId = id.trim();
  return FANDOM_BADGE_REGISTRY.find((badge) => badge.id === normalizedId);
}

export function getActiveFandomBadges(): FandomBadgeRecord[] {
  return FANDOM_BADGE_REGISTRY.filter((badge) => badge.status === "active");
}
