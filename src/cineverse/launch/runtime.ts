export const launchPhases = [
  "silent-launch",
  "community-ignition",
  "global-expansion",
] as const;

export function createLaunchEvent(name: string) {
  return {
    name,
    active: true,
    synchronized: true,
  };
}

export function shouldSyndicateToLumora(event: { active: boolean }) {
  return event.active;
}

export function canActivateGlobalLaunch(seededFilms: number) {
  return seededFilms >= 100;
}
