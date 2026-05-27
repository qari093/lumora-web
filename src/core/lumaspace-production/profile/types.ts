export interface ProfileIdentity {
  userId: string;
  displayName: string;
  aura: string;
  visibility: "private" | "friends" | "public";
}

export interface HeroSparkState {
  sparkId: string;
  freshnessScore: number;
  atmosphere: string;
}

export interface ProfileUniverseRuntime {
  active: boolean;
  identity: ProfileIdentity;
  hero: HeroSparkState;
}
