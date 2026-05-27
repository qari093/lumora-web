import type { HeroSparkState, ProfileIdentity } from "../types";

export function createProfileRenderModel(identity: ProfileIdentity, hero: HeroSparkState) {
  return {
    title: identity.displayName,
    heroSparkId: hero.sparkId,
    auraClass: `aura-${identity.aura}`,
    stale: hero.freshnessScore < 0.3
  };
}
