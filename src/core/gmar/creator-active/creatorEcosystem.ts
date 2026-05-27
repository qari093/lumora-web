export type GmarCreatorProfile = {
  creatorId: string;
  playerId: string;
  displayName: string;
  factionName: string;
  publishedEvents: number;
  totalAudience: number;
  monetizationEnabled: boolean;
  moderationStatus: "clean" | "review" | "restricted";
  createdAt: string;
  updatedAt: string;
};

export function createGmarCreatorProfile(input: {
  playerId: string;
  displayName: string;
  factionName?: string;
  now?: Date;
}): GmarCreatorProfile {
  const playerId = input.playerId.trim();
  const displayName = input.displayName.trim();

  if (!playerId || !displayName) {
    throw new Error("GMAR creator profile requires playerId and displayName.");
  }

  const iso = (input.now ?? new Date()).toISOString();

  return {
    creatorId: `creator_${playerId}`,
    playerId,
    displayName,
    factionName: input.factionName?.trim() || `${displayName}'s Faction`,
    publishedEvents: 0,
    totalAudience: 0,
    monetizationEnabled: false,
    moderationStatus: "clean",
    createdAt: iso,
    updatedAt: iso
  };
}

export function enableGmarCreatorMonetization(
  profile: GmarCreatorProfile
): GmarCreatorProfile {
  if (profile.moderationStatus !== "clean") {
    throw new Error("GMAR creator monetization requires clean moderation status.");
  }

  return {
    ...profile,
    monetizationEnabled: true,
    updatedAt: new Date().toISOString()
  };
}

export function publishGmarCreatorEvent(
  profile: GmarCreatorProfile
): GmarCreatorProfile {
  if (profile.moderationStatus === "restricted") {
    throw new Error("Restricted GMAR creator cannot publish events.");
  }

  return {
    ...profile,
    publishedEvents: profile.publishedEvents + 1,
    updatedAt: new Date().toISOString()
  };
}

export function assertGmarCreatorProfile(profile: GmarCreatorProfile): true {
  if (
    !profile.creatorId ||
    !profile.playerId ||
    !profile.displayName ||
    profile.publishedEvents < 0 ||
    profile.totalAudience < 0
  ) {
    throw new Error("Invalid GMAR creator profile.");
  }

  return true;
}
