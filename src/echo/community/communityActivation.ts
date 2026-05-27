export const communitySystems = [
  "shared-aura",
  "civilization-events",
  "artist-community",
] as const;

export function communityActivationReady() {
  return true;
}

export function sharedListening() {
  return { synchronized: true };
}

export function emotionalEvents() {
  return { active: true };
}
