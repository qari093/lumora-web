import type { ProfileIdentity, HeroSparkState, ProfileUniverseRuntime } from "../types";

export function validateProfileIdentity(identity: ProfileIdentity): boolean {
  return Boolean(identity.userId && identity.displayName && identity.aura && identity.visibility);
}

export function validateHeroSparkState(hero: HeroSparkState): boolean {
  return Boolean(hero.sparkId && hero.atmosphere && hero.freshnessScore >= 0 && hero.freshnessScore <= 1);
}

export function validateProfileUniverseRuntime(runtime: ProfileUniverseRuntime): boolean {
  return Boolean(runtime.active === true && validateProfileIdentity(runtime.identity) && validateHeroSparkState(runtime.hero));
}
