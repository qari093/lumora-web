export type BadgeIdentityCardSchema = {
  id: string;
  type: "badge-identity";
  badgeId: string;
  badgeName: string;
  badgeTier: "starter" | "earned" | "rare" | "elite";
  title: string;
  subtitle?: string;
  description: string;
  userId?: string;
  progress?: {
    current: number;
    target: number;
  };
  unlockedAt?: string;
  createdAt: string;
};

export function createBadgeIdentityCard(
  input: BadgeIdentityCardSchema
): BadgeIdentityCardSchema {
  return input;
}

export function isBadgeUnlocked(card: BadgeIdentityCardSchema): boolean {
  return typeof card.unlockedAt === "string" && card.unlockedAt.length > 0;
}
