export type GmarPlayerFaction = "aurora" | "nexus" | "vanguard";

export type GmarPlayerProfile = {
  userId: string;
  playerId: string;
  displayName: string;
  faction: GmarPlayerFaction;
  level: number;
  xp: number;
  avatarReady: boolean;
  createdAt: string;
  updatedAt: string;
};

export function createGmarPlayerProfile(input: {
  userId: string;
  displayName?: string;
  faction?: GmarPlayerFaction;
  now?: Date;
}): GmarPlayerProfile {
  const userId = input.userId.trim();

  if (!userId) {
    throw new Error("GMAR player userId is required.");
  }

  const now = input.now ?? new Date();
  const iso = now.toISOString();

  return {
    userId,
    playerId: `gmar_${userId}`,
    displayName: input.displayName?.trim() || "GMAR Player",
    faction: input.faction ?? "aurora",
    level: 1,
    xp: 0,
    avatarReady: true,
    createdAt: iso,
    updatedAt: iso
  };
}

export function assertGmarPlayerProfile(profile: GmarPlayerProfile): true {
  if (
    !profile.userId ||
    !profile.playerId ||
    profile.level < 1 ||
    profile.xp < 0 ||
    profile.avatarReady !== true
  ) {
    throw new Error("Invalid GMAR player profile.");
  }

  return true;
}
